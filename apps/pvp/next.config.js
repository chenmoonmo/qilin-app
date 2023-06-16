const developmentENV = {
  // Graphql_Api: '/graphqlApi',
  Graphql_Api:
    'https://api.thegraph.com/subgraphs/name/tiannalu1229/pvp-table-official',
  Dealer_Contract_Address: '0x4A194379acC361919E2604e22df77990068Bd552',
  Player_Contract_Address: '0xd04Dc9eeCEC8a4601eC4fe1D9fb07Ef0277Ca925',
  Price_Contract_Address: '0x3ADBB92FE4Af2872E8f6451C2724384181b3db32',
  Factory_Contract_Address: '0xa738e81e6Debf1011494131e238Dd4F5Eb5521b4',
  Router_Contract_Address: '0xD51A07088a3cb61e273eFAA89756D334fc0E7627',
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
