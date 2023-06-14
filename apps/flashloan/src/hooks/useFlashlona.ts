import { BigNumber, ethers } from 'ethers';
import { useMemo, useState } from 'react';
import type { Address } from 'wagmi';
import {
  useAccount,
  useBalance,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';

import { useToast } from '@/component';
import { CONTRACTS, TOKENS } from '@/constant';
import MultiNftFlashLoan from '@/constant/abis/MultiNftFlashLoan.json';

import { useApproveTokens } from './useApprove';

export const useFlashlona = () => {
  const { showToast, closeToast } = useToast();
  const { address } = useAccount();

  const [isLoadding, setIsLoadding] = useState(false);

  const { data: supplie, refetch: refetchSupplie } = useBalance({
    token: TOKENS.WETHAToken as Address,
    address,
  });
  const { data: borrow, refetch: refetchBorrow } = useBalance({
    token: TOKENS.USDCVariableDebt as Address,
    address,
  });

  const { isNeedApprove, hanldeApprove } = useApproveTokens({
    WETHAmount: supplie?.value ?? 0,
    USDCAmount: borrow?.value ?? 0,
  });

  const flashLoan = useMemo(() => {
    if (!supplie || !borrow) return null;
    const abi = new ethers.utils.AbiCoder();

    const returnBalance = borrow.value.mul(1000650).div(1000000);
    const debtBalance = borrow.value;
    const aTokenBlance = supplie.value;

    //赎回以后去SWAP
    const swapWithIn = abi.encode(
      ['uint256', 'address', 'address', 'uint24', 'string'],
      [returnBalance, TOKENS.WETH, TOKENS.USDC, 500, 'final']
    );

    const swap = abi.encode(
      ['address', 'address', 'uint256', 'bytes'],
      [address, CONTRACTS.V3SwapNft, 2, swapWithIn]
    );

    //将所有WETH赎回
    const withDrawParam = abi.encode(
      ['address', 'uint256', 'bytes'],
      [TOKENS.WETH, aTokenBlance, swap]
    );

    const withDraw = abi.encode(
      ['address', 'address', 'uint256', 'bytes'],
      [address, CONTRACTS.AaveNext, 2, withDrawParam]
    );

    //还到AAVE上面
    const relayParam = abi.encode(
      ['address', 'uint256', 'uint256', 'bytes'],
      [TOKENS.USDC, debtBalance, 2, withDraw]
    );

    const relay = abi.encode(
      ['address', 'address', 'uint256', 'bytes'],
      [address, CONTRACTS.AaveNext, 1, relayParam]
    );

    //贷款相关
    const flashParam = abi.encode(
      ['address', 'uint256', 'uint256', 'bytes'],
      [CONTRACTS.Pair, 0, debtBalance, relay]
    );

    return abi.encode(
      ['address', 'address', 'uint256', 'bytes'],
      [address, CONTRACTS.V3FlashNft, 1, flashParam]
    );
  }, [supplie, borrow, address]);

  const { config } = usePrepareContractWrite({
    address: CONTRACTS.MultiNftFlashLoan as Address,
    abi: MultiNftFlashLoan.abi,
    functionName: 'action',
    args: [flashLoan],
    overrides: {
      gasPrice: BigNumber.from(8000000000),
      gasLimit: BigNumber.from(8000000),
    },
  });

  const { writeAsync } = useContractWrite(config);

  const handleFlashLoan = async () => {
    setIsLoadding(true);
    try {
      showToast({
        message: 'Pending',
        type: 'loading',
      });
      console.log(config);
      const res = await writeAsync?.();
      const res2 = await res?.wait();
      console.log(res2);
      if (res2?.status === 0) {
        showToast({
          message: 'Operation fail',
          type: 'error',
        });
      } else {
        showToast({
          message: 'Operation success',
          type: 'success',
        });
      }
    } catch (e) {
      console.error(e);
      showToast({
        message: 'Operation fail',
        type: 'error',
      });
    }
    refetchSupplie();
    refetchBorrow();
    setTimeout(() => {
      closeToast();
      setIsLoadding(false);
    }, 3000);
  };

  return {
    isNeedApprove,
    isLoadding,
    supplie,
    borrow,
    hanldeApprove,
    handleFlashLoan,
  };
};
