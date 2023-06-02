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
    onSuccess: () => {
      refetch();
    },
  });

  const { writeAsync: approve } = useContractWrite(config);

  return useMemo(() => {
    return {
      isNeedApprove,
      approve,
    };
  }, [isNeedApprove, approve]);
};

export const useApproveTokens = ({
  WETHAmount,
  USDCAmount,
}: {
  WETHAmount: BigNumber | number;
  USDCAmount: BigNumber | number;
}) => {
  // weth代币approve给NftUniV2FlashAndExec
  const { isNeedApprove: isNeedWETHApprove, approve: approveWETH } = useApprove(
    TOKENS.WETH as Address,
    CONTRACTS.NftUniV2FlashAndExec as Address,
    WETHAmount
  );
  //   // USDCVariableDebt代币approve给aaveNext.用于归还自己的贷款代币USDC
  const { isNeedApprove: isNeedUSDCApprove, approve: approveUSDC } = useApprove(
    TOKENS.USDC as Address,
    CONTRACTS.AaveNext as Address,
    USDCAmount
  );

  const hanldeApprove = async () => {
    if (isNeedWETHApprove) {
      await approveWETH?.();
    }
    if (isNeedUSDCApprove) {
      await approveUSDC?.();
    }
  };

  return hanldeApprove;
};
