import { HStack, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { isMobile } from 'react-device-detect'
import { v4 as uuidv4 } from 'uuid'
import ClobOrdersTab from '@/app/(markets)/markets/[address]/components/clob/clob-orders-tab'
import SandClockIcon from '@/resources/icons/sand-clock.svg'
import { useTradingService } from '@/services'

interface ClobPositionsProps {
  marketType?: string
}

export default function ClobPositions({ marketType }: ClobPositionsProps) {
  const { market } = useTradingService()

  const tabs = [
    // {
    //   title: 'Portfolio',
    //   icon: <PortfolioIcon width='16px' height='16px' />,
    // },
    {
      title: 'Open Orders',
      icon: <SandClockIcon width={16} height={16} />,
    },
  ]

  const tabPanels = useMemo(() => {
    return [
      // <ClobPortfolioTab key={uuidv4()} />,
      <ClobOrdersTab key={uuidv4()} marketType={marketType} />,
    ]
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
