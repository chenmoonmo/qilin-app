const graphqlApi =
  'https://api.thegraph.com/subgraphs/name/tiannalu1229/pvp-new-test01';

const developmentENV = {
  Graphql_Api: '/graphqlApi',
  Dealer_Contract_Address: '0x2e2457dC8A4Ba1afBFE798D78769834C0999705A',
  Player_Contract_Address: '0x38B789FB68a1Cba6479f9D70162F0a3cB5188DBA',
  Price_Contract_Address: '0x79a02a903B929bC3413bFFc2Fbb7836F9ff8B180',
  Factory_Contract_Address: '0xd66D65C46027fD0eA3a830f0Dd890a3E9086eb51',
  Router_Contract_Address: '0x427Ad9c62c05449474cD3Ba985b280ED22cda059',
};

const productionENV = {};

const isDevelopment = process.env.NODE_ENV === 'development';

const env = isDevelopment ? developmentENV : productionENV;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['@qilin/wagmi-provider'],
  async rewrites() {
    return [
      {
        source: `${env.Graphql_Api}/:path*`,
        destination: `${graphqlApi}/:path*`,
      },
    ];
  },

  env,
};

module.exports = nextConfig;
