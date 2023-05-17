const developmentENV = {
  Graphql_Api:
    'https://api.thegraph.com/subgraphs/name/tiannalu1229/pvp-new-test01',
  Dealer_Contract_Address: '0x06301EeF49E2b65935a5a29d5FcA34aa3C8CDC37',
  Player_Contract_Address: '0x463e12A4A4A8948a95dE008C2295E1769bF9f833',
  Price_Contract_Address: '0x79a02a903B929bC3413bFFc2Fbb7836F9ff8B180',
  Factory_Contract_Address: '0x67EefcB3ECdDd0936686eE553E079974D44Db25E',
  Router_Contract_Address: '0x6Ca1a4343d327b79968e5420be178cdF4d4631aD',
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
