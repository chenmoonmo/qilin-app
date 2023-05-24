import { CONTRACTS } from '@/constant';
import { Address, useContractWrite, usePrepareContractWrite } from 'wagmi';
import Router from '@/constant/abis/Router.json';
import { useCallback } from 'react';

type OpenPositionPropsType = {
  poolAddress: Address;
  endTime: number;
  enabled: boolean;
};

export const useOpenPosition = ({
  poolAddress,
  endTime,
  enabled = false,
}: OpenPositionPropsType) => {
  const { config } = usePrepareContractWrite({
    address: CONTRACTS.RouterAddress,
    abi: Router.abi,
    functionName: 'open',
    args: [poolAddress, endTime],
    enabled,
  });

  const { writeAsync } = useContractWrite(config);

  return useCallback(async () => {
    const res = await writeAsync?.();
    await res?.wait();
  }, [writeAsync]);
};
