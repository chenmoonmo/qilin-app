import { goerli } from 'wagmi';

export const PAIRS = {
  [goerli.id]: [
    {
      name: 'BTC / ETH',
      oracleAddress: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
    },
    {
      name: 'BTC / USD',
      oracleAddress: '0xA39434A63A52E749F02807ae27335515BA4b07F7',
      tokenAddress: '',
    },
    {
      name: 'CZK / USD',
      oracleAddress: '0xAE45DCb3eB59E27f05C170752B218C6174394Df8',
      tokenAddress: '',
    },
    {
      name: 'DAI / USD',
      oracleAddress: '0x0d79df66BE487753B02D015Fb622DED7f0E9798d',
      tokenAddress: '',
    },
    {
      name: 'ETH / USD',
      oracleAddress: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e',
      tokenAddress: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
    },
    {
      name: 'EUR / USD',
      oracleAddress: '0x44390589104C9164407A0E0562a9DBe6C24A0E05',
      tokenAddress: '',
    },
    {
      name: 'FORTH / USD',
      oracleAddress: '0x7A65Cf6C2ACE993f09231EC1Ea7363fb29C13f2F',
      tokenAddress: '',
    },
    {
      name: 'GBP / USD',
      oracleAddress: '0x73D9c953DaaB1c829D01E1FC0bd92e28ECfB66DB',
      tokenAddress: '',
    },
    {
      name: 'JPY / USD',
      oracleAddress: '0x982B232303af1EFfB49939b81AD6866B2E4eeD0B',
      tokenAddress: '',
    },
    {
      name: 'LINK / ETH',
      oracleAddress: '0xb4c4a493AB6356497713A78FFA6c60FB53517c63',
      tokenAddress: '',
    },
    {
      name: 'LINK / USD',
      oracleAddress: '0x48731cF7e84dc94C5f84577882c14Be11a5B7456',
      tokenAddress: '',
    },
    {
      name: 'SNX / USD',
      oracleAddress: '0xdC5f59e61e51b90264b38F0202156F07956E2577',
      tokenAddress: '',
    },
    {
      name: 'USDC / USD',
      oracleAddress: '0xAb5c49580294Aff77670F839ea425f5b78ab3Ae7',
      tokenAddress: '',
    },
    {
      name: 'XAU / USD',
      oracleAddress: '0x7b219F57a8e9C7303204Af681e9fA69d17ef626f',
      tokenAddress: '',
    },
  ],
};

export const PAY_TOKENS = {
  [goerli.id]: [
    {
      symbol: 'USD',
      address: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
    },
    {
      symbol: 'USDT',
      address: '0x0d79df66BE487753B02D015Fb622DED7f0E9793d',
    },
  ],
};
