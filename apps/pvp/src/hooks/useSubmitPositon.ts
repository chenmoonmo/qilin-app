import { BigNumber, ethers } from 'ethers';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useMemo } from 'react';

type useSubmitPositonProps = {
  stakePrice: number;
  marginTokenInfo?: {
    value: BigNumber;
    decimals: number;
  };
};

const submitFormAtom = atom<{
  marginAmount?: string;
  leverage?: string;
}>({
  marginAmount: '',
  leverage: '2',
});

export const useSubmitPositon = ({
  stakePrice,
  marginTokenInfo,
}: useSubmitPositonProps) => {
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

  return {
    form,
    setForm,
    stakeAmount,
    enableSubmit: !!(
      form.marginAmount && marginAmountToBN.lte(marginTokenInfo?.value ?? 0)
    ),
  };
};
