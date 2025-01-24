import { HStack, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React, { useMemo, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { v4 as uuidv4 } from 'uuid'
import { MarketPriceChart } from '@/app/(markets)/markets/[address]/components'
import Orderbook from '@/app/(markets)/markets/[address]/components/clob/orderbook'
import CandlestickIcon from '@/resources/icons/candlestick-icon.svg'
import OrderbookIcon from '@/resources/icons/orderbook.svg'
import { useTradingService } from '@/services'

export default function ClobTabs() {
  const { market } = useTradingService()

  const tabs = [
    {
      title: 'Orderbook',
      icon: <OrderbookIcon width='16px' height='16px' />,
    },
    {
      title: 'Activity',
      icon: <CandlestickIcon width={16} height={16} />,
    },
  ]

  const tabPanels = useMemo(() => {
    return [<Orderbook key={uuidv4()} />, <MarketPriceChart key={uuidv4()} />]
  }, [market])

  return (
    <Tabs position='relative' variant='common' mx={isMobile ? '16px' : 0} mb='24px'>
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
      <TabIndicator mt='-2px' height='2px' bg='grey.800' transitionDuration='200ms !important' />
      <TabPanels>
        {tabPanels.map((panel, index) => (
          <TabPanel key={index} mt='16px'>
            {panel}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  )
}
