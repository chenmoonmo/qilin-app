import { useToast } from '@qilin/component';
import type { BigNumber } from 'ethers';
import { isAddress } from 'ethers/lib/utils.js';
import { atom, useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';

import { CONTRACTS } from '@/constant';
import Dealer from '@/constant/abis/Dealer.json';
import Player from '@/constant/abis/Player.json';

import { useDealerId } from './useCreateRoom';

const playerSeatsAtom = atom<string[]>([]);

const seatsAddressValidAtom = atom(get => {
  const seats = get(playerSeatsAtom);
  return (
    seats.every(address => address === '' || isAddress(address)) &&
    seats.filter(address => address !== '').length > 0
  );
});

export const useAddPlayers = ({ id }: { id: number }) => {
  const { showWalletToast, closeWalletToast } = useToast();

  // 玩家地址表单
  const [playerSeats, setSeats] = useAtom(playerSeatsAtom);
  // 输入是否为地址
  const seatsAddressValid = useAtomValue(seatsAddressValidAtom);

  const { data:dealerId } = useDealerId();

  // 已经添加的席位
  const { data, refetch } = useContractRead({
    address: CONTRACTS.PlayerAddress,
    abi: Player.abi,
    functionName: 'idToAmount',
    args: [id],
  });

  // 剩下可添加的位置
  const restSeats = data ? 6 - (data as BigNumber).toNumber() : 0;

  const { config, isError } = usePrepareContractWrite({
    address: CONTRACTS.DealerAddress,
    abi: Dealer.abi,
    functionName: 'addPlayers',
    args: [dealerId, playerSeats.filter(address => address !== '')],
    enabled: seatsAddressValid,
  });

  const { writeAsync } = useContractWrite(config);

  const addPlayers = async () => {
    try {
      showWalletToast({
        title: 'Transaction Confirmation',
        message: 'Please confirm the transaction in your wallet',
        type: 'loading',
      });
      const res = await writeAsync?.();
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
      refetch();
    } catch (e) {
      console.error(e);
      showWalletToast({
        title: 'Transaction Error',
        message: 'Please try again',
        type: 'error',
      });
    }
    setTimeout(closeWalletToast, 3000);
  };

  useEffect(() => {
    setSeats(new Array(restSeats).fill(''));
  }, [restSeats]);

  return {
    enableAdd: restSeats > 0,
    playerSeats,
    setSeats,
    addPlayers,
    seatsAddressValid: seatsAddressValid && !isError,
  };
};
