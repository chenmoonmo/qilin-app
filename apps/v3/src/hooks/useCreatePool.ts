import { useToast } from '@qilin/component';
import { BigNumber, Contract } from 'ethers';
import { parseUnits } from 'ethers/lib/utils.js';
import { useCallback, useMemo } from 'react';
import type { Address } from 'wagmi';
import {
  erc20ABI,
  useAccount,
  useBalance,
  useChainId,
  useContractWrite,
  useSigner,
} from 'wagmi';

import Asset from '@/abis/Asset.json';
import Factory from '@/abis/Factory.json';
import { fetcher } from '@/helper';
import type { PoolParam } from '@/type';

import { useContractAddress } from './useContractAddress';

type UseCreatePoolProps = {
  tokenAddress?: Address;
  oracleAddress?: Address;
  amount: string;
  onSuccess?: () => void;
};

// fetch 直到成功

const roundFetcher = <T = unknown>(url: string) => {
  return new Promise<T>(resolve => {
    fetcher<T>(url, {
      method: 'GET',
    })
      .then(result => {
        resolve(result);
      })
      .catch(_ => {
        setTimeout(() => {
          resolve(roundFetcher(url));
        }, 2000);
      });
  });
};

export const useCreatePool = ({
  oracleAddress,
  tokenAddress,
  amount,
  onSuccess,
}: UseCreatePoolProps) => {
  const { address } = useAccount();
  const { data: singer } = useSigner();
  const chainId = useChainId();

  const { showWalletToast, closeWalletToast } = useToast();

  const { factory, chainLink } = useContractAddress();

  const { data: marginToken } = useBalance({
    address,
    token: tokenAddress,
  });

  //  带精度的 amount
  const amountWithDecimals = useMemo(() => {
    if (!amount || !marginToken?.decimals) return BigNumber.from(0);
    return BigNumber.from(parseUnits(amount, marginToken.decimals));
  }, [amount, marginToken?.decimals]);

  const { writeAsync } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: factory,
    abi: Factory.abi,
    functionName: 'createPool',
    args: [tokenAddress, oracleAddress, chainLink, false],
  });

  const steps = useMemo(() => {
    return [
      {
        title: 'Create Pool',
        buttonText: 'Create Pool',
        onClick: async () => {},
      },
      {
        title: 'Approve',
        buttonText: 'Approve',
        onClick: async () => {
          const { pool_param: poolParam } = await roundFetcher<{
            pool_param: PoolParam;
          }>(
            `/poolFromOracle?chain_id=${chainId}&oracle=${oracleAddress}&token=${tokenAddress}`
          );

          try {
            showWalletToast({
              title: 'Transaction Confirmation',
              message: 'Please confirm the transaction in your wallet',
              type: 'loading',
            });
            const tokenContract = new Contract(
              tokenAddress!,
              erc20ABI,
              singer!
            );

            const allowance = await tokenContract.allowance(
              address,
              poolParam.asset_address
            );

            if (allowance.lt(amountWithDecimals)) {
              const res = await tokenContract.approve(
                poolParam.asset_address,
                '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
              );

              showWalletToast({
                title: 'Transaction Confirmation',
                message: 'Transaction Pending',
                type: 'loading',
              });
              await res?.wait();
            }
          } catch {
            showWalletToast({
              title: 'Transaction Confirmation',
              message: 'Transaction Confirmed',
              type: 'success',
            });
          }
          setTimeout(() => {
            closeWalletToast();
          }, 2000);
        },
      },
      {
        title: 'Add Liquidity',
        buttonText: 'Add Liquidity',
        onClick: async () => {
          const { pool_param: poolParam } = await roundFetcher<{
            pool_param: PoolParam;
          }>(
            `/poolFromOracle?chain_id=${chainId}&oracle=${oracleAddress}&token=${tokenAddress}`
          );

          try {
            const contract = new Contract(
              poolParam.asset_address,
              Asset.abi,
              singer!
            );

            showWalletToast({
              title: 'Transaction Confirmation',
              message: 'Please confirm the transaction in your wallet',
              type: 'loading',
            });

            const res2 = await contract.addLiquidity(address, {
              amount: amountWithDecimals,
              payType: 1,
              payerAddress: address,
            });

            showWalletToast({
              title: 'Transaction Confirmation',
              message: 'Transaction Pending',
              type: 'loading',
            });

            await res2?.wait();
            setTimeout(() => {
              onSuccess?.();
            }, 2000);
            showWalletToast({
              title: 'Transaction Confirmation',
              message: 'Transaction Confirmed',
              type: 'success',
            });
          } catch {
            showWalletToast({
              title: 'Transaction Error',
              message: 'Please try again',
              type: 'error',
            });
          }

          setTimeout(() => {
            closeWalletToast();
          }, 2000);
        },
      },
    ];
  }, [
    address,
    amountWithDecimals,
    chainId,
    closeWalletToast,
    onSuccess,
    oracleAddress,
    showWalletToast,
    singer,
    tokenAddress,
  ]);

  const handleCreatePool = useCallback(async () => {
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
      await res?.wait();
    } catch (e) {
      showWalletToast({
        title: 'Transaction Error',
        message: 'Please try again',
        type: 'error',
      });
    }

    await roundFetcher<{
      pool_param: PoolParam;
    }>(
      `/poolFromOracle?chain_id=${chainId}&oracle=${oracleAddress}&token=${tokenAddress}`
    );

    showWalletToast({
      title: 'Transaction Confirmation',
      message: 'Transaction Confirmed',
      type: 'success',
    });

    setTimeout(() => {
      closeWalletToast();
    }, 2000);
  }, [
    chainId,
    closeWalletToast,
    oracleAddress,
    showWalletToast,
    tokenAddress,
    writeAsync,
  ]);

  // const handleCreatePool = useCallback(async () => {
  //   showWalletToast({
  //     title: 'Transaction Confirmation',
  //     message: 'Please confirm the transaction in your wallet',
  //     type: 'loading',
  //   });
  //   try {
  //     const res = await writeAsync?.();
  //     showWalletToast({
  //       title: 'Transaction Confirmation',
  //       message: 'Transaction Pending',
  //       type: 'loading',
  //     });
  //     await res?.wait();

  //     const { pool_param: poolParam } = await roundFetcher<{
  //       pool_param: PoolParam;
  //     }>(
  //       `/poolFromOracle?chain_id=${chainId}&oracle=${oracleAddress}&token=${tokenAddress}`
  //     );

  //     const tokenContract = new Contract(tokenAddress!, erc20ABI, singer!);

  //     const allowance = await tokenContract.allowance(
  //       address,
  //       poolParam.asset_address
  //     );

  //     if (allowance.lt(amountWithDecimals)) {
  //       const res = await tokenContract.approve(
  //         poolParam.asset_address,
  //         amountWithDecimals
  //       );
  //       await res?.wait();
  //     }

  //     const contract = new Contract(
  //       poolParam.asset_address,
  //       Asset.abi,
  //       singer!
  //     );

  //     const res2 = await contract.addLiquidity(address, {
  //       amount: amountWithDecimals,
  //       payType: 1,
  //       payerAddress: address,
  //     });

  //     await res2?.wait();
  //     showWalletToast({
  //       title: 'Transaction Confirmation',
  //       message: 'Transaction Confirmed',
  //       type: 'success',
  //     });
  //     setTimeout(() => {
  //       onSuccess?.();
  //     }, 2000);
  //   } catch (e) {
  //     showWalletToast({
  //       title: 'Transaction Error',
  //       message: 'Please try again',
  //       type: 'error',
  //     });
  //   }
  //   setTimeout(closeWalletToast, 3000);
  // }, [
  //   address,
  //   amountWithDecimals,
  //   chainId,
  //   closeWalletToast,
  //   onSuccess,
  //   oracleAddress,
  //   showWalletToast,
  //   singer,
  //   tokenAddress,
  //   writeAsync,
  // ]);

  return useMemo(() => {
    return {
      handleCreatePool,
      steps,
    };
  }, [handleCreatePool, steps]);
};
