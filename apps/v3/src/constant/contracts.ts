import type { Address } from 'wagmi';
import { arbitrumGoerli } from 'wagmi/chains';

export const contacts = {
  [arbitrumGoerli.id as number]: {
    factory: process.env.ARBITRUM_GOERLI_FACTORY_ADDRESS as Address,
    chainLink: process.env.ARBITRUM_GOERLI_CHAIN_LINK_ADDRESS as Address,
  },
};
