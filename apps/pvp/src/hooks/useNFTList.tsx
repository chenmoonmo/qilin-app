import { gql } from 'graphql-request';
import useSWR from 'swr';
import type { Address } from 'wagmi';
import { useAccount } from 'wagmi';

import { graphFetcher } from '@/hleper';

export const useNFTList = () => {
  const { address } = useAccount();
  return useSWR(
    address ? ['queryNFTList', address.toLowerCase()] : null,
    async ([_, address]) => {
      const res = await graphFetcher<{
        dealers: {
          id: string;
          owner: Address;
        }[];
        players: {
          id: string;
          pool_address: Address;
          user: Address;
        }[];
      }>(
        gql`{
              dealers(where:{owner:"${address}"}){id,owner}
              players(where:{user_contains:["${address}"]}){id,pool_address,user}
                }
                `
      );
      return {
        dealer: res.dealers?.[0] ?? null,
        player: res.players,
      };
    }
  );
};
