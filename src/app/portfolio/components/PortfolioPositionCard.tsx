import { HStack, Stack, Text, Box, Icon, VStack, Button, Divider } from '@chakra-ui/react'
import BigNumber from 'bignumber.js'
import { SyntheticEvent, useMemo, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { Address } from 'viem'
import MobileDrawer from '@/components/common/drawer'
import Loader from '@/components/common/loader'
import MarketPage from '@/components/common/markets/market-page'
import Paper from '@/components/common/paper'
import Skeleton from '@/components/common/skeleton'
import useMarketGroup from '@/hooks/use-market-group'
import ActiveIcon from '@/resources/icons/active-icon.svg'
import ArrowRightIcon from '@/resources/icons/arrow-right-icon.svg'
import CalendarIcon from '@/resources/icons/calendar-icon.svg'
import ClosedIcon from '@/resources/icons/close-rounded-icon.svg'
import WinIcon from '@/resources/icons/win-icon.svg'
import { ClickEvent, HistoryPosition, useAmplitude, useTradingService } from '@/services'
import { useAllMarkets, useMarket } from '@/services/MarketsService'
import { paragraphMedium, paragraphRegular } from '@/styles/fonts/fonts.styles'
import { Market } from '@/types'
import { NumberUtil } from '@/utils'

export interface IPortfolioPositionCard {
  position: HistoryPosition
  market?: Market
  prices?: {
    market: `0x${string}`
    prices: number[]
  }
}

const unhoveredColors = {
  main: 'grey.800',
  secondary: 'grey.500',
}

const hoverColors = {
  main: 'white',
  secondary: 'transparent.700',
}

const PortfolioPositionCard = ({ position, prices }: IPortfolioPositionCard) => {
  const [colors, setColors] = useState(unhoveredColors)
  const [isLoadingRedeem, setIsLoadingRedeem] = useState(false)

  const { trackClicked } = useAmplitude()
  const { redeem, onOpenMarketPage, setMarket, setMarketGroup } = useTradingService()

  /**
   * MARKET DATA
   */

  const allMarkets = useAllMarkets()

  const targetMarket = allMarkets.find((market) => market.address === position.market.id)

  const contractPrice = new BigNumber(prices?.prices[position.outcomeIndex] || 1)
    .dividedBy(100)
    .dividedBy(
      new BigNumber(
        position.latestTrade?.outcomeTokenPrice ? +position.latestTrade.outcomeTokenPrice : 1
      )
    )
    .toNumber()

  const contractPriceChanged = useMemo(() => {
    let price
    if (contractPrice < 1) {
      price = NumberUtil.toFixed((1 - contractPrice) * 100, 0)
    } else {
      price = NumberUtil.toFixed((contractPrice - 1) * 100, 0)
    }
    if (contractPrice < 1) {
      return (
        <Text {...paragraphMedium} color={colors.main === 'white' ? 'white' : 'red.500'}>
          &#x2193;
          {price}%
        </Text>
      )
    }
    return (
      <Text {...paragraphMedium} color={colors.main === 'white' ? 'white' : 'green.500'}>
        &#x2191;
        {price}%
      </Text>
    )
  }, [contractPrice, colors.main])

  const getOutcomeNotation = () => {
    const outcomeTokenId = position.outcomeIndex ?? 0
    const defaultOutcomes = ['Yes', 'No']

    return defaultOutcomes[outcomeTokenId]
  }

  const { data: oneMarket, refetch: refetchMarket } = useMarket(position.market.id, false, false)
  const { data: marketGroup, refetch: refetchMarketGroup } = useMarketGroup(
    targetMarket?.group?.slug,
    false,
    false
  )

  const handleOpenMarketPage = async () => {
    if (position.market?.id) {
      if (!oneMarket) {
        const { data: fetchedMarket } = await refetchMarket()
        if (fetchedMarket) {
          onOpenMarketPage(fetchedMarket, 'History card')
        }
      } else {
        onOpenMarketPage(oneMarket, 'History card')
      }
    }

    if (targetMarket?.group?.slug) {
      if (!marketGroup) {
        const { data: fetchedMarketGroup } = await refetchMarketGroup()
        if (fetchedMarketGroup) {
          onOpenMarketPage(fetchedMarketGroup, 'History card')
        }
      } else {
        onOpenMarketPage(marketGroup, 'History card')
      }
    }
  }

  const ClaimButton = () => {
    return (
      <Button
        variant='white'
        onClick={async (e: SyntheticEvent) => {
          e.stopPropagation()
          setIsLoadingRedeem(true)
          trackClicked(ClickEvent.ClaimRewardOnPortfolioClicked, {
            platform: isMobile ? 'mobile' : 'desktop',
          })
          await redeem({
            conditionId: position?.market.condition_id as Address,
            collateralAddress: position?.market?.collateral?.id as Address,
            marketAddress: position.market.id as Address,
            outcomeIndex: position.latestTrade?.outcomeIndex as number,
          })
          setIsLoadingRedeem(false)
        }}
        minW='162px'
      >
        {isLoadingRedeem ? (
          <Loader />
        ) : (
          <>
            <Icon as={WinIcon} color={'black'} />
            Claim{' '}
            {`${NumberUtil.formatThousands(position.outcomeTokenAmount, 6)} ${
              position.market.collateral?.symbol
            }`}
          </>
        )}
      </Button>
    )
  }

  const cardColors = useMemo(() => {
    if (position.market.closed) {
      return {
        main: 'white',
        secondary: isMobile ? 'white' : 'transparent.700',
      }
    }
    return {
      main: colors.main,
      secondary: colors.secondary,
    }
  }, [position, colors])

  const StatusIcon = ({ isClosed }: { isClosed: boolean | undefined }) => {
    return isClosed ? (
      <>
        <Icon as={ClosedIcon} width={'16px'} height={'16px'} color={cardColors.secondary} />
        <Text {...paragraphMedium} color={cardColors.secondary}>
          Closed
        </Text>
      </>
    ) : (
      <>
        <ActiveIcon width={16} height={16} />
        <Text {...paragraphMedium} color={cardColors.secondary}>
          Active
        </Text>
      </>
    )
  }

  return isMobile ? (
    <MobileDrawer
      trigger={
        <Paper
          onClick={handleOpenMarketPage}
          w={'full'}
          bg={position.market?.closed ? 'green.500' : 'grey.200'}
          p={'16px'}
          borderRadius='8px'
        >
          <Stack spacing={'8px'}>
            <HStack w={'full'} spacing={1} justifyContent={'space-between'}>
              <Text {...paragraphMedium} color={cardColors.main}>
                {position.market.title}
              </Text>
              <Icon as={ArrowRightIcon} width={'16px'} height={'16px'} color={cardColors.main} />
            </HStack>
            <HStack>
              {position.market?.closed ? (
                <Text {...paragraphMedium} color={cardColors.main}>
                  {`Won ${NumberUtil.formatThousands(position.outcomeTokenAmount, 4)} ${
                    position.market.collateral?.symbol
                  }`}
                </Text>
              ) : (
                <HStack>
                  {!position || !prices ? (
                    <Skeleton height={20} />
                  ) : (
                    <Text fontSize={'16px'} lineHeight={'20px'} fontWeight={500}>
                      {`${NumberUtil.toFixed(
                        new BigNumber(position.outcomeTokenAmount || '1')
                          .multipliedBy(
                            new BigNumber(prices?.prices?.[position.outcomeIndex] || 1).dividedBy(
                              100
                            )
                          )
                          .toString(),
                        6
                      )} ${position.market?.collateral?.symbol}`}
                    </Text>
                  )}
                  <Box gap={0} fontSize={'16px'} fontWeight={500}>
                    {contractPriceChanged}
                  </Box>
                </HStack>
              )}
            </HStack>
            <HStack color={cardColors.secondary}>
              <HStack gap={1}>{<StatusIcon isClosed={position?.market?.closed} />}</HStack>
              <HStack gap={1} color={cardColors.secondary}>
                <CalendarIcon width={'16px'} height={'16px'} />
                <Text {...paragraphMedium} color={cardColors.secondary}>
                  {position?.market.expirationDate}
                </Text>
              </HStack>
            </HStack>
            <HStack>{position.market?.closed && <ClaimButton />}</HStack>
          </Stack>

          <Divider w={'full'} h={'1px'} mb={'10px'} mt={'10px'} />

          <Stack w={'full'}>
            <HStack alignItems={'start'} gap={0} justifyContent={'space-between'}>
              <Text {...paragraphMedium} color={cardColors.secondary}>
                Position
              </Text>
              <Text color={cardColors.main} fontWeight={400} lineHeight={'20px'} fontSize={'16px'}>
                {getOutcomeNotation()}
              </Text>
            </HStack>
          </Stack>
          <Stack w={'full'} mt={'8px'}>
            <HStack alignItems={'start'} gap={0} justifyContent={'space-between'}>
              <Text {...paragraphMedium} color={cardColors.secondary}>
                Invested
              </Text>
              <Text color={cardColors.main} lineHeight={'20px'} fontWeight={400} fontSize={'16px'}>
                {`${NumberUtil.toFixed(position.collateralAmount, 6)} ${
                  position.market?.collateral?.symbol
                }`}
              </Text>
            </HStack>
          </Stack>
        </Paper>
      }
      variant='black'
      onClose={() => {
        setMarket(null)
        setMarketGroup(null)
      }}
    >
      <MarketPage />
    </MobileDrawer>
  ) : (
    <Paper
      w={'full'}
      bg={position.market?.closed ? 'green.500' : 'grey.200'}
      _hover={{
        bg: position.market?.closed ? 'green.600' : 'blue.500',
      }}
      cursor='pointer'
      onMouseEnter={() => setColors(hoverColors)}
      onMouseLeave={() => setColors(unhoveredColors)}
      onClick={handleOpenMarketPage}
      borderRadius='8px'
    >
      <Stack direction='row'>
        <HStack w={'full'} spacing={1} justifyContent={'space-between'}>
          <Box>
            <Text {...paragraphMedium} color={cardColors.main}>
              {position.market.title}
            </Text>
          </Box>

          <HStack>
            {position.market?.closed ? (
              <ClaimButton />
            ) : (
              <>
                {!position || !prices ? (
                  <Box w='120px'>
                    <Skeleton height={20} />
                  </Box>
                ) : (
                  <>
                    <Text {...paragraphMedium} color={cardColors.main}>
                      {`${NumberUtil.toFixed(
                        new BigNumber(position.outcomeTokenAmount || '1')
                          .multipliedBy(
                            new BigNumber(prices.prices[position.outcomeIndex] || 1).dividedBy(100)
                          )
                          .toString(),
                        position.market.collateral?.symbol === 'USDC' ? 2 : 6
                      )} ${position.market?.collateral?.symbol}`}
                    </Text>
                    <Box gap={0}>{contractPriceChanged}</Box>
                  </>
                )}
              </>
            )}
          </HStack>
        </HStack>
      </Stack>

      <Stack direction='row' w={'full'} justifyContent={'space-between'} mt={'12px'}>
        <HStack w={'full'}>
          <VStack alignItems={'start'} gap={1}>
            <Text {...paragraphMedium} color={cardColors.secondary}>
              Position
            </Text>
            <Text {...paragraphRegular} color={cardColors.main}>
              {getOutcomeNotation()}
            </Text>
          </VStack>

          <VStack alignItems={'start'} gap={1} ml={'24px'}>
            <Text {...paragraphMedium} color={cardColors.secondary}>
              Invested
            </Text>
            <Text {...paragraphRegular} color={cardColors.main}>
              {!position ? (
                <Box w='68px'>
                  <Skeleton height={20} />
                </Box>
              ) : (
                `${NumberUtil.toFixed(
                  position.collateralAmount,
                  position.market?.collateral?.symbol === 'USDC' ? 2 : 6
                )} ${position.market?.collateral?.symbol}`
              )}
            </Text>
          </VStack>
        </HStack>

        <HStack w={'full'} justifyContent={'flex-end'} alignItems={'flex-end'}>
          <HStack gap={1} color={cardColors.secondary}>
            {<StatusIcon isClosed={position.market?.closed} />}
          </HStack>
          <HStack gap={1} color={cardColors.secondary}>
            <CalendarIcon width={'16px'} height={'16px'} />
            <Text {...paragraphMedium} color={cardColors.secondary}>
              {new Date(position.market?.expirationDate).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </HStack>
        </HStack>
      </Stack>
    </Paper>
  )
}

export default PortfolioPositionCard
