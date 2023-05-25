const developmentENV = {
  // Graphql_Api: '/graphqlApi',
  Graphql_Api:
    'https://api.thegraph.com/subgraphs/name/tiannalu1229/pvp-new-test03',
  Dealer_Contract_Address: '0x242D8E4688AFAe7dE242D860C3e0ED006e333c0C',
  Player_Contract_Address: '0x69Fa8b43c67A1158501d71C06177f4010dF4bF3b',
  Price_Contract_Address: '0xb9e7Fbeb2dB1238455a39c27d0EBca62d0c52034',
  Factory_Contract_Address: '0xc4F230d0BC5a9079cd0Bac63a009Fe54e9b826E0',
  Router_Contract_Address: '0xf8da497f3F9C9a4b672d98355f3C5B2FdB3438F2',
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
