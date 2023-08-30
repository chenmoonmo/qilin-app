'use client';
import styled from '@emotion/styled';
import { Button, useToast } from '@qilin/component';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';

import MockToken from '@/abis/MockToken.json';
import { useContractAddress } from '@/hooks/useContractAddress';

const CButton = styled(Button)`
  flex-direction: column;
  > div:last-of-type {
    line-height: 14px;
    font-weight: 400;
    opacity: 0.6;
    zoom: 0.8;
  }
`;

export const ClaimButton = () => {
  const { address } = useAccount();
  const { testToken } = useContractAddress();

  const { showWalletToast, closeWalletToast } = useToast();

  const { data: mintAlready } = useContractRead({
    address: testToken,
    abi: MockToken.abi,
    functionName: 'mintAlready',
    args: [address],
    enabled: !!address,
  });

  const { data: config } = usePrepareContractWrite({
    address: testToken,
    abi: MockToken.abi,
    functionName: 'mintTest',
    enabled: !!address && !mintAlready,
  });

  const { writeAsync: mintTest } = useContractWrite(config);

  const handleClaim = async () => {
    showWalletToast({
      title: 'Transaction Confirmation',
      message: 'Please confirm the transaction in your wallet',
      type: 'loading',
    });
    try {
      const res = await mintTest?.();
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
      setTimeout(closeWalletToast, 2000);
    } catch (e) {
      showWalletToast({
        title: 'Transaction Error',
        message: 'Please try again',
        type: 'error',
      });
      setTimeout(closeWalletToast, 2000);
    }
  };

  return (
    <CButton disabled={!address || !!mintAlready} onClick={handleClaim}>
      <div>Claim</div>
      <div>10000 qiqi/account</div>
    </CButton>
  );
};

ClaimButton.displayName = 'ClaimButton';
