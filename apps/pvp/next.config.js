const developmentENV = {
  // Graphql_Api: '/graphqlApi',
  Graphql_Api:
    'https://api.thegraph.com/subgraphs/name/tiannalu1229/pvp-new-test03',
  Dealer_Contract_Address: '0xA08947cE1C5FC906cfa1ed1318B080AB625564D0',
  Player_Contract_Address: '0x953d8D626AD37ac7B8Cf390f977E0ef55B809247',
  Price_Contract_Address: '0x97911BB0B1296c4040bDe43D0Ea389083EBDf577',
  Factory_Contract_Address: '0x5d12A97bcea9374f2827Bc9751c5De32F8f1b12d',
  Router_Contract_Address: '0xcF55751EAAEBfB9BbA3e15A7c2fd054e3A1d8a63',
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
