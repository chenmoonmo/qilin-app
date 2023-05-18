const developmentENV = {
  Graphql_Api:
    'https://api.thegraph.com/subgraphs/name/tiannalu1229/pvp-new-test01',
  Dealer_Contract_Address: '0xf3B925FdB49aCad6B962D6a89ff10AB741f2Ac7c',
  Player_Contract_Address: '0x4137D11A40E68D15A93aEDAA856B1850d2224876',
  Price_Contract_Address: '0x79a02a903B929bC3413bFFc2Fbb7836F9ff8B180',
  Factory_Contract_Address: '0x930936CF4069261D747fdb330a3A9b08086CE6Aa',
  Router_Contract_Address: '0xc3F11aD86cCe19AaC266B6432c13Fb7058F45A05',
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
        source: '/api/:path*',
        destination: `${env.Graphql_Api}/:path*`,
      },
    ];
  },

  env,
};

module.exports = nextConfig;
