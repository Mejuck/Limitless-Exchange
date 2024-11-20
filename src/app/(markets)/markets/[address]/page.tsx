'use client'

import {
  Box,
  Button,
  Divider,
  HStack,
  Image as ChakraImage,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { v4 as uuidv4 } from 'uuid'
import { Address } from 'viem'
import MobileDrawer from '@/components/common/drawer'
import MarketActivityTab from '@/components/common/markets/activity-tab'
import CommentTab from '@/components/common/markets/comment-tab'
import Skeleton from '@/components/common/skeleton'
import TextWithPixels from '@/components/common/text-with-pixels'
import MarketOverviewTab from '@/app/(markets)/markets/[address]/components/overview-tab'
import {
  MarketClaimingForm,
  MarketMetadata,
  MarketTradingForm,
  MobileTradeButton,
} from './components'
import { MainLayout } from '@/components'
import WarpcastIcon from '@/resources/icons/Farcaster.svg'
import TwitterIcon from '@/resources/icons/X.svg'
import ActivityIcon from '@/resources/icons/activity-icon.svg'
import ArrowLeftIcon from '@/resources/icons/arrow-left-icon.svg'
import OpinionIcon from '@/resources/icons/opinion-icon.svg'
import PredictionsIcon from '@/resources/icons/predictions-icon.svg'
import ShareIcon from '@/resources/icons/share-icon.svg'
import {
  ClickEvent,
  createMarketShareUrls,
  OpenEvent,
  ShareClickedMetadata,
  useAmplitude,
  useTradingService,
} from '@/services'
import { useMarket, useWinningIndex } from '@/services/MarketsService'
import { h1Regular, paragraphMedium } from '@/styles/fonts/fonts.styles'
import { Market } from '@/types'

const MarketPage = ({ params }: { params: { address: Address } }) => {
  const [isShareMenuOpen, setShareMenuOpen] = useState(false)
  /**
   * ANALYTICS
   */
  const { trackClicked, trackOpened } = useAmplitude()
  const { data: winningIndex } = useWinningIndex(params.address)
  const resolved = winningIndex === 0 || winningIndex === 1
  const router = useRouter()
  const { data: market, isLoading: fetchMarketLoading } = useMarket(params.address)
  const { tweetURI, castURI } = createMarketShareUrls(market, market?.prices, market?.creator.name)
  const { setMarket, resetQuotes } = useTradingService()

  const marketActionForm = useMemo(() => {
    if (fetchMarketLoading) {
      return (
        <Box w='312px'>
          <Skeleton height={481} />
        </Box>
      )
    }
    if (market) {
      return market.expired ? (
        <MarketClaimingForm market={market} />
      ) : (
        <MarketTradingForm market={market} />
      )
    }
    return null
  }, [market, fetchMarketLoading])

  const tabs = [
    {
      title: 'Overview',
      icon: <PredictionsIcon width={16} height={16} />,
    },
    {
      title: 'Activity',
      icon: <ActivityIcon width={16} height={16} />,
    },
    {
      title: 'Opinions',
      icon: <OpinionIcon width={16} height={16} />,
    },
  ]

  const tabPanels = useMemo(() => {
    return [
      <MarketOverviewTab market={market} key={uuidv4()} />,
      <MarketActivityTab key={uuidv4()} />,
      <CommentTab key={uuidv4()} />,
    ]
  }, [market, winningIndex, resolved])

  const mobileTradeButton = useMemo(() => {
    if (fetchMarketLoading) {
      return
    }
    return market?.expired ? (
      <MobileTradeButton market={market} />
    ) : (
      <MobileDrawer
        trigger={
          <Button
            variant='contained'
            w='full'
            h='48px'
            mt='32px'
            color='white'
            onClick={() => {
              trackClicked(ClickEvent.TradeButtonClicked, {
                platform: 'mobile',
                address: market?.address,
              })
            }}
          >
            Trade
          </Button>
        }
        title={(market?.proxyTitle ?? market?.title) || ''}
        variant='blue'
      >
        <MarketTradingForm market={market as Market} />
      </MobileDrawer>
    )
  }, [market, fetchMarketLoading])

  const handleBackClicked = () => {
    if (window.history.length > 2) {
      return router.back()
    }
    return router.push('/')
  }

  useEffect(() => {
    if (market) {
      setMarket(market)
    }
  }, [market])

  useEffect(() => {
    resetQuotes()
  }, [])

  useEffect(() => {
    if (market) {
      trackOpened(OpenEvent.MarketPageOpened, {
        marketAddress: market.address,
        page: 'Market Page',
      })
    }
  }, [market])

  return (
    <MainLayout>
      {!market && !fetchMarketLoading ? (
        <>Market not found</>
      ) : (
        <>
          <HStack gap='40px' alignItems='flex-start' mb={isMobile ? '84px' : 0}>
            <Box w={isMobile ? 'full' : '664px'}>
              <Divider orientation='horizontal' h='3px' />
              <HStack justifyContent='space-between' mt='10px' mb='24px'>
                <Button
                  variant='grey'
                  onClick={() => {
                    trackClicked(ClickEvent.BackClicked, {
                      address: market?.address || '0x',
                    })
                    handleBackClicked()
                  }}
                >
                  <ArrowLeftIcon width={16} height={16} />
                  Back
                </Button>
                <Menu isOpen={isShareMenuOpen} onClose={() => setShareMenuOpen(false)}>
                  <MenuButton
                    onClick={() => {
                      trackClicked(ClickEvent.ShareMenuClicked, {
                        address: market?.address || '0x',
                        marketType: 'single',
                      })
                      setShareMenuOpen(true)
                    }}
                  >
                    <HStack gap='4px'>
                      <ShareIcon width={16} height={16} />
                      <Text {...paragraphMedium}>Share</Text>
                    </HStack>
                  </MenuButton>
                  <MenuList borderRadius='8px' w={isMobile ? '160px' : '122px'} zIndex={2}>
                    <MenuItem
                      onClick={() => {
                        trackClicked<ShareClickedMetadata>(ClickEvent.ShareItemClicked, {
                          type: 'Farcaster',
                          address: market?.address,
                          marketType: 'single',
                        })
                        window.open(castURI, '_blank', 'noopener')
                      }}
                    >
                      <HStack gap='4px'>
                        <WarpcastIcon />
                        <Text {...paragraphMedium}>On Warpcast</Text>
                      </HStack>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        trackClicked<ShareClickedMetadata>(ClickEvent.ShareItemClicked, {
                          type: 'X/Twitter',
                          address: market?.address,
                          marketType: 'single',
                        })
                        window.open(tweetURI, '_blank', 'noopener')
                      }}
                    >
                      <HStack gap='4px'>
                        <TwitterIcon width={'16px'} />
                        <Text {...paragraphMedium}>On X</Text>
                      </HStack>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
              <Box>
                {fetchMarketLoading ? (
                  <VStack w='full' gap='12px'>
                    <Skeleton height={42} />
                    <Skeleton height={42} />
                  </VStack>
                ) : (
                  <TextWithPixels
                    text={(market?.proxyTitle ?? market?.title) || ''}
                    {...(isMobile ? { ...h1Regular } : {})}
                    fontSize='32px'
                    userSelect='text'
                  />
                )}
              </Box>
              <HStack gap={isMobile ? '4px' : '16px'} mt='16px' mb='24px'>
                {fetchMarketLoading ? (
                  <Skeleton height={24} />
                ) : (
                  <HStack gap='8px' flexWrap='wrap'>
                    <ChakraImage
                      width={6}
                      height={6}
                      src={market?.creator.imageURI ?? '/assets/images/logo.svg'}
                      alt='creator'
                      borderRadius={'2px'}
                    />
                    <Link href={market?.creator.link}>
                      <Text color='grey.500'>{market?.creator.name}</Text>
                    </Link>
                    {market?.tags?.map((tag) => (
                      <Text color='grey.500' key={tag}>
                        #{tag}
                      </Text>
                    ))}
                  </HStack>
                )}
              </HStack>
              <MarketMetadata
                market={market}
                winningIndex={winningIndex}
                resolved={resolved}
                marketLoading={fetchMarketLoading}
              />
              <Box mt={isMobile ? '48px' : '24px'} />
              {fetchMarketLoading ? (
                <Skeleton height={400} />
              ) : (
                <Tabs position='relative' variant='common'>
                  <TabList>
                    {tabs.map((tab) => (
                      <Tab key={tab.title}>
                        <HStack gap={isMobile ? '8px' : '4px'} w='fit-content'>
                          {tab.icon}
                          <>{tab.title}</>
                        </HStack>
                      </Tab>
                    ))}
                  </TabList>
                  <TabIndicator
                    mt='-2px'
                    height='2px'
                    bg='grey.800'
                    transitionDuration='200ms !important'
                  />
                  <TabPanels>
                    {tabPanels.map((panel, index) => (
                      <TabPanel key={index}>{panel}</TabPanel>
                    ))}
                  </TabPanels>
                </Tabs>
              )}
            </Box>
            {!isMobile && marketActionForm}
          </HStack>
          {isMobile && (
            <Box position='fixed' bottom='76px' w='calc(100% - 32px)'>
              {mobileTradeButton}
            </Box>
          )}
        </>
      )}
    </MainLayout>
  )
}

export default MarketPage
