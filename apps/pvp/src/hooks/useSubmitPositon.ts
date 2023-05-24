import { CONTRACTS } from '@/constant';
import { BigNumber, ethers } from 'ethers';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import {
  Address,
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';
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
  // 多或者空
  direction?: 'long' | 'short';
};

const submitFormAtom = atom<SubmitPositionForm>({
  marginAmount: '',
  leverage: '2',
  direction: undefined,
});

export const useSubmitPositon = ({
  poolAddress,
  stakePrice,
  marginTokenInfo,
  marginTokenAddress,
}: useSubmitPositonProps) => {
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

  // const { config, refetch } = usePrepareContractWrite({
  //   address: CONTRACTS.RouterAddress,
  //   abi: Router.abi,
  //   functionName: 'submit',
  //   args: [
  //     poolAddress,
  //     marginAmountToBN,
  //     `${form.direction === 'short' ? '-' : ''}${form.leverage}`,
  //   ],
  //   enabled: !allowance?.lt(marginAmountToBN),
  // });

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

  const submitPosition = async () => {
    // TODO: 处理完成后的情况 数据刷新 和 状态显示
    try {
      if (allowance!.lt(marginAmountToBN)) {
        const res = await approve?.();
        await res?.wait();
        await refetchAllowance?.();
      }
      const res = await submit?.({
        recklesslySetUnpreparedArgs: [
          poolAddress,
          marginAmountToBN,
          `${form.direction === 'short' ? '-' : ''}${form.leverage}`,
        ],
      });
      await res?.wait();
    } catch (e) {}
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
