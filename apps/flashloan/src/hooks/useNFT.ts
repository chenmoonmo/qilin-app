import { useToast } from '@qilin/component';
import type { BigNumber } from 'ethers';
import { useCallback, useMemo } from 'react';
import type { Address } from 'wagmi';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';

import { CONTRACTS } from '@/constant';
import JustNFT from '@/constant/abis/justNFT.json';

const contractInfo = {
  address: CONTRACTS.JustNFT as Address,
  abi: JustNFT.abi,
};

export const useNFT = () => {
  const { address } = useAccount();
  const { showWalletToast, closeWalletToast } = useToast();

  const { data: tokenID, refetch } = useContractRead({
    ...contractInfo,
    functionName: '_userId',
    args: [address],
  });

  console.log('tokenID', tokenID);

  const hasNFT = useMemo(() => {
    return !!tokenID && (tokenID as BigNumber).gt(0);
  }, [tokenID]);

  const { config } = usePrepareContractWrite({
    ...contractInfo,
    functionName: 'mint',
    enabled: !hasNFT,
  });

  const { writeAsync } = useContractWrite(config);

  const mint = useCallback(async () => {
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
      refetch();
    } catch (e) {
      console.error(e);
      showWalletToast({
        title: 'Transaction Error',
        message: 'Please try again',
        type: 'error',
      });
    }
    setTimeout(closeWalletToast, 3000);
  }, [closeWalletToast, showWalletToast, writeAsync, refetch]);

  return {
    hasNFT,
    mint,
  };
};
