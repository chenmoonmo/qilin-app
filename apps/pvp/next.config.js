const graphqlApi =
  'https://thegraph.com/explorer/subgraph/tiannalu1229/pvp-new-test03';

const developmentENV = {
  // Graphql_Api: '/graphqlApi',
  Graphql_Api: 'https://api.thegraph.com/subgraphs/name/tiannalu1229/pvp-new-test03',
  Dealer_Contract_Address: '0x489DFa4D861Aba7a9A71F4C139F5d40247f93fa0',
  Player_Contract_Address: '0x00a9ccC4d302fbf6b42Cff168cd147eE5b6B7825',
  Price_Contract_Address: '0x844fdf16BA0F002a55B0FB30cbcD42B71cE3a16d',
  Factory_Contract_Address: '0x44691517841343B10eb04ca92089e210E8D7EDCA',
  Router_Contract_Address: '0x9aA62BbAfCb38AE01f0e7c0fFe3BF2b89458f602',
};

const productionENV = {};

const isDevelopment = process.env.NODE_ENV === 'development';

const env = isDevelopment ? developmentENV : productionENV;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['@qilin/wagmi-provider'],
  // async rewrites() {
  //   return [
  //     {
  //       source: `${env.Graphql_Api}/:path*`,
  //       destination: `${graphqlApi}/:path*`,
  //     },
  //   ];
  // },
  env,
};

module.exports = nextConfig;
