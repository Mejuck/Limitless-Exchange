import { Box, Button, HStack, Text } from '@chakra-ui/react'
import React from 'react'
import { isMobile } from 'react-device-detect'
import { Address } from 'viem'
import ClobLimitTradeForm from '@/components/common/markets/clob-widget/clob-limit-trade-form'
import ClobMarketTradeForm from '@/components/common/markets/clob-widget/clob-market-trade-form'
import { useClobWidget } from '@/components/common/markets/clob-widget/context'
import TradeStepperMenu from '@/components/common/markets/clob-widget/trade-stepper-menu'
import OutcomeButtonsClob from '@/components/common/markets/outcome-buttons/outcome-buttons-clob'
import { Overlay } from '@/components/common/overlay'
import Paper from '@/components/common/paper'
import SettingsIcon from '@/resources/icons/setting-icon.svg'
import { ChangeEvent, StrategyChangedMetadata, useAmplitude, useTradingService } from '@/services'
import { controlsMedium, paragraphRegular } from '@/styles/fonts/fonts.styles'
import { MarketOrderType } from '@/types'

export default function ClobWidget() {
  const { trackChanged } = useAmplitude()
  const { strategy, setStrategy, market } = useTradingService()

  const {
    isBalanceNotEnough,
    orderType,
    setOrderType,
    setPrice,
    setSharesAmount,
    tradeStepperOpen,
    onToggleTradeStepper,
  } = useClobWidget()

  const handleOrderTypeChanged = (order: MarketOrderType) => {
    setOrderType(order)
    setSharesAmount('')
    setPrice('')
  }

  return (
    <Box>
      <HStack w='full' justifyContent='center'>
        <Button
          bg={orderType === MarketOrderType.MARKET ? 'grey.100' : 'unset'}
          h='32px'
          borderBottomRadius={0}
          onClick={() => handleOrderTypeChanged(MarketOrderType.MARKET)}
        >
          Market
        </Button>
        <Button
          onClick={() => handleOrderTypeChanged(MarketOrderType.LIMIT)}
          bg={orderType === MarketOrderType.LIMIT ? 'grey.100' : 'unset'}
          h='32px'
          borderBottomRadius={0}
        >
          Limit Order
        </Button>
      </HStack>
      <Box position='relative' borderRadius='8px' overflow='hidden'>
        <Overlay show={tradeStepperOpen} onClose={onToggleTradeStepper} />
        {tradeStepperOpen && <TradeStepperMenu />}
        <Paper bg='grey.100' borderRadius='8px' p='8px' position='relative'>
          <HStack w='full' justifyContent='center' mb='16px' pl='16px'>
            <HStack w={'236px'} mx='auto' bg='grey.200' borderRadius='8px' py='2px' px={'2px'}>
              <Button
                h={isMobile ? '28px' : '20px'}
                flex='1'
                py='2px'
                borderRadius='6px'
                bg={strategy === 'Buy' ? 'grey.50' : 'unset'}
                color='grey.800'
                _hover={{
                  backgroundColor: strategy === 'Buy' ? 'grey.50' : 'rgba(255, 255, 255, 0.10)',
                }}
                onClick={() => {
                  trackChanged<StrategyChangedMetadata>(ChangeEvent.StrategyChanged, {
                    type: 'Buy selected',
                    marketAddress: market?.address as Address,
                  })
                  setStrategy('Buy')
                  setSharesAmount('')
                  setPrice('')
                }}
              >
                <Text {...controlsMedium} color={strategy == 'Buy' ? 'font' : 'fontLight'}>
                  Buy
                </Text>
              </Button>
              <Button
                h={isMobile ? '28px' : '20px'}
                flex='1'
                borderRadius='6px'
                py='2px'
                bg={strategy === 'Sell' ? 'grey.50' : 'unset'}
                color='grey.800'
                _hover={{
                  backgroundColor: strategy === 'Sell' ? 'grey.50' : 'rgba(255, 255, 255, 0.10)',
                }}
                _disabled={{
                  opacity: '50%',
                  pointerEvents: 'none',
                }}
                onClick={() => {
                  trackChanged<StrategyChangedMetadata>(ChangeEvent.StrategyChanged, {
                    type: 'Sell selected',
                    marketAddress: market?.address as Address,
                  })
                  setStrategy('Sell')
                  setSharesAmount('')
                  setPrice('')
                }}
              >
                <Text {...controlsMedium} color={strategy == 'Sell' ? 'font' : 'fontLight'}>
                  Sell
                </Text>
              </Button>
            </HStack>
            <SettingsIcon width={16} height={16} />
          </HStack>
          <OutcomeButtonsClob />
          {orderType === MarketOrderType.MARKET ? <ClobMarketTradeForm /> : <ClobLimitTradeForm />}
          {isBalanceNotEnough && (
            <Text my='8px' {...paragraphRegular} color='grey.500' textAlign={'center'}>
              Not enough funds
            </Text>
          )}
        </Paper>
      </Box>

      {/*<SplitSharesModal isOpen={splitSharesModalOpened} onClose={onToggleSplitSharesModal} />*/}
    </Box>
  )
}
