import { Drawer } from 'vaul'
import React, { PropsWithChildren, ReactNode } from 'react'
import { h1Regular, headline } from '@/styles/fonts/fonts.styles'

type MobileDrawerProps = {
  trigger: ReactNode
  title?: string
  variant: 'blue' | 'common'
}

export default function MobileDrawer({
  trigger,
  title,
  children,
  variant,
}: PropsWithChildren<MobileDrawerProps>) {
  const bgColor =
    variant === 'blue' ? 'var(--chakra-colors-blue-500)' : 'var(--chakra-colors-grey-100)'

  const grabberBgColor =
    variant === 'blue' ? 'var(--chakra-colors-blue-400)' : 'var(--chakra-colors-grey-300)'

  const titleColor = variant === 'blue' ? 'white' : 'var(--chakra-colors-grey.800)'

  return (
    <Drawer.Root shouldScaleBackground>
      <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 400,
          }}
        />
        <Drawer.Content
          style={{
            background: bgColor,
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100dvh - 36px)',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 500,
          }}
        >
          <div
            style={{
              flex: 1,
            }}
          >
            <div
              style={{
                margin: '8px auto',
                width: '36px',
                height: '4px',
                borderRadius: '2px',
                background: grabberBgColor,
              }}
            />
            <div
              style={{
                margin: '0 auto',
                maxHeight: 'calc(100dvh - 68px)',
                overflowY: 'auto',
              }}
            >
              {title && (
                <Drawer.Title
                  style={{
                    marginBottom: '32px',
                    marginTop: '28px',
                    padding: '0 16px',
                    ...(variant === 'blue' ? { ...headline } : { ...h1Regular }),
                    color: titleColor,
                  }}
                >
                  {title}
                </Drawer.Title>
              )}
              {children}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
