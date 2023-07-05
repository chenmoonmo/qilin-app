import type { Address } from 'wagmi';
import { arbitrumGoerli } from 'wagmi/chains';

export const contacts = {
  [arbitrumGoerli.id]: {
    factory: process.env.ARBITRUM_GOERLI_FACTORY_ADDRESS as Address,
  },
};
