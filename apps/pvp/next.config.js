const developmentENV = {
  // Graphql_Api: '/graphqlApi',
  Graphql_Api:
    'https://api.thegraph.com/subgraphs/name/tiannalu1229/pvp-table-official',
  Dealer_Contract_Address: '0xb9b322462F2bAA80605DE65FA282C18989ef750e',
  Player_Contract_Address: '0x3E4ce0172e1EFa24648b05cF64E53D1F7636F84F',
  Price_Contract_Address: '0x8D236096075b89401008b34021F9846560e637E1',
  Factory_Contract_Address: '0xa738e81e6Debf1011494131e238Dd4F5Eb5521b4',
  Router_Contract_Address: '0xBf69C4f94d58717489Ad3d858278Eea2cdD597B5',
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
