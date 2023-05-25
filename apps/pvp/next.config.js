const developmentENV = {
  // Graphql_Api: '/graphqlApi',
  Graphql_Api:
    'https://api.thegraph.com/subgraphs/name/tiannalu1229/pvp-new-test03',
  Dealer_Contract_Address: '0xb859A9eBe57A77D08d9CB9fDb5ad8051b1C18Aa6',
  Player_Contract_Address: '0x36F2d4001264bA8C8620C46db079ef3A5d20bc14',
  Price_Contract_Address: '0x1D34e74F1fF65F088f72B3694EfC635D373C87A2',
  Factory_Contract_Address: '0x833DB9D80e0b02173e7B13A31ee6301afd5a7B12',
  Router_Contract_Address: '0xC18b8B5BC12bC772dc67C27CB8f86c0FD01C645B',
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
