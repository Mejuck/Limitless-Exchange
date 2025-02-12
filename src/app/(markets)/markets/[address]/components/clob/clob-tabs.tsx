import { HStack, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React, { useEffect, useMemo, useState } from 'react'
import { isDesktop, isMobile } from 'react-device-detect'
import { v4 as uuidv4 } from 'uuid'
import { MarketPriceChart } from '@/app/(markets)/markets/[address]/components'
import Orderbook from '@/app/(markets)/markets/[address]/components/clob/orderbook'
import CandlestickIcon from '@/resources/icons/candlestick-icon.svg'
import OrderbookIcon from '@/resources/icons/orderbook.svg'
import { useTradingService } from '@/services'

export default function ClobTabs() {
  const { market } = useTradingService()
  const [isSmallLaptop, setIsSmallLaptop] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth

      // Define small laptop resolution (Example: < 1366px width)
      if (isDesktop && width >= 1024 && width <= 1366) {
        setIsSmallLaptop(true)
      } else {
        setIsSmallLaptop(false)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const tabs = [
    {
      title: 'Orderbook',
      icon: <OrderbookIcon width='16px' height='16px' />,
    },
    {
      title: 'Chart',
      icon: <CandlestickIcon width={16} height={16} />,
    },
  ]

  const tabPanels = useMemo(() => {
    return [
      <Orderbook key={uuidv4()} variant={isSmallLaptop ? 'small' : 'large'} />,
      <MarketPriceChart key={uuidv4()} />,
    ]
  }, [market, isSmallLaptop])

  return (
    <Tabs position='relative' variant='common' mb='24px'>
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
