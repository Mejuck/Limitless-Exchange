'use client'

import { CreateMarketCard, MainLayout, MarketCard, MarketCardMobile } from '@/components'
import { defaultChain } from '@/constants'
import { useIsMobile } from '@/hooks'
import { OpenEvent, useAmplitude } from '@/services'
import { Divider, Stack, VStack, Text, Box } from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Filter from '@/components/common/TokenFilter'
import SortFilter from '@/components/common/SortFilter'
import { Market, Sort, Token } from '@/types'
import { formatUnits, getAddress } from 'viem'
import { useMarkets } from '@/services/MarketsService'
import InfiniteScroll from 'react-infinite-scroll-component'
import { usePriceOracle } from '@/providers'
import './style.css'
import TextWithPixels from '@/components/common/text-with-pixels'

const MainPage = () => {
  /**
   * ANALYTICS
   */
  const { trackOpened } = useAmplitude()
  useEffect(() => {
    trackOpened(OpenEvent.PageOpened, {
      page: 'Explore Markets',
    })
  }, [])

  /**
   * UI
   */
  const isMobile = useIsMobile()

  const [selectedFilterTokens, setSelectedFilterTokens] = useState<Token[]>([])
  const [selectedSort, setSelectedSort] = useState<Sort>(Sort.BASE)
  const handleSelectFilterTokens = (tokens: Token[]) => setSelectedFilterTokens(tokens)
  const handleSelectSort = (options: Sort) => setSelectedSort(options)

  const { convertTokenAmountToUsd } = usePriceOracle()
  const { data, fetchNextPage, hasNextPage } = useMarkets()

  const dataLength = data?.pages.reduce((counter, page) => {
    return counter + page.data.length
  }, 0)

  const markets: Market[] = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || []
  }, [data?.pages])

  //it helps to get integer value form solidity representation
  const formatMarketNumber = (market: Market, amount: string | undefined) => {
    return convertTokenAmountToUsd(
      market.tokenTicker[defaultChain.id],
      formatUnits(BigInt(amount ?? 0), market.tokenTicker[defaultChain.id] === 'USDC' ? 6 : 18)
    )
  }

  const filteredMarkets = useMemo(() => {
    return markets?.filter((market) =>
      selectedFilterTokens.length > 0
        ? selectedFilterTokens.some(
            (filterToken) =>
              getAddress(filterToken.address) ===
              getAddress(market.collateralToken[defaultChain.id])
          )
        : true
    )
  }, [markets, selectedFilterTokens])

  const sortedMarkets = useMemo(() => {
    if (!filteredMarkets) return []
    switch (selectedSort) {
      case Sort.NEWEST:
        return [...filteredMarkets].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      case Sort.HIGHEST_VOLUME:
        return [...filteredMarkets].sort(
          (a, b) => formatMarketNumber(b, b.volume) - formatMarketNumber(a, a.volume)
        )
      case Sort.HIGHEST_LIQUIDITY:
        return [...filteredMarkets].sort(
          (a, b) => formatMarketNumber(b, b.liquidity) - formatMarketNumber(a, a.liquidity)
        )
      case Sort.COMING_DEADLINE:
        return [...filteredMarkets].sort(
          (a, b) =>
            new Date(a.expirationTimestamp).getTime() - new Date(b.expirationTimestamp).getTime()
        )
      default:
        return filteredMarkets
    }
  }, [markets, filteredMarkets, selectedSort])

  return (
    <InfiniteScroll
      dataLength={dataLength ?? 0}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<h4></h4>}
      scrollThreshold={0.1}
      refreshFunction={fetchNextPage}
      pullDownToRefresh
    >
      <MainLayout maxContentWidth={'unset'}>
        <Box w='664px' mx='auto'>
          <Divider bg='grey.800' orientation='horizontal' h='3px' />
          <TextWithPixels text={'Explore Limitless Prediction Markets'} fontSize={'32px'} />
          <Text color='grey.800' fontSize={'14px'}>
            Predict outcomes in crypto, tech, sports, and more. Use different tokens, participate in
            transparent voting for upcoming markets, and engage in markets created by the community.
            It’s all decentralized and secure.
          </Text>
          <VStack w={'full'} spacing={5} px={{ md: 14 }}>
            <Stack direction={'row'} spacing={4}>
              <Filter onChange={handleSelectFilterTokens} />
              <SortFilter onChange={handleSelectSort} />
            </Stack>
            <VStack gap={2}>
              {sortedMarkets?.map((market) =>
                isMobile ? (
                  <MarketCardMobile
                    key={uuidv4()}
                    marketAddress={market.address[defaultChain.id]}
                  />
                ) : (
                  <MarketCard key={uuidv4()} marketAddress={market.address[defaultChain.id]} />
                )
              )}
            </VStack>
          </VStack>
        </Box>
      </MainLayout>
    </InfiniteScroll>
  )
}

export default MainPage
