import { CONTRACTS } from '@/constant';
import { useContractRead } from 'wagmi';
import Player from '@/constant/abis/Player.json';
import Dealer from '@/constant/abis/Dealer.json';

import useSWR from 'swr';
import { gql } from 'graphql-request';
import { graphFetcher } from '@/hleper';

type PoolInfoType = {};

export const usePoolInfo = (playerNFTId: number) => {
  const { data: createDealerId } = useContractRead({
    address: CONTRACTS.PlayerAddress,
    abi: Player.abi,
    functionName: 'playerToDealer',
    args: [playerNFTId],
  });

  const { data: poolAddress } = useContractRead({
    address: CONTRACTS.DealerAddress,
    abi: Dealer.abi,
    functionName: 'dealerToPool',
    args: [createDealerId],
    enabled: !!createDealerId,
  });

  console.log(playerNFTId, poolAddress);

  const { data: poolInfo, mutate } = useSWR(
    poolAddress ? ['getPoolInfo', poolAddress] : null,
    async ([_, poolAddress]) => {
      const res = await graphFetcher<PoolInfoType>(
        gql`{
          pools(where:{id:"${poolAddress}"}) {id,token0,token1, margin,margin_ratio ,trade_pair, pay_token, pay_token_decimal, pay_token_symbol, token_price, asset, lp, lp_price, level, token0Decimal, token1Decimal}
          mergePositions(where:{id_in:["${poolAddress}-long", "${poolAddress}-short"]}){id, lp, fake_lp, asset,open_lp,open_price}
          }
          `
      );
    }
  );
};
