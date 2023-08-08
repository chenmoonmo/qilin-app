const developmentENV = {
  CHAIN_IDS: [],
  // SERVICE_API_URL: 'http://192.168.3.21:8888/',
  SERVICE_API_URL: 'http://192.168.31.50:18888/',
  ARBITRUM_GOERLI_FACTORY_ADDRESS: '0xFbe167d092Abb224AF6d9C4a315789e5161c9363',
  ARBITRUM_GOERLI_CHAIN_LINK_ADDRESS:
    '0xd5138eDA7e22c24c2bAe282640F9446632eC034D',
};

const productionENV = {
  SERVICE_API_URL: 'http://192.168.31.50:18888/',
  ARBITRUM_GOERLI_FACTORY_ADDRESS: '0xFbe167d092Abb224AF6d9C4a315789e5161c9363',
  ARBITRUM_GOERLI_CHAIN_LINK_ADDRESS:
    '0xd5138eDA7e22c24c2bAe282640F9446632eC034D',
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
