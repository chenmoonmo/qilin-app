import type { Address } from 'wagmi';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { erc20ABI, useBalance, useContractRead } from 'wagmi';
import { BigNumber } from 'ethers';

export const useTokenInfo = ({
  address,
  approveAddress,
}: {
  address: Address;
  approveAddress?: Address;
}) => {
  const { data: allowance, refetch: refetchAllowance } = useContractRead({
    address,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address, approveAddress!],
    enabled: !!approveAddress,
  });

  const {
    data,
    isError,
    isLoading,
    refetch: refetchBalance,
  } = useBalance({
    address,
  });

  const { config } = usePrepareContractWrite({
    address,
    abi: erc20ABI,
    functionName: 'approve',
    args: [
      approveAddress!,
      BigNumber.from(
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      ),
    ],
  });

  const { write } = useContractWrite(config);

  const approve = () => {
    write?.();
  };

  return {
    ...data,
    allowance,
    refetchBalance,
    refetchAllowance,
  };
};
