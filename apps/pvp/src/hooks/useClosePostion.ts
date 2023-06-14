import { useToast } from '@qilin/component';
import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import type { Address } from 'wagmi';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';

import { CONTRACTS } from '@/constant';
import Router from '@/constant/abis/Router.json';

type ClosePostionPropsType = {
  position: any;
  poolAddress: Address;
};

export const useClosePostion = ({
  position,
  poolAddress,
}: ClosePostionPropsType) => {
  const { showWalletToast, closeWalletToast } = useToast();

  const { address } = useAccount();

  const isNeedLiquidate = position?.ROE / 100 <= -0.8;

  const { config } = usePrepareContractWrite({
    address: CONTRACTS.RouterAddress,
    abi: Router.abi,
    functionName: isNeedLiquidate ? 'liquidate' : 'close',
    args: [poolAddress, position?.index, address],
    overrides: {
      gasLimit: BigNumber.from(3500000),
    },
  });

  const { writeAsync } = useContractWrite(config);

  const closePostion = useCallback(async () => {
    try {
      showWalletToast({
        title: 'Transaction Confirmation',
        message: 'Please confirm the transaction in your wallet',
        type: 'loading',
      });
      const res = await writeAsync?.();
      showWalletToast({
        title: 'Transaction Confirmation',
        message: 'Transaction Pending',
        type: 'loading',
      });
      await res?.wait();
      showWalletToast({
        title: 'Transaction Confirmation',
        message: 'Transaction Confirmed',
        type: 'success',
      });
    } catch (e) {
      console.error(e);
      showWalletToast({
        title: 'Transaction Error',
        message: 'Please try again',
        type: 'error',
      });
    }
    setTimeout(closeWalletToast, 3000);
  }, [writeAsync]);

  return {
    closePostion,
    isNeedLiquidate,
  };
};
