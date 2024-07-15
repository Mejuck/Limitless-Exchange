import React, { useState } from 'react'
import { Text, Box, Button, HStack, useDisclosure, VStack, Slide } from '@chakra-ui/react'
import { Token } from '@/types'
import { useLimitlessApi } from '@/services'
import { useTokenFilter } from '@/contexts/TokenFilterContext'
import MenuIcon from '@/resources/icons/menu-icon.svg'
import Image from 'next/image'

export default function TokenFilterMobile() {
  const [category, setCategory] = useState('')
  const { selectedFilterTokens, handleTokenChange } = useTokenFilter()

  const { supportedTokens } = useLimitlessApi()
  const { isOpen: isOpenTagsMenu, onToggle: onToggleTagsMenu } = useDisclosure()

  const handleFilterItemClicked = (token: Token | null) => {
    if (!token) {
      handleTokenChange([])
      return
    }
    if (selectedFilterTokens.find((_token) => _token.address == token.address)) {
      handleTokenChange(selectedFilterTokens.filter((_token) => _token.address != token.address))
    } else {
      handleTokenChange([...selectedFilterTokens, token])
    }
  }

  const categories = ['Crypto']

  return (
    <Box w='full' overflowX='auto' mt='16px' pl='16px'>
      <HStack gap='8px' w='fit-content'>
        <Button variant='grey' onClick={onToggleTagsMenu} mr='8px'>
          <MenuIcon width={16} height={16} />
          <Text fontWeight={500}>{!category ? 'All Markets' : `All in ${category}`}</Text>
        </Button>
        {!category
          ? categories.map((category) => (
              <Button variant='grey' key={category} onClick={() => setCategory(category)}>
                <Text fontWeight={500}>/{category}</Text>
              </Button>
            ))
          : supportedTokens
              ?.filter((token) => !['MFER', 'BETS'].includes(token.symbol))
              .map((token) => (
                <Button
                  bg={
                    selectedFilterTokens.findLast((_token) => _token.address === token.address)
                      ? 'grey.800'
                      : 'grey.300'
                  }
                  color={
                    selectedFilterTokens.findLast((_token) => _token.address === token.address)
                      ? 'grey.50'
                      : 'grey.800'
                  }
                  variant='grey'
                  key={token.symbol}
                  onClick={() => handleFilterItemClicked(token)}
                >
                  <Text
                    color={
                      selectedFilterTokens.findLast((_token) => _token.address === token.address)
                        ? 'grey.50'
                        : 'grey.800'
                    }
                    fontWeight={500}
                  >
                    /{token.symbol}
                  </Text>
                </Button>
              ))}
      </HStack>
      {isOpenTagsMenu && (
        <Box
          position='fixed'
          top={0}
          left={0}
          bottom={0}
          w='full'
          zIndex={100}
          bg='rgba(0, 0, 0, 0.3)'
          mt='20px'
        ></Box>
      )}
      <Slide
        direction='left'
        in={isOpenTagsMenu}
        style={{ zIndex: 100, marginTop: '20px' }}
        onClick={onToggleTagsMenu}
      >
        <Box p='16px' w='80%' bg='grey.50' h='full' onClick={(e) => e.stopPropagation()}>
          <Image src={'/logo-black.svg'} height={32} width={156} alt='calendar' />
          <Box mt='28px'>
            <Text fontWeight={500} color='grey.600'>
              {categories[0]}
            </Text>
          </Box>
          <VStack gap='4px' mt='4px' alignItems='flex-start'>
            <Button
              bg={
                category === categories[0] && !selectedFilterTokens.length ? 'grey.800' : 'grey.300'
              }
              variant='grey'
              color={
                category === categories[0] && !selectedFilterTokens.length ? 'grey.50' : 'grey.800'
              }
              onClick={() => {
                if (selectedFilterTokens.length) {
                  handleFilterItemClicked(null)
                  return
                }
                setCategory(categories[0])
              }}
            >
              /All
            </Button>
            {supportedTokens?.map((token) => (
              <Button
                bg={
                  selectedFilterTokens.findLast((_token) => _token.address === token.address)
                    ? 'grey.800'
                    : 'grey.300'
                }
                color={
                  selectedFilterTokens.findLast((_token) => _token.address === token.address)
                    ? 'grey.50'
                    : 'grey.800'
                }
                variant='grey'
                key={token.symbol}
                onClick={() => handleFilterItemClicked(token)}
              >
                <Text
                  color={
                    selectedFilterTokens.findLast((_token) => _token.address === token.address)
                      ? 'grey.50'
                      : 'grey.800'
                  }
                  fontWeight={500}
                >
                  /{token.symbol}
                </Text>
              </Button>
            ))}
          </VStack>
        </Box>
      </Slide>
    </Box>
  )
}
