import { isMobile } from 'react-device-detect'
import { ClickEvent, TradeQuotes, useAmplitude } from '@/services'
import { Box, Button, HStack, Text, useOutsideClick, VStack } from '@chakra-ui/react'
import { paragraphMedium, paragraphRegular } from '@/styles/fonts/fonts.styles'
import ThumbsUpIcon from '@/resources/icons/thumbs-up-icon.svg'
import ThumbsDownIcon from '@/resources/icons/thumbs-down-icon.svg'
import CheckedIcon from '@/resources/icons/checked-icon.svg'
import { NumberUtil } from '@/utils'
import { Market, MarketStatus } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Dispatch,
  LegacyRef,
  MutableRefObject,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useWeb3Service } from '@/services/Web3Service'
import ConfirmButton from '@/app/(markets)/markets/[address]/components/trade-widgets/confirm-button'
import { sleep } from '@etherspot/prime-sdk/dist/sdk/common'
import Loader from '@/components/common/loader'
import { parseUnits } from 'viem'
import BigNumber from 'bignumber.js'
import Cookies from 'js-cookie'
import BlockedTradeTemplate from '@/app/(markets)/markets/[address]/components/trade-widgets/blocked-trade-template'

interface ActionButtonProps {
  disabled: boolean
  onClick: () => Promise<void>
  market: Market
  amount: string
  option: 'Yes' | 'No'
  price?: number
  quote?: TradeQuotes | null
  decimals?: number
  marketType: 'group' | 'single'
  showReturnPercent: boolean
  setShowReturnPercent: Dispatch<SetStateAction<boolean>>
  showFeeInValue: boolean
  setShowFeeInValue: Dispatch<SetStateAction<boolean>>
  isExceedsBalance: boolean
}

const MotionBox = motion(Box)

export type ButtonStatus =
  | 'initial'
  | 'confirm'
  | 'transaction-broadcasted'
  | 'success'
  | 'error'
  | 'unlock'
  | 'unlocking'

export default function ActionButton({
  disabled,
  onClick,
  quote,
  market,
  price,
  option,
  amount,
  decimals,
  marketType,
  showFeeInValue,
  setShowReturnPercent,
  setShowFeeInValue,
  showReturnPercent,
  isExceedsBalance,
}: ActionButtonProps) {
  const [marketLocked, setMarketLocked] = useState(false)
  const [tradingBlocked, setTradingBlocked] = useState(false)
  /**
   * ANALITYCS
   */
  const { trackClicked } = useAmplitude()
  const country = Cookies.get('limitless_geo')

  const ref = useRef<HTMLElement>()
  const { client, checkAllowance, approveContract } = useWeb3Service()

  const [status, setStatus] = useState<ButtonStatus>('initial')
  const INFO_MSG = 'Market is locked. Trading stopped. Please await for final resolution.'
  const TRADING_BLOCKED_MSG =
    'Trading is unavailable to individuals or companies based in the U.S. or restricted territories.'

  useOutsideClick({
    ref: ref as MutableRefObject<HTMLElement>,
    handler: () => {
      if (!['transaction-broadcasted', 'success'].includes(status)) {
        setStatus('initial')
      }
    },
  })

  const headerStatus = useMemo(() => {
    let content
    switch (status) {
      case 'transaction-broadcasted':
        content = (
          <>
            <Loader />
            <Text {...paragraphMedium} color='white'>
              Buying...
            </Text>
          </>
        )
        break
      case 'success':
        content = (
          <>
            <AnimatePresence>
              <MotionBox
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                position='absolute'
                width='100%'
                display='flex'
                alignItems='center'
                gap='8px'
              >
                <CheckedIcon width={16} height={16} />
                <Text {...paragraphMedium} color='white'>
                  Bought
                </Text>
              </MotionBox>
            </AnimatePresence>
          </>
        )
        break
      default:
        content = (
          <>
            {option === 'Yes' ? (
              <ThumbsUpIcon width='16px' height='16px' />
            ) : (
              <ThumbsDownIcon width={16} height={16} />
            )}
            <HStack gap='4px'>
              <Text {...paragraphMedium} color='white'>
                {price}%
              </Text>
              <Text {...paragraphMedium} color='white'>
                {option}
              </Text>
            </HStack>
          </>
        )
        break
    }
    return (
      <HStack gap='8px' color='white' minH='20px' w='full'>
        {content}
      </HStack>
    )
  }, [option, price, status])

  const transformValue = isMobile ? -304 : -264

  const buttonsTransform = isMobile ? 16 : 0

  const handleActionIntention = async () => {
    if (isExceedsBalance) {
      return
    }
    if (market?.status === MarketStatus.LOCKED) {
      setMarketLocked(true)
      return
    }
    console.log(country)
    console.log(encodeURI(country as string))
    if (encodeURI(country as string) === 'VVM') {
      setTradingBlocked(true)
      return
    }
    if (status !== 'initial') {
      setStatus('initial')
      return
    }
    if (client === 'eoa') {
      const allowance = await checkAllowance(market.address, market.collateralToken.address)
      const amountBI = parseUnits(amount, decimals || 18)
      if (amountBI > allowance) {
        setStatus('unlock')
        return
      }
      setStatus('confirm')
      return
    }
    setStatus('confirm')
    return
  }

  const handleApprove = async () => {
    try {
      setStatus('unlocking')
      const amountBI = parseUnits(amount, decimals || 18)
      await approveContract(market.address, market.collateralToken.address, amountBI)
      trackClicked(ClickEvent.ConfirmCapClicked, {
        address: market?.address,
        strategy: 'Buy',
        outcome: option,
        walletType: 'eoa',
      })
      await sleep(2)
      setStatus('confirm')
      return
    } catch (e) {
      setStatus('initial')
      return
    }
  }

  const handleConfirmClicked = async () => {
    try {
      setStatus('transaction-broadcasted')
      await onClick()
      setStatus('success')
      return
    } catch (e) {
      setStatus('initial')
      return
    }
  }

  const handleReturnToggleClicked = (e: SyntheticEvent) => {
    trackClicked(ClickEvent.ReturnTradingDetailsClicked, {
      from: showReturnPercent ? 'numbers' : 'percentage',
      to: showReturnPercent ? 'percentage' : 'numbers',
      platform: isMobile ? 'mobile' : 'desktop',
      marketAddress: market.address,
    })
    e.stopPropagation()
    setShowReturnPercent(!showReturnPercent)
  }

  const handleFeeToggleClicked = (e: SyntheticEvent) => {
    trackClicked(ClickEvent.FeeTradingDetailsClicked, {
      from: showFeeInValue ? 'numbers' : 'percentage',
      to: showFeeInValue ? 'percentage' : 'numbers',
      platform: isMobile ? 'mobile' : 'desktop',
      marketAddress: market.address,
    })
    e.stopPropagation()
    setShowFeeInValue(!showFeeInValue)
  }

  const blockedMessage = useMemo(() => {
    if (tradingBlocked) {
      return (
        <BlockedTradeTemplate
          onClose={() => setTradingBlocked(false)}
          message={TRADING_BLOCKED_MSG}
        />
      )
    }
    if (marketLocked) {
      return <BlockedTradeTemplate onClose={() => setMarketLocked(false)} message={INFO_MSG} />
    }
  }, [marketLocked, tradingBlocked])

  useEffect(() => {
    const returnToInitial = async () => {
      await sleep(2)
      await setStatus('initial')
    }
    if (status === 'success') {
      returnToInitial()
    }
  }, [status])

  return (
    <HStack w='full' gap={'8px'} ref={ref as LegacyRef<HTMLDivElement>}>
      <MotionBox
        animate={{ x: ['unlock', 'unlocking', 'confirm'].includes(status) ? transformValue : 0 }}
        transition={{ duration: 0.5 }}
        w='full'
        // ref={isMobile ? (ref as MutableRefObject<HTMLElement>) : undefined}
      >
        <Button
          bg='rgba(255, 255, 255, 0.2)'
          px='12px'
          py='8px'
          w={isMobile ? `calc(100vw - 32px)` : '296px'}
          h='unset'
          alignItems='flex-start'
          flexDir='column'
          gap={isMobile ? '16px' : '8px'}
          _hover={{
            backgroundColor: 'transparent.300',
          }}
          isDisabled={disabled || ['transaction-broadcasted', 'success'].includes(status)}
          onClick={() => {
            return handleActionIntention()
          }}
          borderRadius='2px'
          sx={{
            WebkitTapHighlightColor: 'transparent !important',
          }}
        >
          {blockedMessage ? (
            blockedMessage
          ) : (
            <>
              {headerStatus}
              <VStack ml='24px' w='calc(100% - 24px)' gap={isMobile ? '8px' : '4px'}>
                <HStack justifyContent='space-between' w='full'>
                  <HStack gap='4px'>
                    <Text {...paragraphRegular} color='white'>
                      Return
                    </Text>
                    {/*<Tooltip*/}
                    {/*// label={*/}
                    {/*//   'Each contract will expire at 0 or 1 WETH, depending on the outcome reported. You may trade partial contracts, ie 0.1'*/}
                    {/*// }*/}
                    {/*>*/}
                    {/*  <InfoIcon width='16px' height='16px' />*/}
                    {/*</Tooltip>*/}
                  </HStack>
                  <Text
                    {...paragraphRegular}
                    color='white'
                    borderBottom={quote?.outcomeTokenAmount ? '1px dashed' : 'unset'}
                    cursor={quote?.outcomeTokenAmount ? 'pointer' : 'default'}
                    onClick={handleReturnToggleClicked}
                  >
                    {showReturnPercent
                      ? `${NumberUtil.toFixed(quote?.roi, 2)}%`
                      : `${NumberUtil.formatThousands(quote?.outcomeTokenAmount, 6)} ${
                          market.collateralToken.symbol
                        }`}
                  </Text>
                </HStack>
                <HStack justifyContent='space-between' w='full'>
                  <HStack gap='4px'>
                    <Text {...paragraphRegular} color='white'>
                      Avg price
                    </Text>
                    {/*<Tooltip*/}
                    {/*// label={*/}
                    {/*//   'Each contract will expire at 0 or 1 WETH, depending on the outcome reported. You may trade partial contracts, ie 0.1'*/}
                    {/*// }*/}
                    {/*>*/}
                    {/*  <InfoIcon width='16px' height='16px' />*/}
                    {/*</Tooltip>*/}
                  </HStack>
                  <Text {...paragraphRegular} color='white'>{`${NumberUtil.formatThousands(
                    quote?.outcomeTokenPrice,
                    6
                  )} ${market?.collateralToken.symbol}`}</Text>
                </HStack>
                <HStack justifyContent='space-between' w='full'>
                  <HStack gap='4px'>
                    <Text {...paragraphRegular} color='white'>
                      Price impact
                    </Text>
                    {/*<Tooltip*/}
                    {/*// label={*/}
                    {/*//   'Each contract will expire at 0 or 1 WETH, depending on the outcome reported. You may trade partial contracts, ie 0.1'*/}
                    {/*// }*/}
                    {/*>*/}
                    {/*  <InfoIcon width='16px' height='16px' />*/}
                    {/*</Tooltip>*/}
                  </HStack>
                  <Text {...paragraphRegular} color='white'>{`${NumberUtil.toFixed(
                    quote?.priceImpact,
                    2
                  )}%`}</Text>
                </HStack>
                <HStack justifyContent='space-between' w='full'>
                  <HStack gap='4px'>
                    <Text {...paragraphRegular} color='white'>
                      Fee
                    </Text>
                    {/*<Tooltip*/}
                    {/*// label={*/}
                    {/*//   'Each contract will expire at 0 or 1 WETH, depending on the outcome reported. You may trade partial contracts, ie 0.1'*/}
                    {/*// }*/}
                    {/*>*/}
                    {/*  <InfoIcon width='16px' height='16px' />*/}
                    {/*</Tooltip>*/}
                  </HStack>
                  <Text
                    {...paragraphRegular}
                    color='white'
                    borderBottom={quote?.outcomeTokenAmount ? '1px dashed' : 'unset'}
                    onClick={handleFeeToggleClicked}
                  >
                    {showFeeInValue
                      ? `${NumberUtil.toFixed(
                          new BigNumber(amount).dividedBy(100).toNumber(),
                          6
                        )} ${market?.collateralToken.symbol}`
                      : '1%'}
                  </Text>
                </HStack>
              </VStack>
            </>
          )}
        </Button>
      </MotionBox>
      <MotionBox
        animate={{
          x: ['unlock', 'unlocking', 'confirm'].includes(status)
            ? transformValue
            : buttonsTransform,
        }}
        transition={{ duration: 0.5 }}
      >
        <ConfirmButton
          tokenTicker={market.collateralToken.symbol}
          status={status}
          handleConfirmClicked={() => {
            trackClicked(ClickEvent.ConfirmTransactionClicked, {
              address: market?.address,
              outcome: option,
              strategy: 'Buy',
              walletType: client,
              marketType,
            })

            return handleConfirmClicked()
          }}
          onApprove={handleApprove}
          setStatus={setStatus}
        />
      </MotionBox>
    </HStack>
  )
}
