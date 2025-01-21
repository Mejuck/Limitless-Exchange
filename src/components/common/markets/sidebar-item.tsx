import { Text, HStack } from '@chakra-ui/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { ReactNode } from 'react'
import { useTokenFilter } from '@/contexts/TokenFilterContext'
import Crypto from '@/resources/icons/sidebar/crypto.svg'
import Finance from '@/resources/icons/sidebar/finance.svg'
import Others from '@/resources/icons/sidebar/others.svg'
import Sport from '@/resources/icons/sidebar/sport.svg'
import Weather from '@/resources/icons/sidebar/weather.svg'
import { paragraphMedium } from '@/styles/fonts/fonts.styles'

export interface SideItemProps {
  isActive?: boolean
  icon: ReactNode
  children: ReactNode
  onClick: () => void
}

//ids and names come from api /categories
export const MARKET_CATEGORIES = {
  CRYPTO: { id: 2, name: 'Crypto', description: '', icon: <Crypto width={16} height={16} /> },
  FINANCICALS: {
    id: 8,
    name: 'Financials',
    description: '',
    icon: <Finance width={16} height={16} />,
  },
  WEATHER: { id: 9, name: 'Weather', description: '', icon: <Weather width={16} height={16} /> },
  SPORTS: { id: 1, name: 'Sports', description: '', icon: <Sport width={16} height={16} /> },
  OTHER: { id: 5, name: 'Other', description: '', icon: <Others width={16} height={16} /> },
} as const

export type MarketCategory = (typeof MARKET_CATEGORIES)[keyof typeof MARKET_CATEGORIES]

export const categories = Object.values(MARKET_CATEGORIES)

export const SideItem = ({ isActive, onClick, icon, children }: SideItemProps) => {
  return (
    <HStack
      onClick={onClick}
      w='full'
      h='24px'
      rounded='8px'
      bg={isActive ? 'grey.100' : 'unset'}
      px={'8px'}
      cursor='pointer'
    >
      {React.cloneElement(icon as React.ReactElement, {
        style: {
          color: isActive ? 'var(--chakra-colors-grey-600)' : 'var(--chakra-colors-grey-500)',
        },
      })}
      <Text {...paragraphMedium} fontWeight={500} color={isActive ? 'grey.600' : 'grey.500'}>
        {children}
      </Text>
    </HStack>
  )
}

export const CategoryItems = () => {
  const { selectedCategory, handleCategory } = useTokenFilter()
  const searchParams = useSearchParams()

  const createQueryString = () => {
    const params = new URLSearchParams(searchParams.toString())
    return params.toString()
  }

  return categories.map((c) => {
    return (
      <Link key={c.name} href={`/?${createQueryString()}`} style={{ width: '100%' }}>
        <SideItem
          isActive={selectedCategory?.name === c.name}
          icon={c.icon}
          onClick={() => {
            handleCategory({
              id: c.id,
              name: c.name,
            })
          }}
        >
          {c.name}
        </SideItem>
      </Link>
    )
  })
}
