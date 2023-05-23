import { CONTRACTS } from '@/constant';
import { Address, useContractWrite, usePrepareContractWrite } from 'wagmi';
import Router from '@/constant/abis/Router.json';

type OpenPositionPropsType = {
  poolAddress: Address;
  endTime: number;
};

export const useOpenPosition = ({
  poolAddress,
  endTime,
}: OpenPositionPropsType) => {
  
  const { config } = usePrepareContractWrite({
    address: CONTRACTS.RouterAddress,
    abi: Router.abi,
    functionName: 'open',
    args: [poolAddress, endTime],
  });

  const { write } = useContractWrite(config);

  return write;
};
