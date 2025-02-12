import { BoxProps, HStack, Icon, Link } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { isMobile } from 'react-device-detect'
import FarcasterIcon from '@/resources/icons/Farcaster.svg'
import XIcon from '@/resources/icons/X.svg'
import BookIcon from '@/resources/icons/book-icon.svg'
import DiscordIcon from '@/resources/icons/discord-icon.svg'
import { ClickEvent, useAmplitude } from '@/services'

const LINKS = {
  X: 'https://x.com/trylimitless',
  DISCORD: 'https://discord.gg/y79BeDVXEM',
  FARCASTER: 'https://warpcast.com/~/channel/limitless',
  DOCS: 'https://www.notion.so/limitlesslabs/Limitless-Exchange-Docs-0e59399dd44b492f8d494050969a1567?pvs=4',
}

const ICON_PROPS = {
  w: isMobile ? '20px' : '16px',
  h: isMobile ? '20px' : '16px',
  verticalAlign: 'middle',
  color: 'grey.500',
  _hover: { color: 'grey.800' },
}

export default function SocialsFooter({ ...props }: PropsWithChildren<BoxProps>) {
  const { trackClicked } = useAmplitude()

  return (
    <HStack
      justifyContent='space-between'
      spacing={4}
      w='full'
      maxH='49px'
      p='17px 2px'
      mt='-8px'
      {...props}
    >
      <Link
        href={LINKS.DOCS}
        target='_blank'
        rel='noopener noreferrer'
        onClick={() => {
          trackClicked(ClickEvent.LimitlessLinksClicked, {
            platform: isMobile ? 'mobile' : 'desktop',
            option: 'docs',
          })
        }}
      >
        <Icon as={BookIcon} {...ICON_PROPS} />
      </Link>

      <Link
        href={LINKS.DISCORD}
        target='_blank'
        rel='noopener noreferrer'
        onClick={() => {
          trackClicked(ClickEvent.LimitlessLinksClicked, {
            platform: isMobile ? 'mobile' : 'desktop',
            option: 'discord',
          })
        }}
      >
        <Icon as={DiscordIcon} {...ICON_PROPS} />
      </Link>
      <Link
        href={LINKS.FARCASTER}
        target='_blank'
        rel='noopener noreferrer'
        onClick={() => {
          trackClicked(ClickEvent.LimitlessLinksClicked, {
            platform: isMobile ? 'mobile' : 'desktop',
            option: 'farcaster',
          })
        }}
      >
        <Icon as={FarcasterIcon} {...ICON_PROPS} />
      </Link>
      <Link
        href={LINKS.X}
        target='_blank'
        rel='noopener noreferrer'
        onClick={() => {
          trackClicked(ClickEvent.LimitlessLinksClicked, {
            platform: isMobile ? 'mobile' : 'desktop',
            option: 'x',
          })
        }}
      >
        <Icon as={XIcon} {...ICON_PROPS} />
      </Link>
    </HStack>
  )
}
