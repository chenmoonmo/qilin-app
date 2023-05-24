const graphqlApi =
  'https://thegraph.com/explorer/subgraph/tiannalu1229/pvp-new-test03';

const developmentENV = {
  // Graphql_Api: '/graphqlApi',
  Graphql_Api: 'https://api.thegraph.com/subgraphs/name/tiannalu1229/pvp-new-test03',
  Dealer_Contract_Address: '0x5aD78C21d80887c098c375d44B8712c6ab4810e2',
  Player_Contract_Address: '0x5DEE89923eD12129abF31D998e42982777D56e4D',
  Price_Contract_Address: '0x9D12Ae3A29c26AD840e3989Beaa6BF7A3DdA800E',
  Factory_Contract_Address: '0x2D942b7df8BcDccADee1d968464F092dccd42d01',
  Router_Contract_Address: '0x47F4fe479b64D3285D36111C1b9bD391b6FCd101',
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
