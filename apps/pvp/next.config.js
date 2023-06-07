const developmentENV = {
  // Graphql_Api: '/graphqlApi',
  Graphql_Api:
    'https://api.thegraph.com/subgraphs/name/tiannalu1229/pvp-table-official',
  Dealer_Contract_Address: '0x50AA1e2a189AF7c940cDe0E84B0b0d2FC7027f55',
  Player_Contract_Address: '0x5c78724E448f62CA8bE731ede002dD716d0a0De2',
  Price_Contract_Address: '0xfF5b08Eda857CadD86fD4f16924c172Db93829c0',
  Factory_Contract_Address: '0xa738e81e6Debf1011494131e238Dd4F5Eb5521b4',
  Router_Contract_Address: '0x2a6229Ee333Cfa6F21204cC88bb983d9C81f9ca6',
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
