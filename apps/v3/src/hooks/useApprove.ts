import { BigNumber } from 'ethers';
import { useCallback, useMemo } from 'react';
import type { Address } from 'wagmi';
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
} from 'wagmi';

export const useApprove = (
  token?: Address,
  spender?: Address,
  amount?: number | BigNumber
) => {
  const { address } = useAccount();

  const approveAmount = useMemo(() => {
    return BigNumber.from(amount ?? '0');
  }, [amount]);

  const { data: allowance, refetch } = useContractRead({
    address: token,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address!, spender!],
    enabled: !!address && !!spender,
  });

  const isNeedApprove = useMemo(
    () => (allowance as BigNumber)?.lt(approveAmount),
    [allowance, approveAmount]
  );

  const { writeAsync: approve } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: token,
    abi: erc20ABI,
    functionName: 'approve',
    args: [
      spender!,
      BigNumber.from(
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      ),
    ],
  });

  const handleApprove = useCallback(async () => {
    try {
      const res = await approve?.();
      await res?.wait();
      refetch();
    } catch (e) {
      console.error(e);
    }
  }, [approve, refetch]);

  return useMemo(() => {
    return {
      isNeedApprove,
      approve: handleApprove,
      refetch,
    };
  }, [isNeedApprove, handleApprove, refetch]);
};
