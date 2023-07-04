import { BigNumber, ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils.js';
import { useMemo, useState } from 'react';
import { erc20ABI, useAccount, useContractRead, useContractWrite } from 'wagmi';

import Assest from '@/abis/Asset.json';

import { useApprove } from './useApprove';
import { usePoolAddress } from './usePoolAddress';
import type { usePoolInfo } from './usePoolInfo';

const abi = new ethers.utils.AbiCoder();

export const useOpenPositon = (
  poolInfo: ReturnType<typeof usePoolInfo>['data']
) => {
  const { address } = useAccount();

  const [assetAddress, poolAddress] = usePoolAddress();
  const { data: marginTokenDecimals } = useContractRead({
    address: poolInfo?.marginTokenAddress,
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

  const [estPrice, size, slippage, estLiqPrice] = useMemo(() => {
    if (!poolInfo) return [undefined, undefined, undefined,undefined];

    const {
      liquidity,
      futurePrice: price,
      positionLong,
      positionShort,
      marginRatio,
    } = poolInfo;

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
    const slippage = Math.abs((estPrice - price) / price) * 100;
    const closeRatio = 0.005;
    const level = +leverage;
    const estLiqPrice =
      direction === '1'
        ? ((marginRatio + level) * estPrice) / (level * (1 - closeRatio))
        : ((level - marginRatio) * estPrice) / (level * (1 + closeRatio));

    return [estPrice, size, slippage, estLiqPrice];
  }, [direction, leverage, margin, poolInfo]);

  const { isNeedApprove, approve } = useApprove(
    poolInfo?.marginTokenAddress,
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
    estLiqPrice,
    size,
    slippage,
    isNeedApprove,
    hanldeOpenPosition,
  };
};
