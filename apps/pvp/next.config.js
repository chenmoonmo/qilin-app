const developmentENV = {
  // Graphql_Api: '/graphqlApi',
  Graphql_Api:
    'https://api.thegraph.com/subgraphs/name/tiannalu1229/pvp-table-official',
  Dealer_Contract_Address: '0xC70474448EE7EAb53cc93a66dD72072cDAf7Dc83',
  Player_Contract_Address: '0x3Bd6aC6F5CcF74022303D66408aBDFD748d4B114',
  Price_Contract_Address: '0x3740A9353dFEdb3CA901648c44252568B5b0C34b',
  Factory_Contract_Address: '0xa738e81e6Debf1011494131e238Dd4F5Eb5521b4',
  Router_Contract_Address: '0x726813D361866485849709eFE481467E868f89F7',
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
