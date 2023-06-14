import { useToast } from '@qilin/component';
import { BigNumber } from 'ethers';
import { isAddress } from 'ethers/lib/utils.js';
import { gql } from 'graphql-request';
import { atom, useAtom, useAtomValue } from 'jotai';
import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import type { Address } from 'wagmi';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';

import { CONTRACTS } from '@/constant';
import Dealer from '@/constant/abis/Dealer.json';
import { graphFetcher } from '@/hleper';

const DealerContract = {
  address: CONTRACTS.DealerAddress,
  abi: Dealer.abi,
};

const createPoolFormAtom = atom<{
  payToken: Address | undefined;
  oracle: Address | undefined;
  targetToken: Address | undefined;
}>({
  payToken: undefined,
  oracle: undefined,
  targetToken: undefined,
});

const playersAtom = atom(new Array(5).fill(''));

const canSendCreateAtom = atom(get => {
  const form = get(createPoolFormAtom);
  const players = get(playersAtom);
  return (
    !!(form.oracle && form.payToken && form.targetToken) &&
    players.every(address => address === '' || isAddress(address))
  );
});

export const useDealerId = () => {
  const { address } = useAccount();
  const { data: dealerId } = useSWR(
    address ? ['queryDealerId', address.toLowerCase()] : null,
    async ([_, address]) => {
      const res = await graphFetcher<{
        dealers: {
          id: string;
          owner: Address;
        }[];
        players: {
          id: string;
          pool_address: Address;
          user: Address;
        }[];
      }>(
        gql`{
              dealers(where:{owner:"${address}"}){id,owner}
                }
                `
      );
      return res?.dealers?.[0]?.id
        ? BigNumber.from(res?.dealers?.[0]?.id)
        : null;
    }
  );

  const { data: dealerStatus, refetch } = useContractRead({
    ...DealerContract,
    functionName: 'dealerToStatus',
    args: [dealerId],
    enabled: !!dealerId && dealerId?.gt?.(0),
  });

  const canCreateRoom = useMemo(
    () => (dealerStatus as BigNumber)?.eq?.(0),
    [dealerStatus]
  );

  const canOpen = useMemo(
    () => (dealerStatus as BigNumber)?.eq?.(1),
    [dealerStatus]
  );

  const canClose = useMemo(
    () => (dealerStatus as BigNumber)?.eq?.(2),
    [dealerStatus]
  );

  return {
    dealerId,
    canCreateRoom,
    canOpen,
    canClose,
    refetch,
  };
};

export const useCreateRoom = () => {
  const { address } = useAccount();
  const [form, setForm] = useAtom(createPoolFormAtom);
  const [players, setPlayers] = useAtom(playersAtom);
  const canSendCreate = useAtomValue(canSendCreateAtom);
  const { showWalletToast, closeWalletToast } = useToast();

  const { dealerId, canCreateRoom, canOpen, canClose, refetch } = useDealerId();

  // 创建房间
  const { config } = usePrepareContractWrite({
    ...DealerContract,
    functionName: 'createPool',
    args: [
      dealerId,
      form.payToken,
      form.targetToken,
      form.oracle,
      false,
      1,
      BigNumber.from(6),
      [address, ...players.filter(address => isAddress(address))],
    ],
    enabled: !!(
      canCreateRoom &&
      form.payToken &&
      form.oracle &&
      form.targetToken
    ),
    overrides: {
      gasLimit: BigNumber.from(1000000),
    },
  });

  // 设置玩家 mint nft2
  const { writeAsync: createRoomWrite } = useContractWrite(config);

  const createRoom = useCallback(async () => {
    try {
      showWalletToast({
        title: 'Transaction Confirmation',
        message: 'Please confirm the transaction in your wallet',
        type: 'loading',
      });
      const res = await createRoomWrite?.();
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
    } catch (e) {
      console.error(e);
      showWalletToast({
        title: 'Transaction Error',
        message: 'Please try again',
        type: 'error',
      });
    }
    setTimeout(closeWalletToast, 3000);
  }, [closeWalletToast, createRoomWrite, showWalletToast]);

  const mutate = useCallback(() => {
    setPlayers(new Array(5).fill(''));
    setForm({
      payToken: undefined,
      oracle: undefined,
      targetToken: undefined,
    });

    refetch();
  }, [refetch, setForm, setPlayers]);

  return {
    canCreateRoom,
    canOpen,
    canClose,
    form,
    setForm,
    players,
    setPlayers,
    canSendCreate,
    createRoom,
    refetch: mutate,
  };
};
