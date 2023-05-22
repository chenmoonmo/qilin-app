import { CONTRACTS } from '@/constant';
import { Address, useContractRead } from 'wagmi';
import Player from '@/constant/abis/Player.json';
import Dealer from '@/constant/abis/Dealer.json';

import useSWR from 'swr';
import { gql } from 'graphql-request';
import { graphFetcher } from '@/hleper';
import { BigNumber } from 'ethers';

type PoolItemType = Record<'token0' | 'token1' | 'pay_token', Address> &
  Record<
    | 'id'
    | 'token0Decimal'
    | 'token1Decimal'
    | 'pay_token_decimal'
    | 'pay_token_symbol'
    | 'token_price'
    | 'trade_pair'
    | 'margin'
    | 'margin_ratio'
    | 'lp'
    | 'lp_price'
    | 'deadline',
    string
  >;

type MergePositionsType = {
  id: `${string}-${'long' | 'short'}`;
  lp: string;
  fake_lp: string;
  asset: string;
  open_lp: string;
  open_price: string;
};

type PoolInfoType = {
  pools: [PoolItemType];
  mergePositions: MergePositionsType[];
};

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

  const { data, isLoading, mutate } = useSWR(
    poolAddress
      ? ['getPoolInfo', (poolAddress as Address).toLowerCase()]
      : null,
    async ([_, poolAddress]) => {
      const res = await graphFetcher<PoolInfoType>(
        // TODO: 抽离 querystring
        gql`{
          pools(where:{id:"${poolAddress}"}) {id,token0,token1, margin,margin_ratio ,trade_pair, pay_token, pay_token_decimal, pay_token_symbol, token_price, asset, lp, lp_price, level, token0Decimal, token1Decimal,deadline}
          mergePositions(where:{id_in:["${poolAddress}-long", "${poolAddress}-short"]}){id, lp, fake_lp, asset,open_lp,open_price}
          }
          `
      );
      const { pools, mergePositions } = res;

      const { longPrecent, shortPrecent } = mergePositions.reduce(
        (acc, cur) => {
          const { id, ...rest } = cur;
          const [_, type] = id.split('-');
          if (type === 'long') {
            acc.longPrecent = rest.open_lp;
          } else {
            acc.shortPrecent = rest.open_lp;
          }
          return acc;
        },
        { longPrecent: '0', shortPrecent: '0' }
      );

      //FIXME: remove mock data
      return {
        longPrecent,
        shortPrecent,
        poolInfo: {
          ...pools[0],
          token0: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
          token1: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
          token_price: 'ETH/USD',
        },
      };
    }
  );
  return {
    createDealerId: createDealerId as BigNumber,
    poolAddress,
    poolInfo: data?.poolInfo,
    isLoading,
    mutate,
  };
};
