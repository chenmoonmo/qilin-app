import { erc20ABI, useBalance, useContractRead, useContractReads } from 'wagmi';

export const useTokenInfo = ({ address }: { address: `0x${string}` }) => {
  
  const { data: allowance, refetch: refetchAllowance } = useContractRead({
    address,
    abi: erc20ABI,
    functionName: 'allowance',
    enabled: false
  });
  

  const {
    data,
    isError,
    isLoading,
    refetch: refetchBalance,
  } = useBalance({
    address,
    enabled: false
  });

  return {
    ...data,
    allowance,
    refetchBalance,
    refetchAllowance,
  };
};
