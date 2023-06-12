const developmentENV = {
  // Graphql_Api: '/graphqlApi',
  Graphql_Api:
    'https://api.thegraph.com/subgraphs/name/tiannalu1229/pvp-table-official',
  Dealer_Contract_Address: '0xa2b7C81462B6BC3b552B8a7FbE4BaC4c5b7D02B0',
  Player_Contract_Address: '0xC3772361291D94a71FC38F70EDcB5107cE10af0E',
  Price_Contract_Address: '0x6E398d7c0d21c3dFf9a561BEDC55c6E16e1bDE67',
  Factory_Contract_Address: '0xa738e81e6Debf1011494131e238Dd4F5Eb5521b4',
  Router_Contract_Address: '0x413e881901fdded8Fd1388E143f99e3c1E7BB00a',
};

const productionENV = {};

const isDevelopment = process.env.NEXT_PUBLIC_DOMAIN_ENV === 'development';

const env = isDevelopment ? developmentENV : productionENV;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['@qilin/wagmi-provider'],
  env,
};

module.exports = nextConfig;
