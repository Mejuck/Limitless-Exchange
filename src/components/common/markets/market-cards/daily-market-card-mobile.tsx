import { Box, Button, Divider, HStack, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React, { SyntheticEvent, useMemo, useState } from 'react'
import { isMobile } from 'react-device-detect'
import Avatar from '@/components/common/avatar'
import MobileDrawer from '@/components/common/drawer'
import DailyMarketTimer from '@/components/common/markets/market-cards/daily-market-timer'
import MarketPage from '@/components/common/markets/market-page'
import OpenInterestTooltip from '@/components/common/markets/open-interest-tooltip'
import Paper from '@/components/common/paper'
import ProgressBar from '@/components/common/progress-bar'
import Skeleton from '@/components/common/skeleton'
import { useCalculateNoReturn, useCalculateYesReturn } from '@/hooks/use-calculate-return'
import { useMarketFeed } from '@/hooks/use-market-feed'
import CloseIcon from '@/resources/icons/close-icon.svg'
import TooltipIcon from '@/resources/icons/tooltip-icon.svg'
import { ClickEvent, useAmplitude, useTradingService } from '@/services'
import {
  captionMedium,
  h3Bold,
  paragraphMedium,
  paragraphRegular,
} from '@/styles/fonts/fonts.styles'
import { Market } from '@/types'
import { NumberUtil } from '@/utils'
import { defineOpenInterestOverVolume } from '@/utils/market'

interface DailyMarketCardProps {
  market: Market
  analyticParams: { bannerPosition: number; bannerPaginationPage: number }
  markets: Market[]
}

export default function DailyMarketCardMobile({
  market,
  markets,
  analyticParams,
}: DailyMarketCardProps) {
  console.log(market)
  const [estimateOpened, setEstimateOpened] = useState(false)
  const { onOpenMarketPage, onCloseMarketPage, setMarkets, setMarketsSection } = useTradingService()
  const router = useRouter()
  const { data: marketFeedData } = useMarketFeed(market.address)
  const { data: yesReturn, isLoading: yesLoading } = useCalculateYesReturn(
    market.address,
    estimateOpened
  )
  const { data: noReturn, isLoading: noLoading } = useCalculateNoReturn(
    market.address,
    estimateOpened
  )

  const onEstimteEarningOpenClicked = (e: SyntheticEvent) => {
    e.preventDefault()
    e.stopPropagation()
    trackClicked(ClickEvent.EstimateEarningClicked, {
      marketAddress: market.address,
      marketType: 'single',
      marketTags: market.tags,
      marketCategory: market.category,
    })
    setEstimateOpened(true)
  }

  const onCloseEstimateClicked = (e: SyntheticEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setEstimateOpened(false)
  }

  const uniqueUsersTrades = useMemo(() => {
    if (marketFeedData?.data.length) {
      const uniqueUsers = new Map()

      for (const event of marketFeedData.data) {
        if (!uniqueUsers.has(event.user?.account)) {
          uniqueUsers.set(event.user?.account, event)
        }
        if (uniqueUsers.size >= 3) break
      }

      return Array.from(uniqueUsers.values())
    }
    return null
  }, [marketFeedData])

  const isLumy = market.category === 'Lumy'

  const { trackClicked } = useAmplitude()

  const handleLumyButtonClicked = (e: SyntheticEvent) => {
    e.stopPropagation()
    router.push('/lumy')
  }

  const handleMarketPageOpened = () => {
    trackClicked(ClickEvent.MediumMarketBannerClicked, {
      ...analyticParams,
    })
    router.push(`?market=${market.address}`, { scroll: false })
    onOpenMarketPage(market, 'Medium Banner')
    setMarkets(markets)
    setMarketsSection('Medium Banner')
  }

  const onClickJoinPrediction = () => {
    trackClicked(ClickEvent.JoinPredictionClicked, {
      marketAddress: market.address,
      marketTags: market.tags,
      marketType: 'single',
    })
  }

  const content = (
    <Box
      w='full'
      bg={
        isLumy ? 'linear-gradient(90deg, #5F1BEC 0%, #FF3756 27.04%, #FFCB00 99.11%)' : 'grey.100'
      }
      rounded='12px'
      p='2px'
      _hover={{
        ...(!isLumy ? { bg: 'grey.300' } : {}),
      }}
      onClick={handleMarketPageOpened}
    >
      <Paper
        flex={1}
        w={'100%'}
        position={isMobile ? 'unset' : 'relative'}
        cursor='pointer'
        p='14px'
      >
        {isLumy && (
          <Box
            top={0}
            marginLeft='calc(50% - 40px)'
            py='2px'
            px='4px'
            borderBottomLeftRadius='4px'
            borderBottomRightRadius='2px'
            bg={'linear-gradient(90deg, #FF444F -14%, #FF7A30 100%)'}
            onClick={handleLumyButtonClicked}
            className='lumy-button'
            w='fit-content'
            marginTop='-14px'
          >
            <HStack gap='8px' color='grey.white'>
              <Text {...captionMedium} color='grey.white'>
                LUMY AI
              </Text>
              <TooltipIcon width={16} height={16} />
            </HStack>
          </Box>
        )}
        <VStack w='full' gap='56px' mt='8px'>
          <Box w='full'>
            <DailyMarketTimer
              deadline={market.expirationTimestamp}
              deadlineText={market.expirationDate}
              {...paragraphRegular}
              color='grey.500'
            />
            <Text {...h3Bold} mt='4px' textAlign='left'>
              {market.proxyTitle ?? market.title}
            </Text>
          </Box>
          <Box w='full'>
            <HStack w='full' justifyContent='space-between' mb='4px'>
              <Text {...paragraphMedium} color='#0FC591'>
                Yes {market.prices[0]}%
              </Text>
              <Text {...paragraphMedium} color='#FF3756'>
                No {market.prices[1]}%
              </Text>
            </HStack>
            <ProgressBar variant='market' value={market.prices[0]} />
            <HStack w='full' justifyContent='space-between'>
              <HStack gap='4px' mt='8px'>
                {defineOpenInterestOverVolume(
                  market.openInterestFormatted,
                  market.liquidityFormatted
                ).showOpenInterest ? (
                  <>
                    <HStack gap={0}>
                      {uniqueUsersTrades?.map(({ user }, index) => (
                        <Avatar
                          account={user.account || ''}
                          avatarUrl={user.imageURI}
                          key={index}
                          borderColor='grey.100'
                          zIndex={100 + index}
                          border='2px solid'
                          size='20px'
                          color='grey.100 !important'
                          showBorder
                          bg='grey.200'
                          style={{
                            border: '1px solid',
                            marginLeft: index > 0 ? '-6px' : 0,
                          }}
                        />
                      ))}
                    </HStack>
                    <Text {...paragraphRegular} color='grey.500'>
                      Value
                    </Text>
                    <Text {...paragraphRegular} color='grey.500'>
                      {NumberUtil.convertWithDenomination(market.openInterestFormatted, 6)}{' '}
                      {market.collateralToken.symbol}
                    </Text>
                    <OpenInterestTooltip iconColor='grey.500' />
                  </>
                ) : (
                  <>
                    <Box {...paragraphRegular}>💧 </Box>
                    <Text {...paragraphRegular} color='transparent.700'>
                      Liquidity {NumberUtil.convertWithDenomination(market.liquidityFormatted, 6)}{' '}
                      {market.collateralToken.symbol}
                    </Text>
                  </>
                )}
              </HStack>
            </HStack>
            <Box w='full' mt='12px'>
              <Divider orientation='horizontal' borderColor='grey.200' color='grey.200' />
              <VStack w='full' gap='12px' mt='12px'>
                <Button
                  variant='grey'
                  bg={'grey.200'}
                  py='8px'
                  {...paragraphMedium}
                  h='unset'
                  w='full'
                  onClick={onClickJoinPrediction}
                  position={isMobile ? 'unset' : 'relative'}
                >
                  ⚖️ Join the Prediction
                </Button>
                {market.collateralToken.symbol === 'USDC' && (
                  <Button variant='transparent' onClick={onEstimteEarningOpenClicked}>
                    🤑 Estimate Earnings
                  </Button>
                )}
              </VStack>
            </Box>
          </Box>
        </VStack>
        {estimateOpened && (
          <Box bg='grey.200' p='16px' mt='16px' borderRadius='12px'>
            <HStack w='full' justifyContent='space-between' color='grey.500'>
              <Text {...paragraphMedium} fontSize='16px'>
                🤑 Estimated Earnings
              </Text>
              <button onClick={onCloseEstimateClicked}>
                <CloseIcon width={16} height={16} />
              </button>
            </HStack>
            <Text mt='8px' {...paragraphRegular} textAlign='left'>
              Curious about potential rewards? Here’s how it works:
            </Text>
            <Box my='16px'>
              <Text {...paragraphRegular} textAlign='left'>
                <strong>If “Yes” wins:</strong> 100 USDC could earn
              </Text>
              {yesLoading ? (
                <Box w='72px'>
                  <Skeleton height={20} />
                </Box>
              ) : (
                <Text {...paragraphMedium} textAlign='left'>
                  {NumberUtil.toFixed(yesReturn, 2)} USDC
                </Text>
              )}
              <Text {...paragraphRegular} textAlign='left' mt='8px'>
                <strong>If “No” wins:</strong> 100 USDC could earn
              </Text>
              {noLoading ? (
                <Box w='72px'>
                  <Skeleton height={20} />
                </Box>
              ) : (
                <Text {...paragraphMedium} textAlign='left'>
                  {NumberUtil.toFixed(noReturn, 2)} USDC
                </Text>
              )}
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  )

  return (
    <MobileDrawer id={market.address} trigger={content} onClose={onCloseMarketPage} variant='black'>
      <MarketPage />
    </MobileDrawer>
  )
}
