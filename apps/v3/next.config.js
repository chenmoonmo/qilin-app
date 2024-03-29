const developmentENV = {
  CHAIN_IDS: [],
  // SERVICE_API_URL: 'http://192.168.3.21:8888/',
  SERVICE_API_URL: 'http://192.168.31.50:18888/',
  ARBITRUM_GOERLI_FACTORY_ADDRESS: '0x2D3EFe65741E40722A87E58C4ed1cd938f13235A',
  ARBITRUM_GOERLI_CHAIN_LINK_ADDRESS:
    '0xd5138eDA7e22c24c2bAe282640F9446632eC034D',
  ARBITRUM_GOERLI_TEST_TOKEN_ADDRESS:
    '0xECcCD6EAD7015a425fF971c5f8b836Bb85a6dCE8',

  ARBITRUM_FACTORY_ADDRESS: '0x3D6BB83d38412A0d3045607bFBA9AE7D0c7a5262',
  ARBITRUM_CHAIN_LINK_ADDRESS: '0xc19adaCC64A3c6BC1eCe48db9E2541DE6247a903',
  ARBITRUM_TEST_TOKEN_ADDRESS: '0x5D314F39242872685c7301b759ac0Cb7ed024B56',
};

const productionENV = {
  SERVICE_API_URL: 'http://192.168.31.50:18888/',
  ARBITRUM_GOERLI_FACTORY_ADDRESS: '0x2D3EFe65741E40722A87E58C4ed1cd938f13235A',
  ARBITRUM_GOERLI_CHAIN_LINK_ADDRESS:
    '0xd5138eDA7e22c24c2bAe282640F9446632eC034D',
  ARBITRUM_GOERLI_TEST_TOKEN_ADDRESS:
    '0xECcCD6EAD7015a425fF971c5f8b836Bb85a6dCE8',

  ARBITRUM_FACTORY_ADDRESS: '0x3D6BB83d38412A0d3045607bFBA9AE7D0c7a5262',
  ARBITRUM_CHAIN_LINK_ADDRESS: '0xc19adaCC64A3c6BC1eCe48db9E2541DE6247a903',
  ARBITRUM_TEST_TOKEN_ADDRESS: '0x5D314F39242872685c7301b759ac0Cb7ed024B56',
};

const isDevelopment = process.env.NEXT_PUBLIC_DOMAIN_ENV === 'development';

const env = isDevelopment ? developmentENV : productionENV;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['@qilin/wagmi-provider'],
  env,
  rewrites: async () =>
    isDevelopment
      ? [
          {
            source: '/request/:path*',
            destination: `${env.SERVICE_API_URL}/:path*`,
          },
        ]
      : [],
  images: {
    domains: ['raw.githubusercontent.com'],
  },
};

module.exports = nextConfig;
