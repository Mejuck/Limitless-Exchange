import { QueryObserverResult, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { PropsWithChildren, createContext, useContext, useMemo } from 'react'
import { Hash } from 'viem'
import { useWalletAddress } from '@/hooks/use-wallet-address'
import { usePriceOracle } from '@/providers'
import { useAxiosPrivateClient } from '@/services/AxiosPrivateClient'
import { useLimitlessApi } from '@/services/LimitlessApi'
import { Address } from '@/types'
import { NumberUtil } from '@/utils'

interface IHistoryService {
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
        const response = await privateClient.get<HistoryPosition[]>(`/portfolio/positions`)
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

  const tradesAndPositionsLoading = positionsLoading

  const contextProviderValue: IHistoryService = {
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

export const usePortfolioHistory = (page: number) => {
  const privateClient = useAxiosPrivateClient()
  return useQuery({
    queryKey: ['history', page],
    queryFn: async (): Promise<AxiosResponse<History>> => {
      return privateClient.get<History>('/portfolio/history', {
        params: {
          page: page,
          limit: 10,
        },
      })
    },
  })
}

export const useInfinityHistory = () => {
  const privateClient = useAxiosPrivateClient()
  const walletAddress = useWalletAddress()
  return useInfiniteQuery<History[], Error>({
    queryKey: ['history-infinity'],
    // @ts-ignore
    queryFn: async ({ pageParam = 1 }) => {
      if (!walletAddress) {
        return []
      }

      const response = await privateClient.get<History[]>(
        '/portfolio/history',

        {
          params: {
            page: pageParam,
            limit: 30,
          },
        }
      )
      return { data: response.data, next: (pageParam as number) + 1 }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // @ts-ignore
      return lastPage.data.data.length === 30 ? lastPage.next : null
    },
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled: !!walletAddress,
  })
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
    id: string
  }
  expirationDate: string
  title: string
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
  collateralSymbol: string
  title: string
}

export type History = {
  data: HistoryPosition[] | HistoryRedeem[]
  totalCount: number
}

export type HistoryPosition = {
  market: HistoryMarket
  outcomeIndex: number
  outcomeTokenAmount?: string
  collateralAmount?: string // collateral amount invested
  latestTrade?: HistoryTrade
}
