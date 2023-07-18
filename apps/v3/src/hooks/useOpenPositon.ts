import { useToast } from '@qilin/component';
import { BigNumber, ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils.js';
import { useCallback, useMemo, useState } from 'react';
import { erc20ABI, useAccount, useContractRead, useContractWrite } from 'wagmi';

import Assest from '@/abis/Asset.json';

import { useApprove } from './useApprove';
import { usePoolAddress } from './usePoolAddress';
import type { usePoolInfo } from './usePoolInfo';

const abi = new ethers.utils.AbiCoder();

export const useOpenPositon = (
  poolInfo: ReturnType<typeof usePoolInfo>['data'],
  onSuccess: () => void
) => {
  const { showWalletToast, closeWalletToast } = useToast();
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

  const [estPrice, size, slippage, estLiqPrice, isSpringOpen] = useMemo(() => {
    if (!poolInfo) return [undefined, undefined, undefined, undefined];

    let { liquidity } = poolInfo;

    const {
      marginRatio,
      spotPrice,
      // futurePrice,
      assetLevels,
      priceThresholdRatio,
      requestTime,
      lastRebaseTime,
      positionLong,
      positionShort,
    } = poolInfo;

    const timeDiff = requestTime - lastRebaseTime;
    const isDiffLargeThan5Min = timeDiff > 300;

    const position = +margin * +leverage;

    liquidity = liquidity * assetLevels;

    let positionLong_ = positionLong;
    let positionShort_ = positionShort;

    if (direction === '1') {
      positionLong_ = positionLong + position;
    } else {
      positionShort_ = positionShort + position;
    }

    const VY = (liquidity / 2) * spotPrice + positionLong_;
    const VX = liquidity / 2 + positionShort_ / spotPrice;

    const PF = VY / VX;

    // 期现价差
    const d = (2 * (PF - spotPrice)) / (PF + spotPrice);

    // 弹簧是否开启
    const isSpringOpen =
      Math.abs(d) > priceThresholdRatio && !isDiffLargeThan5Min;

    // 估算期货价格
    let estPrice = PF;

    if (isSpringOpen) {
      const PF_ =
        d > 0
          ? ((spotPrice + PF) / 2) * (1 + priceThresholdRatio)
          : ((spotPrice + PF) / 2) * (1 - priceThresholdRatio);

      if (direction === '1') {
        estPrice = Math.max(PF_, PF);
      } else {
        estPrice = Math.min(PF_, PF);
      }
    }

    const size: number = +position / +estPrice;
    // 计算 slippage
    const x = liquidity / 2 + positionShort / spotPrice;
    const y = (liquidity / 2) * spotPrice + positionLong;

    const futurePrice = y / x;

    const slippage = Math.abs((estPrice - futurePrice) / futurePrice) * 100;
    console.log({
      estPrice,
      futurePrice,
      slippage,
    });
    const closeRatio = poolInfo.closeRatio;
    const level = +leverage;
    const estLiqPrice =
      direction === '1'
        ? ((marginRatio + level) * estPrice) / (level * (1 - closeRatio))
        : ((level - marginRatio) * estPrice) / (level * (1 + closeRatio));

    return [estPrice, size, slippage, estLiqPrice, isSpringOpen];
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
      abi.encode(['uint8', 'uint16'], [direction, leverage]),
    ],
  });

  const hanldeOpenPosition = useCallback(async () => {
    showWalletToast({
      title: 'Transaction Confirmation',
      message: 'Please confirm the transaction in your wallet',
      type: 'loading',
    });

    try {
      if (isNeedApprove) {
        await approve?.();
      }
      const res = await writeAsync();
      showWalletToast({
        title: 'Transaction Confirmation',
        message: 'Transaction Pending',
        type: 'loading',
      });
      await res.wait();
      showWalletToast({
        title: 'Transaction Confirmation',
        message: 'Transaction Confirmed',
        type: 'success',
      });
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (e) {
      showWalletToast({
        title: 'Transaction Error',
        message: 'Please try again',
        type: 'error',
      });
    }
    setTimeout(closeWalletToast, 3000);
  }, [
    approve,
    closeWalletToast,
    isNeedApprove,
    onSuccess,
    showWalletToast,
    writeAsync,
  ]);

  return useMemo(() => {
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
      isSpringOpen,
      isNeedApprove,
      hanldeOpenPosition,
    };
  }, [
    direction,
    estLiqPrice,
    estPrice,
    hanldeOpenPosition,
    isNeedApprove,
    leverage,
    margin,
    size,
    isSpringOpen,
    slippage,
  ]);
};
