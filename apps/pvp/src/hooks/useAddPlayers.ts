import { useToast } from '@qilin/component';
import { BigNumber } from 'ethers';
import { isAddress } from 'ethers/lib/utils.js';
import { atom, useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import { CONTRACTS } from '@/constant';
import Dealer from '@/constant/abis/Dealer.json';

import { useDealerId } from './useCreateRoom';

const playerSeatsAtom = atom<string[]>([]);

const seatsAddressValidAtom = atom(get => {
  const seats = get(playerSeatsAtom);
  return (
    seats.every(address => address === '' || isAddress(address)) &&
    seats.filter(address => address !== '').length > 0
  );
});

export const useAddPlayers = (id: number, restSeats: number) => {
  const { showWalletToast, closeWalletToast } = useToast();

  // 玩家地址表单
  const [playerSeats, setSeats] = useAtom(playerSeatsAtom);
  // 输入是否为地址
  const seatsAddressValid = useAtomValue(seatsAddressValidAtom);

  const { dealerId } = useDealerId();

  const { config, isError } = usePrepareContractWrite({
    address: CONTRACTS.DealerAddress,
    abi: Dealer.abi,
    functionName: 'addPlayers',
    args: [dealerId, playerSeats.filter(address => address !== '')],
    enabled: seatsAddressValid,
    overrides: {
      gasLimit: BigNumber.from(3500000),
    },
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
      // refetch();
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
  }, [restSeats, setSeats]);

  return {
    playerSeats,
    setSeats,
    addPlayers,
    enableAdd: restSeats > 0,
    seatsAddressValid: seatsAddressValid && !isError,
  };
};
