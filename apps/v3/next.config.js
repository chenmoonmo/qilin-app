const developmentENV = {
  CHAIN_IDS: [],
  // SERVICE_API_URL: 'http://192.168.3.21:8888/',
  SERVICE_API_URL: 'http://192.168.31.50:18888/',
  ARBITRUM_GOERLI_FACTORY_ADDRESS: '0x3537aa341DF41Bd769c41b12e517c1eF89C8d79C',
  ARBITRUM_GOERLI_CHAIN_LINK_ADDRESS:
    '0x77797F48B958b261a3345f6B330a0cF6B9C30c3B',
};

const productionENV = {
  SERVICE_API_URL: 'http://192.168.31.50:18888/',
  ARBITRUM_GOERLI_FACTORY_ADDRESS: '0xf760cb7b1aCA6d990e0f8b02f9A8dd40baBa1B01',
  ARBITRUM_GOERLI_CHAIN_LINK_ADDRESS:
    '0x77797F48B958b261a3345f6B330a0cF6B9C30c3B',
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
};

module.exports = nextConfig;
