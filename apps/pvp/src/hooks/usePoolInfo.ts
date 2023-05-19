import { CONTRACTS } from '@/constant';
import { useBlockNumber, useContractRead } from 'wagmi';
import Player from '@/constant/abis/Player.json';
import Dealer from '@/constant/abis/Dealer.json';

import useSWR from 'swr';
import { gql } from 'graphql-request';
import { graphFetcher } from '@/hleper';

export const usePoolInfo = (playerNFTId: number) => {
  const { data: blockNumber } = useBlockNumber();

  // const { data: createDealerId } = useContractRead({
  //   address: CONTRACTS.PlayerAddress,
  //   abi: Player.abi,
  //   functionName: 'playerToDealer',
  //   args: [playerNFTId],
  // });

  // const { data: poolAddress } = useContractRead({
  //   address: CONTRACTS.DealerAddress,
  //   abi: Dealer.abi,
  //   functionName: 'dealerToPool',
  //   args: [createDealerId],
  // });

  // mock
  const poolAddress = '0xf11A9dbadbFAF742f7958a43cC466bbb78F5d876';

  const { data: poolInfo, mutate } = useSWR(
    poolAddress ? ['getPoolInfo', poolAddress, blockNumber] : null,
    async ([_, poolAddress, blockNumber]) => {
      const openBlockHeight = blockNumber! - 5760;
      const res = await graphFetcher(
        gql`{
        pools(where:{id: "${poolAddress}" }){id,oracle,trade_token,reverse,pool_token,oracle_pool,trade_pair,trade_symbol,pool_symbol,trade_decimal,pool_decimal,debt_address,fee,ls_amount,liquidity,total_size_long,total_size_short,rebase_accumulated_long,rebase_accumulated_short,last_rebase_block,create_block_height,updated_block_height,debt_address,token_price}
        positions(where:{poolAddress: "${poolAddress}" }){margin, close_type}
        openPosition: positions(where:{open_block_height_gt:${openBlockHeight}}){size, margin, level, service_fee, poolAddress}
        closePosition: positions(where:{close_block_height_gt:${openBlockHeight}}){size, margin, level, service_fee, pnl, poolAddress}
        settings(where:{id_in:["0x4a8001192e29AADD053979b9243cB9699229B8D0","${poolAddress}"]}){id, margin_ratio, closing_fee, liq_fee_base, liq_fee_max, liq_fee_coefficient, imbalance_threshold, rebase_coefficient, price_deviation_coefficient, deviation, liquidity_coefficient}
        debts(where:{poolAddress: "${poolAddress}"}){total_debt}
      }`
      );
    }
  );
};
