const developmentENV = {
  SERVICE_API_URL: 'http://192.168.3.21:8888/',
};

const productionENV = {};

const isDevelopment = process.env.NEXT_PUBLIC_DOMAIN_ENV === 'development';

const env = isDevelopment ? developmentENV : productionENV;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['@qilin/wagmi-provider'],
  env,
  rewrites: async () => [
    {
      source: '/request:path*',
      destination: `${env.SERVICE_API_URL}/:path*`,
    },
  ],
};

module.exports = nextConfig;
