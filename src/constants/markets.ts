import { degen, higher, mfer, onChain, regen, weth } from '@/constants/tokens'
import { Market } from '@/types'
import { zeroAddress } from 'viem'
import { base, baseSepolia } from 'viem/chains'

export const markets: Market[] = [
  // done: mfer
  {
    address: {
      [base.id]: '0x06F8d688249083D3B32A0584FD4e8af25337aF41', // prod
      [baseSepolia.id]: '0x', // testnet
    },
    conditionId: {
      [base.id]: '0x011d67202405ffb10c810192eb73c41c3f5fe356daed529569804d12b752a19d', // prod
      [baseSepolia.id]: '0x', // testnet
    },
    questionId: {
      [base.id]: '0x', // prod
      [baseSepolia.id]: '0x', // testnet
    },
    collateralToken: {
      [base.id]: mfer.address[base.id], // prod
      [baseSepolia.id]: mfer.address[baseSepolia.id], // testnet
    },
    tokenTicker: {
      [base.id]: mfer.symbol,
      [baseSepolia.id]: mfer.symbol,
    },
    tokenURI: {
      [base.id]: mfer.imageURI,
      [baseSepolia.id]: mfer.imageURI,
    },
    outcomeTokens: ['Yes', 'No'],
    title: 'Will $mfer hit $1B FDV in Q2?',
    description: `mfercoin: a peer-to-peer electronic mfer system`,
    placeholderURI: '/assets/images/markets/market10.png',
    imageURI: '/assets/images/markets/market10.png',
    ogImageURI: 'https://limitless.exchange/assets/images/markets/market10.png',
    expirationDate: 'July 1, 2024',
    expirationTimestamp: new Date('July 1, 2024').getTime(),
    expired: Date.now() > new Date('July 1, 2024').getTime(), // TODO: make dynamic
    creator: {
      name: '/mfers',
      imageURI: '/assets/images/markets/mfers.png',
      link: 'https://warpcast.com/~/channel/mfers',
    },
    tags: ['mfer', 'memecoins', 'FDV'],
  },

  // done: onchain
  {
    address: {
      [base.id]: '0x09b856c4c8eCcEf87577F3fA16bEc32da3c4433b', // prod
      [baseSepolia.id]: '0x', // testnet
    },
    conditionId: {
      [base.id]: '0x8ab9929b54805ee46f575a7d0269fe8abd023f4a6f88d358c09f11ab0332c93e', // prod
      [baseSepolia.id]: '0x', // testnet
    },
    questionId: {
      [base.id]: '0x', // prod
      [baseSepolia.id]: '0x', // testnet
    },
    collateralToken: {
      [base.id]: onChain.address[base.id], // prod
      [baseSepolia.id]: onChain.address[baseSepolia.id], // testnet
    },
    tokenTicker: {
      [base.id]: onChain.symbol,
      [baseSepolia.id]: onChain.symbol,
    },
    tokenURI: {
      [base.id]: onChain.imageURI,
      [baseSepolia.id]: onChain.imageURI,
    },
    outcomeTokens: ['Yes', 'No'],
    title: 'Will FarCabana have more than 350 signups by Aug 9?',
    description: `It's Onchain Summer 2024 lfg. Farcabana is the Private Island FarCabana owned by Guild.xyz & TheCreators, which is being opened up for a limited time to our community. Currently there are 87 signups. If by the end of Aug 9 there are more than 350 signups, it’s ‘yes’. If on 00:00:00 on Aug 10 there are less than 350 signups, it’s ‘no’`,
    placeholderURI: '/assets/images/markets/market9.png',
    imageURI: '/assets/images/markets/market9.png',
    ogImageURI: 'https://limitless.exchange/assets/images/markets/market9.png',
    expirationDate: 'June 1, 2024',
    expirationTimestamp: new Date('June 1, 2024').getTime(),
    expired: Date.now() > new Date('June 1, 2024').getTime(), // TODO: make dynamic
    creator: {
      name: '/onchain',
      imageURI: '/assets/images/markets/onchain.jpg',
      link: 'https://warpcast.com/~/channel/onchain',
    },
    tags: ['FarCabana', 'Onchain', 'OnchainSummer', 'FarCon'],
  },

  // done: higher
  {
    address: {
      [base.id]: '0x062B14f02fA7c79532a0E248090EEa6beDbbeb31', // prod
      [baseSepolia.id]: '0x', // testnet
    },
    conditionId: {
      [base.id]: '0x2bd54d8008e0c79a1b7e9c048fef1ff7ee2d8989f00c22bb3907542f2528f19d', // prod
      [baseSepolia.id]: '0x', // testnet
    },
    questionId: {
      [base.id]: '0x', // prod
      [baseSepolia.id]: '0x', // testnet
    },
    collateralToken: {
      [base.id]: higher.address[base.id], // prod
      [baseSepolia.id]: higher.address[baseSepolia.id], // testnet
    },
    tokenTicker: {
      [base.id]: higher.symbol,
      [baseSepolia.id]: higher.symbol,
    },
    tokenURI: {
      [base.id]: higher.imageURI,
      [baseSepolia.id]: higher.imageURI,
    },
    outcomeTokens: ['Yes', 'No'],
    title: 'Will kugusha.eth have more than 40k followers on Farcaster in a week?',
    description: `kugusha.eth currently has 35,312 followers and gets 2.4k WoW growth in followers. `,
    placeholderURI: '/assets/images/markets/market8.png',
    imageURI: '/assets/images/markets/market8.png',
    ogImageURI: 'https://limitless.exchange/assets/images/markets/market8.png',
    expirationDate: 'May 22, 2024',
    expirationTimestamp: new Date('May 22, 2024').getTime(),
    expired: Date.now() > new Date('May 22, 2024').getTime(), // TODO: make dynamic
    creator: {
      name: '/higher',
      imageURI: '/assets/images/markets/higher.png',
      link: 'https://warpcast.com/~/channel/higher',
    },
    tags: ['Higher', 'kugusha', 'Farcaster', 'Warpcast'],
  },

  // done: degen
  {
    address: {
      [base.id]: '0xf1722e6101a4eABC285ef0a202b9890DB159818d', // prod
      [baseSepolia.id]: '0x', // testnet
    },
    conditionId: {
      [base.id]: '0x113a8d05722eb109a450000c1626a9f4bc3634ed1ee88ffef2615bb541efd2e9', // prod
      [baseSepolia.id]: '0x', // testnet
    },
    questionId: {
      [base.id]: '0x', // prod
      [baseSepolia.id]: '0x', // testnet
    },
    collateralToken: {
      [base.id]: degen.address[base.id], // prod
      [baseSepolia.id]: weth.address[baseSepolia.id], // testnet
    },
    tokenTicker: {
      [base.id]: degen.symbol,
      [baseSepolia.id]: weth.symbol,
    },
    tokenURI: {
      [base.id]: degen.imageURI,
      [baseSepolia.id]: weth.imageURI,
    },
    outcomeTokens: ['Yes', 'No'],
    title: 'Will Real Madrid win the Champions League',
    description: `The 2023–24 UEFA Champions League is the 69th season of Europe's premier club football tournament organized by UEFA. The final is scheduled to be played on June 1, 2024 at the Wembley Stadium in London, England. This market will resolve to “Yes” if Real Madrid wins the 2023-24 UEFA Champions League. Otherwise, this market will resolve to "No". This market will immediately resolve to "No" if this team is eliminated from contention to win the 2023-2024 Champions League.`,
    placeholderURI: '/assets/images/markets/market7.png',
    imageURI: '/assets/images/markets/market7.png',
    ogImageURI: 'https://limitless.exchange/assets/images/markets/market7.png',
    expirationDate: 'June 1, 2024',
    expirationTimestamp: new Date('June 1, 2024').getTime(),
    expired: Date.now() > new Date('June 1, 2024').getTime(), // TODO: make dynamic
    creator: {
      name: '@ZinedineYazidZi',
      imageURI: '/assets/images/markets/zinedine-yazid-zi.png',
      link: 'https://twitter.com/ZinedineYazidZi',
    },
    tags: ['Football', 'ChampionsLeague', 'Final', 'RealMadrid', 'Borussia'],
  },

  // correct
  {
    address: {
      [base.id]: '0x96ace74aa1ae07f7baf4e7f2736cbe2a703712fc', // prod
      [baseSepolia.id]: '0x', // testnet
    },
    conditionId: {
      [base.id]: '0x1b1556cd8fe93497a2dbd7b0c53b237dd73e73b437fadeb2c3532bb1aac9007d', // prod
      [baseSepolia.id]: '0x1b1556cd8fe93497a2dbd7b0c53b237dd73e73b437fadeb2c3532bb1aac9007d', // testnet
    },
    collateralToken: {
      [base.id]: weth.address[base.id], // prod
      [baseSepolia.id]: weth.address[baseSepolia.id], // testnet
    },
    tokenTicker: {
      [base.id]: weth.symbol,
      [baseSepolia.id]: weth.symbol,
    },
    tokenURI: {
      [base.id]: weth.imageURI,
      [baseSepolia.id]: weth.imageURI,
    },
    outcomeTokens: ['Yes', 'No'],
    title: 'Will Lex Fridman come back from his ayahuasca trip with one of these?',
    description: `Two weeks ago Lex Friedman announced he will be out for his trip to Amazon jungle with Paul Rosolie, who was Lex Podcast’s guest a year ago where they discussed ayahuasca. The deadline will be added once Lex is back from Amazon jungle.`,
    placeholderURI: '/assets/images/markets/market6-placeholder.png',
    imageURI: '/assets/images/markets/market6.png',
    ogImageURI: 'https://limitless.exchange/assets/images/markets/market6-og.png',
    expirationDate: 'TBA',
    expirationTimestamp: 1717189199000,
    expired: Date.now() > 1717189199000, // TODO: make dynamic
    creator: {
      name: '@AutismCapital',
      imageURI: '/assets/images/markets/autism-capital.png',
      link: 'https://twitter.com/AutismCapital',
    },
    tags: ['LexFriedman', 'ayahuasca', 'AutismCapital'],
  },

  // correct
  {
    address: {
      [base.id]: '0x5f3293417b0228bdc1896e34de99b377d31c77d8', // prod
      [baseSepolia.id]: '0x',
    },
    conditionId: {
      [base.id]: '0x07ce8a1f7b3107bf3812dba0fbd3aafb60e54f35f7cd5f03ba6e68b1561101d4', // prod
      [baseSepolia.id]: '0x07ce8a1f7b3107bf3812dba0fbd3aafb60e54f35f7cd5f03ba6e68b1561101d4', // testnet
    },
    collateralToken: {
      [base.id]: weth.address[base.id], // prod
      [baseSepolia.id]: weth.address[baseSepolia.id], // testnet
    },
    tokenTicker: {
      [base.id]: weth.symbol,
      [baseSepolia.id]: weth.symbol,
    },
    tokenURI: {
      [base.id]: weth.imageURI,
      [baseSepolia.id]: weth.imageURI,
    },
    outcomeTokens: ['Yes', 'No'],
    title: 'Will $REGEN reach $20M FDV within the first week of launch?',
    description: `Will $REGEN reach over 20 million in FDV within the first week after the launch?! Stake your prediction on the growth trajectory of the $REGEN community. The deadline will be added once the launch date is announced by Regen.`,
    placeholderURI: '/assets/images/markets/market5-placeholder.jpg',
    imageURI: '/assets/images/markets/market5.jpg',
    ogImageURI: 'https://limitless.exchange/assets/images/markets/market5-og.jpg',
    expirationDate: 'TBA',
    expirationTimestamp: 1717189199000,
    expired: Date.now() > 1717189199000, // TODO: make dynamic
    creator: {
      name: '@rev',
      imageURI: '/assets/images/markets/rev.jpg',
      link: 'https://warpcast.com/rev',
    },
    tags: ['Regen', 'Memecoins', 'Optimism', 'Farcaster '],
  },

  // correct
  {
    address: {
      [base.id]: '0xE47907110663A3F0c06c1929ea52f50bC9821d13', // prod
      [baseSepolia.id]: '0x729873AA483CEd60ACb0B7Ad815f14C8A7794930',
    },
    questionId: {
      [base.id]: '0x0000000000000000000000000000000000000031373133383836363839313539', // prod
      [baseSepolia.id]: '0x0000000000000000000000000000000000000031373135323436373136313237', // testnet
    },
    conditionId: {
      [base.id]: '0x1f7ac97795fbb425912193fc477b009cc6d1bc7b503e9dd938b8a3281093a513', // prod
      [baseSepolia.id]: '0xf0344b254c603d3d44d38629cd6b0c4c6c3c4115411d41c54e0ce2748072685a', // testnet
    },
    collateralToken: {
      [base.id]: weth.address[base.id], // prod
      [baseSepolia.id]: higher.address[baseSepolia.id], // testnet
    },
    tokenTicker: {
      [base.id]: weth.symbol,
      [baseSepolia.id]: higher.symbol,
    },
    tokenURI: {
      [base.id]: weth.imageURI,
      [baseSepolia.id]: higher.imageURI,
    },
    outcomeTokens: ['Yes', 'No'],
    title: 'Will $HIGHER hit $100M FDV in May?',
    description: `Will $HIGHER reach a $100M FDV in May? Place your bets today!`,
    placeholderURI: '/assets/images/markets/market3-placeholder.jpg',
    imageURI: '/assets/images/markets/market3.jpg',
    ogImageURI: 'https://limitless.exchange/assets/images/markets/market3-og.jpg',
    expirationDate: 'May 31, 2024',
    expirationTimestamp: 1716305451000,
    expired: Date.now() > 1716305451000, // TODO: make dynamic
    creator: {
      name: '/onchain',
      imageURI: '/assets/images/markets/onchain.jpg',
      link: 'https://warpcast.com/~/channel/onchain',
    },
    tags: ['Onchain', 'Farcaster', 'Memecoins', 'Base'],
  },

  // correct
  {
    address: {
      [base.id]: '0x4585482A258d66b16a95734E86DCA1Ea338AC100', // prod
      [baseSepolia.id]: '0x5856Fb2BAB01b7b8330903eCb61374A9b2fb648c', //testnet
    },
    questionId: {
      [base.id]: '0x0000000000000000000000000000000000000031373134333938343634363738', // prod
      [baseSepolia.id]: '0x0000000000000000000000000000000000000031373135373333323233363833', // testnet
    },
    conditionId: {
      [base.id]: '0x85b3752114969525a2a84dba1c1f2534bf830e64c1293a758095126a4dd165ba', // prod
      [baseSepolia.id]: '0xcfe3e3db08f015e99b4ec97ad3aa01ee694937ce6af526b8c17a3c844788e311', // testnet
    },
    collateralToken: {
      [base.id]: weth.address[base.id], // prod
      [baseSepolia.id]: weth.address[baseSepolia.id], // testnet
    },
    tokenTicker: {
      [base.id]: weth.symbol,
      [baseSepolia.id]: weth.symbol,
    },
    tokenURI: {
      [base.id]: weth.imageURI,
      [baseSepolia.id]: weth.imageURI,
    },
    outcomeTokens: ['Yes', 'No'],
    title: 'Will Limitless achieve $10M in volume in the first year since launch?',
    description: `Bet on or against new social prediction market Limitless’ success.`,
    placeholderURI: '/assets/images/markets/market4-placeholder.jpg',
    imageURI: '/assets/images/markets/market4.jpg',
    ogImageURI: 'https://limitless.exchange/assets/images/markets/market4-og.jpg',
    expirationDate: 'Apr 25, 2025',
    expirationTimestamp: 1745614799000,
    expired: Date.now() > 1745614799000, // TODO: make dynamic
    creator: {
      name: '@grin',
      imageURI: '/assets/images/markets/grin.jpg',
      link: 'https://warpcast.com/grin',
    },
    tags: ['Limitless', 'KPI driven', 'Grin'],
  },

  // correct
  {
    address: {
      [base.id]: '0x0e03eDc2A0ba38E803DaD62b31b6e6A2f4b216cc', // prod
      [baseSepolia.id]: '0xCA8CD401A4560A0D1B158f8292b85C78cB38Ffc1', // testnet
    },
    questionId: {
      [base.id]: '0x0000000000000000000000000000000000000031373133383836363736333632', // prod
      [baseSepolia.id]: '0x0000000000000000000000000000000000000031373135323436343231383432', // testnet
    },
    conditionId: {
      [base.id]: '0x33173bef347cb768b208efd547d445aec0fa1fc16f869093a7783e13ac2c2fff', // prod
      [baseSepolia.id]: '0x84d5169ac2cecd75741c02d71eb85e11c51ec6d8ed442b37e4d3210fbc03192c', // testnet
    },
    collateralToken: {
      [base.id]: weth.address[base.id], // prod
      [baseSepolia.id]: degen.address[baseSepolia.id], // testnet
    },
    tokenURI: {
      [base.id]: weth.imageURI,
      [baseSepolia.id]: degen.imageURI,
    },
    tokenTicker: {
      [base.id]: weth.symbol,
      [baseSepolia.id]: degen.symbol,
    },
    outcomeTokens: ['Yes', 'No'],
    title: 'Will $DEGEN have 1M+ holders by the end of 2024?',
    description:
      'Bet on whether $DEGEN will reach over 1 million holders by the close of 2024! Place your stake and predict the future of the $DEGEN community growth.',
    placeholderURI: '/assets/images/markets/market1-placeholder.jpg',
    imageURI: '/assets/images/markets/market1.jpg',
    ogImageURI: 'https://limitless.exchange/assets/images/markets/market1-og.jpg',
    expirationDate: 'Dec 31, 2024',
    expirationTimestamp: 1735682399000,
    expired: Date.now() > 1735682399000, // TODO: make dynamic
    creator: {
      name: '/skininthegame',
      imageURI: '/assets/images/markets/skininthegame.jpg',
      link: 'https://warpcast.com/~/channel/skininthegame',
    },
    tags: ['Degen', 'Memecoins', 'Base', 'Farcaster'],
  },

  // correct
  {
    address: {
      [base.id]: '0x2a5254e52e338228dcd82baa4374608bb884e834', // prod
      [baseSepolia.id]: '0x1a2ba71e69a2ad9ff40555b30586bba0efcd7616', // testnet
    },
    questionId: {
      [base.id]: '0x0000000000000000000000000000000000000031373133383836353239313438', // prod
      [baseSepolia.id]: '0x0000000000000000000000000000000000000031373135323436353432323633', // testnet
    },
    conditionId: {
      [base.id]: '0xa397e6687681345146d869a05591b002039d1ed88bfc5e871bf36d26cd89e367', // prod
      [baseSepolia.id]: '0x97e1b00a92cf8041deb17ccf2ea22ff61bec9b8474f77fc66cf2bec33aad4d58', // testnet
    },
    collateralToken: {
      [base.id]: weth.address[base.id], // prod
      [baseSepolia.id]: regen.address[baseSepolia.id], // testnet
    },
    tokenTicker: {
      [base.id]: weth.symbol,
      [baseSepolia.id]: regen.symbol,
    },
    tokenURI: {
      [base.id]: weth.imageURI,
      [baseSepolia.id]: regen.imageURI,
    },
    outcomeTokens: ['Yes', 'No'],
    title: 'Will Farcaster hit 100k WAUs before the end of Farcon?',
    description: `Think Farcaster will hit 100k WAUs before Farcon finishes on May 5? Bet on your belief and see if Farcaster blows up again!`,
    placeholderURI: '/assets/images/markets/market2-placeholder.jpg',
    imageURI: '/assets/images/markets/market2.jpg',
    ogImageURI: 'https://limitless.exchange/assets/images/markets/market2-og.jpg',
    expirationDate: 'May 5, 2024',
    expirationTimestamp: 1716305451000,
    expired: false, // TODO: make dynamic
    winningOutcomeIndex: 1, // TODO: report winners
    creator: {
      name: '@rev',
      imageURI: '/assets/images/markets/rev.jpg',
      link: 'https://warpcast.com/rev',
    },
    tags: ['Farcaster', 'Warpcast'],
  },
]
