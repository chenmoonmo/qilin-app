import { useToast } from '@qilin/component';
import { formatUnits } from 'ethers/lib/utils.js';
import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { useAccount, useChainId, useContractWrite } from 'wagmi';

import Asset from '@/abis/Asset.json';
import { fetcher } from '@/helper';
import type { PositionValue } from '@/type';

import type { usePositions } from './usePositions';

export const useClosePosition = ({
  data,
  enabled = false,
  onSuccess,
}: {
  data: ReturnType<typeof usePositions>['data'][number];
  enabled: boolean;
  onSuccess: () => void;
}) => {
  const chainId = useChainId();
  const { showWalletToast, closeWalletToast } = useToast();
  const { address } = useAccount();

  const { data: positionValue } = useSWR(
    enabled
      ? `/positionValue?chain_id=${chainId}&asset_address=${data.asset_address}&pool_address=${data.pool_address}&position_id=${data.position_id}`
      : null,
    async url => {
      const result = await fetcher<{
        position_value: PositionValue;
      }>(url, {
        method: 'GET',
      });
      const { position_value } = result;

      const { close_price } = position_value;
      return {
        ...position_value,
        closePrice: +formatUnits(close_price, 18),
      };
    }
  );

  const { writeAsync } = useContractWrite({
    address: data.asset_address,
    abi: Asset.abi,
    functionName: 'closePosition',
    mode: 'recklesslyUnprepared',
    args: [data.position_id, address],
  });

  const handleClosePosition = useCallback(async () => {
    showWalletToast({
      title: 'Transaction Confirmation',
      message: 'Please confirm the transaction in your wallet',
      type: 'loading',
    });

    try {
      const res = await writeAsync?.();
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
  }, [closeWalletToast, onSuccess, showWalletToast, writeAsync]);

  return useMemo(() => {
    return {
      handleClosePosition,
      positionValue,
    };
  }, [handleClosePosition, positionValue]);
};
