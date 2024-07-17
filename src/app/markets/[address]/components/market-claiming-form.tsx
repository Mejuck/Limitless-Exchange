import { defaultChain } from '@/constants'
import { useHistory, useTradingService } from '@/services'
import { NumberUtil } from '@/utils'
import { Text, Button, HStack, Icon, Box } from '@chakra-ui/react'
import { useMemo } from 'react'
import { Market } from '@/types'

import ThumbsUpIcon from '@/resources/icons/thumbs-up-icon.svg'
import ThumbsDownIcon from '@/resources/icons/thumbs-down-icon.svg'
import { useRouter } from 'next/navigation'
import WinIcon from '@/resources/icons/win-icon.svg'
import Paper from '@/components/common/paper'

interface MarketClaimingFormProps {
  market: Market | null
}

export const MarketClaimingForm: React.FC<MarketClaimingFormProps> = ({ market }) => {
  const { redeem: claim, status } = useTradingService()
  const { positions } = useHistory()
  const router = useRouter()
  const positionToClaim = useMemo(
    () =>
      positions?.filter(
        (position) =>
          position.market.id.toLowerCase() === market?.address[defaultChain.id].toLowerCase() &&
          position.outcomeIndex === market.winningOutcomeIndex &&
          market.expired
      )?.[0],
    [positions, market]
  )

  const hasPositions = useMemo(() => {
    return positions?.filter(
      (position) =>
        market?.expired &&
        position.market.id.toLowerCase() === market?.address[defaultChain.id].toLowerCase()
    )
  }, [market?.address, market?.expired, positions])

  const formColor = useMemo(() => {
    if (!positionToClaim) {
      return 'grey.800'
    }
    if (hasPositions) {
      return 'green.500'
    }
    return 'red.500'
  }, [positionToClaim, hasPositions])

  const actionText = useMemo(() => {
    if (!positionToClaim) {
      return (
        <Button variant='white' onClick={() => router.push('/')}>
          Explore Opened Markets
        </Button>
      )
    }
    if (positionToClaim) {
      return (
        <Button
          variant='white'
          onClick={() => claim(positionToClaim.outcomeIndex)}
          isDisabled={status === 'Loading'}
        >
          {status === 'Loading' ? (
            'Processing'
          ) : (
            <>
              <Icon as={WinIcon} />
              Claim {NumberUtil.formatThousands(positionToClaim.outcomeTokenAmount, 4)}
              {market?.tokenTicker[defaultChain.id]}
            </>
          )}
        </Button>
      )
    }
    if (hasPositions) {
      return (
        <Text color='grey.50'>
          You lost {`${NumberUtil.formatThousands(hasPositions[0].outcomeTokenAmount, 4)}`}{' '}
          {market?.tokenTicker[defaultChain.id]}
        </Text>
      )
    }
  }, [hasPositions, market?.tokenTicker, positionToClaim, router, status])

  return (
    <Paper bg={formColor} w='312px'>
      <Text fontWeight={500} color='grey.50'>
        Market is closed
      </Text>
      {!!hasPositions?.length && (
        <HStack gap='4px' color='grey.50'>
          <Text fontWeight={500}>Your prediction of</Text>
          {hasPositions[0].outcomeIndex ? (
            <ThumbsDownIcon width={16} height={16} />
          ) : (
            <ThumbsUpIcon width={16} height={16} />
          )}
          <Text fontWeight={500}>{hasPositions[0].outcomeIndex ? 'No' : 'Yes'}</Text>
          <Text fontWeight={500}>
            did {hasPositions[0].outcomeIndex === market?.winningOutcomeIndex ? '' : 'not '} come
            true
          </Text>
        </HStack>
      )}
      <Box mt='104px'>{actionText}</Box>
    </Paper>
  )
}
