import { BigNumber, ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils.js';
import { useMemo, useState } from 'react';
import type { Address } from 'wagmi';
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';

import Assest from '@/abis/Asset.json';

import { useApprove } from './useApprove';
import { usePoolAddress } from './usePoolAddress';

const abi = new ethers.utils.AbiCoder();

export const useOpenPositon = ({
  marginTokenAddress,
  liquidity,
  positionLong,
  positionShort,
  price,
}: {
  marginTokenAddress?: Address;
  liquidity?: number;
  positionLong?: number;
  positionShort?: number;
  price?: number;
}) => {
  const { address } = useAccount();
  const [assetAddress, poolAddress] = usePoolAddress();

  const { data: marginTokenDecimals } = useContractRead({
    address: marginTokenAddress,
    abi: erc20ABI,
    functionName: 'decimals',
  });

  // 多空方向
  const [direction, setDirection] = useState('1');

  const [margin, setMargin] = useState<string>('');

  const [leverage, setLeverage] = useState<string>('2');

  //  带精度的 margin
  const marginWithDecimals = useMemo(() => {
    if (!margin || !marginTokenDecimals) return BigNumber.from(0);
    return BigNumber.from(parseUnits(margin, marginTokenDecimals));
  }, [margin, marginTokenDecimals]);

  const [estPrice, size, slippage] = useMemo(() => {
    if (!price || !liquidity || !positionLong || !positionShort)
      return [undefined, undefined, undefined];

    const position = +margin * +leverage;

    let x = liquidity / 2;
    let y = x * price + positionLong;
    x = x + positionShort;

    if (direction === '1') {
      y = y + position;
    } else {
      x = x + position;
    }

    const estPrice = y / x;
    const size: number = +position / +estPrice;
    const slippage = (estPrice - price) / price;
    // const estLipPrice = price * (1 + slippage);

    return [estPrice, size, slippage];
  }, [
    direction,
    leverage,
    liquidity,
    margin,
    positionLong,
    positionShort,
    price,
  ]);

  const { isNeedApprove, approve } = useApprove(
    marginTokenAddress,
    assetAddress,
    marginWithDecimals
  );

  const { writeAsync } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: assetAddress!,
    abi: Assest.abi,
    functionName: 'openPosition',
    args: [
      poolAddress,
      {
        amount: marginWithDecimals,
        payerAddress: address,
        payType: 1,
      },
      abi.encode(['uint8', 'uint16'], [2, 10]),
    ],
    overrides: {
      gasPrice: BigNumber.from(8000000000),
      gasLimit: BigNumber.from(8000000),
    },
  });

  const hanldeOpenPosition = async () => {
    if (isNeedApprove) {
      await approve?.();
    }
    const res = await writeAsync();
    await res.wait();
  };

  return {
    direction,
    margin,
    leverage,
    setDirection,
    setLeverage,
    setMargin,
    estPrice,
    size,
    slippage,
    isNeedApprove,
    hanldeOpenPosition,
  };
};
