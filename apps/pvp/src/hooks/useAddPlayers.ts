import { CONTRACTS } from '@/constant';
import Player from '@/constant/abis/Player.json';
import Dealer from '@/constant/abis/Dealer.json';
import { BigNumber } from 'ethers';
import { atom, useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import {
  Address,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi';
import { useDealerId } from './useCreateRoom';
import { isAddress } from 'ethers/lib/utils.js';

const playerSeatsAtom = atom<string[]>([]);

const seatsAddressValidAtom = atom(get => {
  const seats = get(playerSeatsAtom);
  return (
    seats.every(address => address === '' || isAddress(address)) &&
    seats.filter(address => address !== '').length > 0
  );
});

export const useAddPlayers = ({ id }: { id: number }) => {
  const { dealerId } = useDealerId();

  const { data, refetch } = useContractRead({
    address: CONTRACTS.PlayerAddress,
    abi: Player.abi,
    functionName: 'idToAmount',
    args: [id],
  });

  // 剩下可添加的位置
  const restSeats = 6 - (data as BigNumber).toNumber();

  const [playerSeats, setSeats] = useAtom(playerSeatsAtom);
  const seatsAddressValid = useAtomValue(seatsAddressValidAtom);

  const { config, isError } = usePrepareContractWrite({
    address: CONTRACTS.DealerAddress,
    abi: Dealer.abi,
    functionName: 'addPlayers',
    args: [dealerId, playerSeats.filter(address => address !== '')],
    enabled: seatsAddressValid,
    onSuccess: () => {
      refetch();
    },
  });

  const { write: addPlayers } = useContractWrite(config);

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
