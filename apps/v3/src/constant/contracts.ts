import type { Address } from 'wagmi';
import { arbitrum, arbitrumGoerli } from 'wagmi/chains';

export const contacts = {
  [arbitrumGoerli.id as number]: {
    factory: process.env.ARBITRUM_GOERLI_FACTORY_ADDRESS as Address,
    chainLink: process.env.ARBITRUM_GOERLI_CHAIN_LINK_ADDRESS as Address,
    testToken: process.env.ARBITRUM_GOERLI_TEST_TOKEN_ADDRESS as Address,
  },
  [arbitrum.id as number]: {
    factory: process.env.ARBITRUM_FACTORY_ADDRESS as Address,
    chainLink: process.env.ARBITRUM_CHAIN_LINK_ADDRESS as Address,
    testToken: process.env.ARBITRUM_TEST_TOKEN_ADDRESS as Address,
  },
};
