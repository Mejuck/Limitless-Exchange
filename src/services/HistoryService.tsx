import { QueryObserverResult, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { PropsWithChildren, createContext, useContext, useMemo } from 'react'
import { Hash, formatUnits } from 'viem'
import { defaultChain, newSubgraphURI } from '@/constants'
import { useWalletAddress } from '@/hooks/use-wallet-address'
import { usePriceOracle } from '@/providers'
import { useAxiosPrivateClient } from '@/services/AxiosPrivateClient'
import { useLimitlessApi } from '@/services/LimitlessApi'
import { useAllMarkets } from '@/services/MarketsService'
import { Address } from '@/types'
import { NumberUtil } from '@/utils'

interface IHistoryService {
  trades: HistoryTrade[] | undefined
  getTrades: () => Promise<QueryObserverResult<HistoryTrade[], Error>>
  redeems: HistoryRedeem[] | undefined
  getRedeems: () => Promise<QueryObserverResult<HistoryRedeem[], Error>>
  positions: HistoryPosition[] | undefined
  getPositions: () => Promise<QueryObserverResult<HistoryPosition[], Error>>
  balanceInvested: string
  balanceToWin: string
  tradesAndPositionsLoading: boolean
}

const HistoryServiceContext = createContext({} as IHistoryService)

export const useHistory = () => useContext(HistoryServiceContext)

export const HistoryServiceProvider = ({ children }: PropsWithChildren) => {
  /**
   * ACCOUNT
   */
  const walletAddress = useWalletAddress()
  const privateClient = useAxiosPrivateClient()

  /**
   * UTILS
   */
  const { convertAssetAmountToUsd } = usePriceOracle()

  const { supportedTokens } = useLimitlessApi()

  /**
   * QUERIES
   */
  const {
    data: trades,
    refetch: getTrades,
    isLoading: tradesLoading,
  } = useQuery({
    queryKey: ['trades', walletAddress],
    queryFn: async () => {
      if (!walletAddress) {
        return []
      }
      try {
        const response = await privateClient.get<HistoryTrade[]>(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/portfolio/trades`
        )
        return response.data
      } catch (error) {
        console.error('Error fetching trades:', error)
        return []
      }
    },
    enabled: !!walletAddress && !!supportedTokens?.length,
  })

  const {
    data: redeems,
    refetch: getRedeems,
    isLoading: redeemsLoading,
  } = useQuery({
    queryKey: ['redeems', walletAddress],
    queryFn: async () => {
      if (!walletAddress) {
        return []
      }
      try {
        const response = await privateClient.get<HistoryRedeem[]>(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/portfolio/redeems`
        )
        return response.data
      } catch (error) {
        console.error('Error fetching redeems:', error)
        return []
      }
    },
  })

  const {
    data: positions,
    refetch: getPositions,
    isLoading: positionsLoading,
  } = useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      if (!walletAddress) {
        return []
      }
      try {
        const response = await privateClient.get<HistoryPosition[]>(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/portfolio/positions`
        )
        return response.data
      } catch (error) {
        console.error('Error fetching positions:', error)
        return []
      }
    },
    enabled: !!walletAddress,
  })

  /**
   * BALANCES
   */
  const balanceInvested = useMemo(() => {
    let _balanceInvested = 0
    positions?.forEach((position) => {
      let positionUsdAmount = 0
      const token = supportedTokens?.find(
        (token) => token.symbol === position.market.collateral?.symbol
      )
      if (!!token) {
        positionUsdAmount = convertAssetAmountToUsd(token.priceOracleId, position.collateralAmount)
      }
      _balanceInvested += positionUsdAmount
    })
    return NumberUtil.toFixed(_balanceInvested, 2)
  }, [positions])

  const balanceToWin = useMemo(() => {
    let _balanceToWin = 0
    positions?.forEach((position) => {
      let positionOutcomeUsdAmount = 0
      const token = supportedTokens?.find(
        (token) => token.symbol === position.market.collateral?.symbol
      )
      if (!!token) {
        positionOutcomeUsdAmount = convertAssetAmountToUsd(
          token.priceOracleId,
          position.outcomeTokenAmount
        )
      }
      _balanceToWin += positionOutcomeUsdAmount
    })
    return NumberUtil.toFixed(_balanceToWin, 2)
  }, [positions])

  const tradesAndPositionsLoading = tradesLoading || redeemsLoading || positionsLoading

  const contextProviderValue: IHistoryService = {
    trades,
    getTrades,
    redeems,
    getRedeems,
    positions,
    getPositions,
    balanceInvested,
    balanceToWin,
    tradesAndPositionsLoading,
  }

  return (
    <HistoryServiceContext.Provider value={contextProviderValue}>
      {children}
    </HistoryServiceContext.Provider>
  )
}

export type HistoryTrade = {
  market: HistoryMarket
  strategy?: 'Buy' | 'Sell'
  outcomeIndex: number
  outcomeTokenAmounts: string[]
  outcomeTokenAmount?: string // outcome token amount traded
  outcomeTokenPrice?: string // collateral per outcome token
  outcomeTokenNetCost: string
  // outcomePercent?: number // 50% yes / 50% no
  collateralAmount?: string // collateral amount traded
  blockTimestamp: string
  transactionHash: Hash
}

export type HistoryMarket = {
  id: Address
  condition_id: Hash //#TODO align namings to conditionId
  paused?: boolean
  closed?: boolean
  funding?: string
  holdersCount?: number
  collateral?: {
    symbol: string
  }
}

export type HistoryRedeem = {
  payout: string // collateral amount raw
  collateralAmount: string // collateral amount formatted
  conditionId: Hash
  indexSets: string[] // ["1"] for Yes
  outcomeIndex: number
  blockTimestamp: string
  transactionHash: Hash
  collateralToken: string
}

export type HistoryPosition = {
  market: HistoryMarket
  outcomeIndex: number
  outcomeTokenAmount?: string
  collateralAmount?: string // collateral amount invested
  latestTrade?: HistoryTrade
}
