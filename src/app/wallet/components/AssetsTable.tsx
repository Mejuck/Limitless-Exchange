import {
  HStack,
  Image,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  VStack,
  Text,
  Td,
  Button,
  Divider,
} from '@chakra-ui/react'
import { v4 as uuidv4 } from 'uuid'
import { useBalanceService } from '@/services'
import { NumberUtil } from '@/utils'
import { usePriceOracle } from '@/providers'
import { useIsMobile } from '@/hooks'

type AssetsTableProps = {
  handleOpenTopUpModal: (token: string) => void
}

export default function AssetsTable({ handleOpenTopUpModal }: AssetsTableProps) {
  const isMobile = useIsMobile()
  const tableHeaders = isMobile
    ? ['Token', 'Available Balance', 'Deposit']
    : ['Token', 'Available Balance', 'Token Price', 'Active Markets', 'Locked', 'Deposit']

  const { balanceOfSmartWallet } = useBalanceService()
  const { convertEthToUsd, ethPrice } = usePriceOracle()

  console.log(balanceOfSmartWallet)

  return (
    <>
      {isMobile && <Divider />}
      <TableContainer
        borderColor={'#E7E7EA'}
        borderWidth={isMobile ? 0 : '1px'}
        borderRadius={'12px'}
        pb={'12px'}
      >
        <Table variant='simple'>
          <TableCaption
            placement='top'
            textAlign='left'
            fontSize={'20px'}
            fontWeight={'normal'}
            color={'black'}
            w={'fit-content'}
            pl={isMobile ? 0 : '24px'}
          >
            All tokens
          </TableCaption>
          <Thead>
            <Tr>
              {tableHeaders.map((header, index) => (
                <Th
                  key={uuidv4()}
                  textTransform={'none'}
                  color={'fontLight'}
                  fontWeight={'normal'}
                  borderBottom={'unset'}
                  textAlign={index ? 'right' : 'left'}
                  pr={index === tableHeaders.length - 1 ? (isMobile ? 0 : '20px') : 0}
                  pl={index ? 0 : isMobile ? 0 : '24px'}
                  w={index ? 'initial' : '136px'}
                >
                  {header}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {balanceOfSmartWallet?.map((balance) => (
              <Tr key={uuidv4()}>
                <Td borderBottom={'unset'} py={'8px'} pr={0} w={'136px'} pl={isMobile ? 0 : '24px'}>
                  <HStack>
                    <Image src={balance.image} alt='token' w={'20px'} h={'20px'} />
                    <VStack gap={0} alignItems='flex-start'>
                      <Text fontWeight={'semibold'}>{balance.symbol}</Text>
                      <Text fontWeight={'light'} color={'fontLight'}>
                        {balance.name}
                      </Text>
                    </VStack>
                  </HStack>
                </Td>
                <Td borderBottom={'unset'} py={'8px'} px={0} w={'160px'}>
                  <VStack gap={0} alignItems='flex-end'>
                    <Text fontWeight={'semibold'}>{balance.formatted}</Text>
                    <Text fontWeight={'light'} color={'fontLight'}>
                      ${NumberUtil.formatThousands(convertEthToUsd(balance.formatted), 2)}
                    </Text>
                  </VStack>
                </Td>
                {!isMobile && (
                  <>
                    <Td
                      borderBottom={'unset'}
                      py={'8px'}
                      textAlign='right'
                      verticalAlign='top'
                      px={0}
                      w={'100px'}
                    >
                      <Text fontWeight={'semibold'}>${ethPrice}</Text>
                    </Td>
                    <Td
                      borderBottom={'unset'}
                      py={'8px'}
                      textAlign='right'
                      verticalAlign='top'
                      px={0}
                      w={'120px'}
                    >
                      <Text fontWeight={'semibold'}>0 markets</Text>
                    </Td>
                    <Td borderBottom={'unset'} py={'8px'} px={0} w={'100px'}>
                      <VStack gap={0} alignItems='flex-end'>
                        <Text fontWeight={'semibold'}>{balance.formatted}</Text>
                        <Text fontWeight={'light'} color={'fontLight'}>
                          ${NumberUtil.formatThousands(convertEthToUsd(balance.formatted), 2)}
                        </Text>
                      </VStack>
                    </Td>
                  </>
                )}
                <Td
                  borderBottom={'unset'}
                  py={'8px'}
                  textAlign='right'
                  verticalAlign='top'
                  pl={0}
                  pr={isMobile ? 0 : '20px'}
                >
                  <Button
                    variant='link'
                    color={'brand'}
                    textDecor='underline'
                    fontWeight={'normal'}
                    fontSize={'14px'}
                    onClick={() => handleOpenTopUpModal(balance.contractAddress)}
                  >
                    Deposit
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {isMobile && <Divider />}
    </>
  )
}
