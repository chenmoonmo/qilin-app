const developmentENV = {
  // Graphql_Api: '/graphqlApi',
  Graphql_Api:
    'https://api.thegraph.com/subgraphs/name/tiannalu1229/pvp-new-test03',
  Dealer_Contract_Address: '0xb2583bEF5c9Cde3c649594405Cc23349006309e4',
  Player_Contract_Address: '0x2E6eFd411D066DdB057e07167b5d5489d22A00F8',
  Price_Contract_Address: '0x103bf56Be7654afDd7E0B307a2C2eFb3c8Dd6c5e',
  Factory_Contract_Address: '0xC5b5dA77C28A40dFD78D38Fb3096912aa962B7Fb',
  Router_Contract_Address: '0xb3671FF3826BDF5ee6E4462868202B24287890Db',
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
