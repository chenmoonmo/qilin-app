const developmentENV = {
  MultiNftFlashLoan: '0xe39af26aad06a0419588a85afbfc4f65855686a0',
  // NftUniV2FlashAndExec: '0x020c2b09C1eDD25F53Bc7002a1F49BD6da41359d',
  V3SwapNft: '0xc6879A32d840A3839E210f8E1Cd82869ab7f3262',
  V3FlashNft: '0x728bA4b241f06F24912265983E90D79Aa02CaD56',
  AaveNext: '0x52bB1Edc40Cd681292209ed18e983340BA672870',
  Pair: '0xa782ed8de7085029b3330b2724bffc9e503a6990',

  WETH: '0xb83C277172198E8Ec6b841Ff9bEF2d7fa524f797',
  USDC: '0x72A9c57cD5E2Ff20450e409cF6A542f1E6c710fc',
  WETHAToken: '0xBA3a852aDB46C8AD31A03397CD22b2E896625548',
  USDCVariableDebt: '0x853382Ba681B4EF27c10403F736c43f9F558a600',
};

const productionENV = {
  MultiNftFlashLoan: '0xD63675587Bc0cC89973fBD882Ad581b37a72517e',
  // NftUniV2FlashAndExec: '0x020c2b09C1eDD25F53Bc7002a1F49BD6da41359d',
  V3SwapNft: '0xc6879A32d840A3839E210f8E1Cd82869ab7f3262',
  V3FlashNft: '0x728bA4b241f06F24912265983E90D79Aa02CaD56',
  AaveNext: '0x0aAFD254a99A7bE967E04FFAa81D0111b76c873a',
  Pair: '0x13398E27a21Be1218b6900cbEDF677571df42A48',

  WETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  USDC: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  WETHAToken: '0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8',
  USDCVariableDebt: '0xFCCf3cAbbe80101232d343252614b6A3eE81C989',
};

const isDevelopment = process.env.NEXT_PUBLIC_DOMAIN_ENV === 'development';

const env = isDevelopment ? developmentENV : productionENV;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@qilin/wagmi-provider'],
  env,
};

module.exports = nextConfig;
