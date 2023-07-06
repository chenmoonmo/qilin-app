import { useToast } from '@qilin/component';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils.js';
import { useCallback, useMemo, useState } from 'react';
import { useAccount, useBalance, useContractWrite } from 'wagmi';

import Asset from '@/abis/Asset.json';

import { useApprove } from './useApprove';
import { usePoolInfo } from './usePoolInfo';
import type { usePositions } from './usePositions';

export const useAdjustPosition = (
  data: ReturnType<typeof usePositions>['data'][number],
  onSuccess: () => void
) => {
  const { showWalletToast, closeWalletToast } = useToast();
  const { address } = useAccount();

  const { data: poolInfo } = usePoolInfo(data.asset_address, data.pool_address);

  const [amount, setAmount] = useState('');

  const { data: marginToken } = useBalance({
    token: data.pool_token,
    address,
  });

  const estLiqPrice = useMemo(() => {
    if (!poolInfo) return undefined;
    const { side, margin, leverage, openPrice } = data;
    const { liquidity, positionLong, positionShort, marginRatio } = poolInfo;

    const position = (margin + +amount) * +leverage;

    let x = liquidity / 2;
    let y = x * openPrice + positionLong;
    x = x + positionShort;

    if (side === 'long') {
      y = y + position;
    } else {
      y = y - position;
    }

    const estPrice = y / x;

    const closeRatio = 0.005;

    const level = +leverage;

    const estLiqPrice =
      side === 'long'
        ? ((marginRatio + level) * estPrice) / (level * (1 - closeRatio))
        : ((level - marginRatio) * estPrice) / (level * (1 + closeRatio));

    return estLiqPrice;
  }, [amount, data, poolInfo]);

  const amountWithDecimals = useMemo(() => {
    return amount && marginToken?.decimals
      ? parseUnits(amount, marginToken?.decimals)
      : BigNumber.from(0);
  }, [amount, marginToken?.decimals]);

  const { isNeedApprove, approve } = useApprove(
    data.pool_token,
    data.asset_address,
    amountWithDecimals
  );

  const { writeAsync } = useContractWrite({
    address: data.asset_address,
    abi: Asset.abi,
    functionName: 'addMargin',
    mode: 'recklesslyUnprepared',
    args: [
      data.position_id,
      {
        payType: 1,
        amount,
        payerAddress: address,
      },
    ],
  });

  const handleAdjustPosition = useCallback(async () => {
    showWalletToast({
      title: 'Transaction Confirmation',
      message: 'Please confirm the transaction in your wallet',
      type: 'loading',
    });

    try {
      if (isNeedApprove) {
        await approve();
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
      onSuccess();
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
      amount,
      setAmount,
      estLiqPrice,
      marginToken,
      isNeedApprove,
      handleAdjustPosition,
    };
  }, [amount, estLiqPrice, marginToken, isNeedApprove, handleAdjustPosition]);
};
