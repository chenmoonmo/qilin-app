const developmentENV = {
  // Graphql_Api: '/graphqlApi',
  Graphql_Api:
    'https://api.thegraph.com/subgraphs/name/tiannalu1229/pvp-table-official',
  Dealer_Contract_Address: '0xc24E5e83175Ed6d2494De6683158Fec610d0E3d5',
  Player_Contract_Address: '0x5f5D47b61e31acfA64204dea5e4643E8513c8c49',
  Price_Contract_Address: '0x2943d3288c5dE3FCfB9e00B22Ac5Cfea96d85F66',
  Factory_Contract_Address: '0xa738e81e6Debf1011494131e238Dd4F5Eb5521b4',
  Router_Contract_Address: '0x4023c3f446272dbcfE88B4a73Aa1984c49dcE6fA',
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
