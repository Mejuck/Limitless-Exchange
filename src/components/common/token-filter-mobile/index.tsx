import React, { useState } from 'react'
import { Text, Box, Button, HStack } from '@chakra-ui/react'
import { useCategories } from '@/services'
import { useTokenFilter } from '@/contexts/TokenFilterContext'
import '@/app/style.css'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function TokenFilterMobile() {
  const [section, setSection] = useState('Topics')
  const { selectedCategory, handleCategory } = useTokenFilter()

  const { data: categories } = useCategories()
  const searchParams = useSearchParams()

  const TopicSectionCategories = () =>
    (categories ?? []).map((category) => {
      const _selected = selectedCategory?.id === category.id
      return (
        <Button
          bg={_selected ? 'grey.800' : 'grey.300'}
          color={_selected ? 'grey.50' : 'grey.800'}
          variant='grey'
          key={category.id}
          onClick={() => handleCategory(category)}
        >
          <Link href={{ pathname: '/', query: { category: category.name } }}>
            <Text
              color={category.name === searchParams?.get('category') ? 'white' : 'black'}
              fontWeight={500}
            >
              /{category.name}
            </Text>
          </Link>
        </Button>
      )
    })

  const sectionCategory: Record<string, React.JSX.Element | undefined> = {
    Topics: <TopicSectionCategories />,
  }

  return (
    <Box w='full' overflowX='auto' mt='16px' pl='16px'>
      <HStack gap='8px' w='fit-content'>
        {sectionCategory[section]}
      </HStack>
    </Box>
  )
}
