import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import type { Address } from 'wagmi';
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';

import { useToast } from '@/component';
import { CONTRACTS, TOKENS } from '@/constant';

const useApprove = (
  token: Address,
  spender: Address,
  amount: number | BigNumber
) => {
  const { address } = useAccount();

  const approveAmount = useMemo(() => {
    return BigNumber.from(amount);
  }, [amount]);

  const { data: allowance, refetch } = useContractRead({
    address: token,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address!, spender],
    enabled: !!address,
  });

  const isNeedApprove = useMemo(
    () => (allowance as BigNumber)?.lt(approveAmount),
    [allowance, approveAmount]
  );

  const { config } = usePrepareContractWrite({
    address: token,
    abi: erc20ABI,
    functionName: 'approve',
    args: [
      spender,
      BigNumber.from(
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      ),
    ],
    enabled: isNeedApprove,
  });

  const { writeAsync: approve } = useContractWrite(config);

  return useMemo(() => {
    return {
      isNeedApprove,
      approve,
      refetch,
    };
  }, [isNeedApprove, approve, refetch]);
};

export const useApproveTokens = ({
  WETHAmount,
  USDCAmount,
}: {
  WETHAmount: BigNumber | number;
  USDCAmount: BigNumber | number;
}) => {
  const { showToast, closeToast } = useToast();

  // USDC to AaveNext
  const {
    isNeedApprove: isNeedUSDCApprove,
    approve: approveUSDC,
    refetch: refetchUSDC,
  } = useApprove(
    TOKENS.USDC as Address,
    CONTRACTS.AaveNext as Address,
    USDCAmount
  );

  // USDC to V3FlashNft
  const {
    isNeedApprove: isNeedUSDCApprove1,
    approve: approveUSDC1,
    refetch: refetchUSDC1,
  } = useApprove(
    TOKENS.USDC as Address,
    CONTRACTS.V3FlashNft as Address,
    USDCAmount
  );

  // weth to V3SwapNft
  const {
    isNeedApprove: isNeedWETHApprove,
    approve: approveWETH,
    refetch: refetchWETH,
  } = useApprove(
    TOKENS.WETH as Address,
    CONTRACTS.V3SwapNft as Address,
    WETHAmount
  );

  //  WETHAToken代币approve给aaveNext.用于赎回自己的WETH
  const {
    isNeedApprove: isNeedWETHATokenApprove,
    approve: approveWETHAToken,
    refetch: refetchWETHAToken,
  } = useApprove(
    TOKENS.WETHAToken as Address,
    CONTRACTS.AaveNext as Address,
    WETHAmount
  );

  const hanldeApprove = async () => {
    try {
      showToast({
        message: 'Pending',
        type: 'loading',
      });
      let res;
      if (isNeedUSDCApprove) {
        res = await approveUSDC?.();
        await res?.wait();
        refetchUSDC();
      }
      if (isNeedUSDCApprove1) {
        res = await approveUSDC1?.();
        await res?.wait();
        refetchUSDC1();
      }
      if (isNeedWETHApprove) {
        res = await approveWETH?.();
        await res?.wait();
        refetchWETH();
      }
      if (isNeedWETHATokenApprove) {
        res = await approveWETHAToken?.();
        await res?.wait();
        refetchWETHAToken();
      }
      showToast({
        message: 'Operation success',
        type: 'success',
      });
    } catch (e) {
      console.error(e);
      showToast({
        message: 'Operation fail',
        type: 'error',
      });
    }
    setTimeout(() => {
      closeToast();
    }, 3000);
  };

  return {
    isNeedApprove:
      isNeedWETHApprove || isNeedUSDCApprove || isNeedWETHATokenApprove,
    hanldeApprove,
  };
};
