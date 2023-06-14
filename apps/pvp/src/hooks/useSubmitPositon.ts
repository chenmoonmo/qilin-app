import { useToast } from '@qilin/component';
import { BigNumber, ethers } from 'ethers';
import { atom, useAtom } from 'jotai';
import { useMemo } from 'react';
import type { Address } from 'wagmi';
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';

import { CONTRACTS } from '@/constant';
import Router from '@/constant/abis/Router.json';

type useSubmitPositonProps = {
  poolAddress: Address;
  stakePrice: number;
  marginTokenInfo?: {
    value: BigNumber;
    decimals: number;
  };
  marginTokenAddress: Address;
};

export type SubmitPositionForm = {
  // 保证金数量
  marginAmount: string;
  // 杠杆倍数
  leverage: string;
};

const submitFormAtom = atom<SubmitPositionForm>({
  marginAmount: '',
  leverage: '2',
});

export const useSubmitPositon = ({
  poolAddress,
  stakePrice,
  marginTokenInfo,
  marginTokenAddress,
}: useSubmitPositonProps) => {
  const { showWalletToast, closeWalletToast } = useToast();

  const { address } = useAccount();

  const [form, setForm] = useAtom(submitFormAtom);

  const stakeAmount = useMemo(() => {
    const { marginAmount, leverage } = form;
    if (!marginAmount || !leverage) return '';
    return String(+marginAmount * +leverage * stakePrice);
  }, [form, stakePrice]);

  const marginAmountToBN = useMemo(() => {
    return ethers.utils.parseUnits(
      form.marginAmount || '0',
      marginTokenInfo?.decimals
    );
  }, [form, marginTokenInfo]);

  const lpPrice = form.marginAmount ? stakePrice.toString() : undefined;
  const value = stakeAmount ? stakeAmount : undefined;

  const { data: allowance, refetch: refetchAllowance } = useContractRead({
    address: marginTokenAddress,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address!, CONTRACTS.RouterAddress],
  });

  // TODO: 测试这个
  const { writeAsync: submit } = useContractWrite({
    address: CONTRACTS.RouterAddress,
    abi: Router.abi,
    functionName: 'submit',
    mode: 'recklesslyUnprepared',
  });

  const { config: approveConfig } = usePrepareContractWrite({
    address: marginTokenAddress,
    abi: erc20ABI,
    functionName: 'approve',
    args: [CONTRACTS.RouterAddress, BigNumber.from(2).pow(256).sub(1)],
  });

  const { writeAsync: approve } = useContractWrite(approveConfig);

  const submitPosition = async (direction: 'long' | 'short') => {
    // TODO: 处理完成后的情况 数据刷新 和 状态显示
    try {
      showWalletToast({
        title: 'Transaction Confirmation',
        message: 'Please confirm the transaction in your wallet',
        type: 'loading',
      });
      if (allowance!.lt(marginAmountToBN)) {
        const res = await approve?.();
        await res?.wait();
        await refetchAllowance?.();
      }
      console.log([
        poolAddress,
        marginAmountToBN,
        +`${direction === 'short' ? '-' : ''}${form.leverage}`,
      ]);

      const res = await submit?.({
        recklesslySetUnpreparedArgs: [
          poolAddress,
          marginAmountToBN,
          `${direction === 'short' ? '-' : ''}${form.leverage}`,
        ],
      });
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
      setForm({
        marginAmount: '',
        leverage: '2',
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
  };

  return {
    form,
    setForm,
    stakeAmount,
    lpPrice,
    value,
    enableSubmit: !!(
      form.marginAmount && marginAmountToBN.lte(marginTokenInfo?.value ?? 0)
    ),
    submitPosition,
  };
};
