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

  const [margin, setMargin] = useState<string>('');

  const [leverage, setLeverage] = useState<string>('2');

  //  带精度的 margin
  const marginWithDecimals = useMemo(() => {
    if (!margin || !marginTokenDecimals) return BigNumber.from(0);
    return BigNumber.from(parseUnits(margin, marginTokenDecimals));
  }, [margin, marginTokenDecimals]);

  const { long, short } = useMemo(() => {
    const [long, short] = (['1', '2'] as const).map(direction =>
      getOpenPrice(poolInfo, direction, leverage, margin)
    );

    return { long, short };
  }, [leverage, margin, poolInfo]);

  console.log({
    long,
    short,
  });

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
  });

  const hanldeOpenPosition = useCallback(
    async (direction: '1' | '2') => {
      showWalletToast({
        title: 'Transaction Confirmation',
        message: 'Please confirm the transaction in your wallet',
        type: 'loading',
      });

      try {
        if (isNeedApprove) {
          await approve?.();
        }
        const res = await writeAsync({
          recklesslySetUnpreparedArgs: [
            poolAddress,
            {
              amount: marginWithDecimals,
              payerAddress: address,
              payType: 1,
            },
            abi.encode(['uint8', 'uint16'], [direction, leverage]),
          ],
        });
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
    },
    [
      address,
      approve,
      closeWalletToast,
      isNeedApprove,
      leverage,
      marginWithDecimals,
      onSuccess,
      poolAddress,
      showWalletToast,
      writeAsync,
    ]
  );

  return useMemo(() => {
    return {
      margin,
      leverage,
      setLeverage,
      setMargin,
      long,
      short,
      isNeedApprove,
      hanldeOpenPosition,
    };
  }, [hanldeOpenPosition, isNeedApprove, leverage, long, margin, short]);
};

const getOpenPrice = (
  poolInfo: ReturnType<typeof usePoolInfo>['data'],
  direction: '1' | '2',
  leverage: string,
  margin: string
) => {
  if (!poolInfo)
    return {
      estPrice: undefined,
      size: undefined,
      slippage: undefined,
      estLiqPrice: undefined,
      slippageWarning: false,
      limited: false,
    };

  let { liquidity } = poolInfo;

  const {
    marginRatio,
    spotPrice: pc2,
    futurePrice,
    assetLevels,
    priceThresholdRatio,
    requestTime,
    lastRebaseTime,
    positionLong,
    positionShort,
    priceEffectiveTime,
    lastPrice,
  } = poolInfo;

  // 上一次交易的现货价格和预言机价格的差值
  const spotOraclePriceDiff = lastPrice - pc2;
  // 漂移周期
  const driftPeriod = Math.min(
    requestTime - lastRebaseTime,
    priceEffectiveTime
  );

  const spotPrice =
    lastPrice - (spotOraclePriceDiff * driftPeriod) / priceEffectiveTime;

  const position = +margin * +leverage;

  liquidity = liquidity * assetLevels;

  let positionLong_ = positionLong;
  let positionShort_ = positionShort;

  if (direction === '1') {
    positionLong_ = positionLong + position;
  } else {
    positionShort_ = positionShort + position;
  }

  const VY = (liquidity / 2) * spotPrice + positionLong_ * spotPrice;
  const VX = liquidity / 2 + positionShort_;

  const PF = VY / VX;

  let estPrice = PF;
  let limited = false;

  // 价格上边界
  const priceUpperBound = spotPrice * (1 + priceThresholdRatio);
  // 价格下边界
  const priceLowerBound = spotPrice * (1 - priceThresholdRatio);

  if (PF > priceUpperBound) {
    // 限制开多，不限制开空
    limited = direction === '1';
  }
  if (PF < priceLowerBound) {
    //限制开空，不限制开多
    limited = direction === '2';
  }

  if (pc2 > spotPrice) {
    // 开多
    estPrice =
      direction === '1' ? Math.max(PF, pc2) : Math.min(PF, priceUpperBound);
  }
  if (pc2 < spotPrice) {
    // 开空
    estPrice =
      direction === '1' ? Math.max(PF, priceLowerBound) : Math.min(PF, pc2);
  }

  console.log({
    direction,
    PF,
    estPrice,
    ps1: lastPrice,
    pc2,
    spotPrice,
    priceUpperBound,
    priceLowerBound,
    isUpper: PF > priceUpperBound,
    isLower: PF < priceLowerBound,
  });

  const size: number = position / estPrice;

  const slippage = ((estPrice - futurePrice) / futurePrice) * 100;
  // 当滑点>3%
  const slippageWarning = Math.abs(slippage) > 3;

  const closeRatio = poolInfo.closeRatio;
  const level = +leverage;
  const estLiqPrice =
    direction === '1'
      ? ((marginRatio + level) * estPrice) / (level * (1 - closeRatio))
      : ((level - marginRatio) * estPrice) / (level * (1 + closeRatio));

  return { estPrice, size, slippage, estLiqPrice, limited, slippageWarning };
};
