const developmentENV = {
  MultiNftFlashLoan: '0x020c2b09C1eDD25F53Bc7002a1F49BD6da41359d',
  NftUniV2FlashAndExec: '0x9A88b8E0A1Fe3019F70BBBbd2F3C8b6FCf43D6b7',
  AaveNext: '0x52bB1Edc40Cd681292209ed18e983340BA672870',
  WETH: '0xb83C277172198E8Ec6b841Ff9bEF2d7fa524f797',
  USDC: '0x72A9c57cD5E2Ff20450e409cF6A542f1E6c710fc',
  PairAddress: '0xa782ed8de7085029b3330b2724bffc9e503a6990',
  WETHAToken: '0xBA3a852aDB46C8AD31A03397CD22b2E896625548',
  USDCVariableDebt: '0x853382Ba681B4EF27c10403F736c43f9F558a600',
};

const productionENV = {};

const isDevelopment = process.env.NEXT_PUBLIC_DOMAIN_ENV === 'development';

const env = isDevelopment ? developmentENV : productionENV;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@qilin/wagmi-provider'],
  env,
};

module.exports = nextConfig;
