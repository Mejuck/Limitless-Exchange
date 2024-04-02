'use client'

import * as React from 'react'
import { ChakraProvider, QueryProvider, WagmiProvider, Web3AuthProvider } from '@/providers'
import {
  AccountProvider,
  AmplitudeProvider,
  BalanceServiceProvider,
  EtherspotProvider,
  HistoryServiceProvider,
  LimitlessApiProvider,
  TradingServiceProvider,
} from '@/services'

export const Providers = ({ children }: React.PropsWithChildren) => {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  return (
    mounted && (
      <AmplitudeProvider>
        <ChakraProvider>
          <WagmiProvider>
            <Web3AuthProvider>
              <QueryProvider>
                <LimitlessApiProvider>
                  <EtherspotProvider>
                    <AccountProvider>
                      <BalanceServiceProvider>
                        <HistoryServiceProvider>
                          <TradingServiceProvider>{children}</TradingServiceProvider>
                        </HistoryServiceProvider>
                      </BalanceServiceProvider>
                    </AccountProvider>
                  </EtherspotProvider>
                </LimitlessApiProvider>
              </QueryProvider>
            </Web3AuthProvider>
          </WagmiProvider>
        </ChakraProvider>
      </AmplitudeProvider>
    )
  )
}
