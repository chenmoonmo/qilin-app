import { CONTRACTS } from '@/constant';
import {
  Address,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';

import Router from '@/constant/abis/Router.json';
import Pool from '@/constant/abis/Pool.json';

type ClosePostionPropsType = {
  position: any;
  poolAddress: Address;
};

export const useClosePostion = ({
  position,
  poolAddress,
}: ClosePostionPropsType) => {
  const { address } = useAccount();

  const isNeedLiquidate = position?.ROE / 100 <= -0.8;

  const { config } = usePrepareContractWrite({
    address: CONTRACTS.RouterAddress,
    abi: Router.abi,
    functionName: isNeedLiquidate ? 'liquidate' : 'close',
    args: [poolAddress, position?.index, address],
  });

  const { writeAsync } = useContractWrite(config);

  return {
    closePostion: writeAsync,
    isNeedLiquidate,
  };
};
