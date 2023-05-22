const graphqlApi =
  'https://thegraph.com/explorer/subgraph/tiannalu1229/pvp-new-test03';

const developmentENV = {
  // Graphql_Api: '/graphqlApi',
  Graphql_Api: 'https://api.thegraph.com/subgraphs/name/tiannalu1229/pvp-new-test03',
  Dealer_Contract_Address: '0xf395766bc6B174cBd537fCabD8e27360Db8fFc29',
  Player_Contract_Address: '0x10265273bfBd3943FbfB075509EF44F3B40E835E',
  Price_Contract_Address: '0x79a02a903B929bC3413bFFc2Fbb7836F9ff8B180',
  Factory_Contract_Address: '0x05E5FB107B36686dc010656c863FFEC2d702DA51',
  Router_Contract_Address: '0x6409C310e65296e31ccd131D6fe64A48902b0fB5',
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
