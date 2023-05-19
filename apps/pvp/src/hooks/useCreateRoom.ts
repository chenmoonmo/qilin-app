import { CONTRACTS } from '@/constant';
import {
  useAccount,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
} from 'wagmi';

import Dealer from '@/constant/abis/Dealer.json';
import Factory from '@/constant/abis/Factory.json';
import { atom, useAtom, useAtomValue } from 'jotai';
import { isAddress } from 'ethers/lib/utils.js';
import { useMemo } from 'react';

const DealerContract = {
  address: CONTRACTS.DealerAddress,
  abi: Dealer.abi,
};

const createPoolFormAtom = atom({
  payToken: undefined,
  oracle: undefined,
});

const playersAtom = atom(new Array(5).fill(''));

const canSendCreateAtom = atom(get => {
  const form = get(createPoolFormAtom);
  const players = get(playersAtom);
  return (
    !!(form.oracle && form.payToken) &&
    players.every(address => address === '' || isAddress(address))
  );
});

export const useCreateRoom = () => {
  const { address } = useAccount();
  const [form, setForm] = useAtom(createPoolFormAtom);
  const [players, setPlayers] = useAtom(playersAtom);
  const canSendCreate = useAtomValue(canSendCreateAtom);

  // 玩家拥有的 dealer ID
  const { data: dealerToId, isLoading: isDealerToIdLoading } = useContractRead({
    ...DealerContract,
    functionName: 'dealerToId',
    args: [address],
  });

  const { data: canCreateRoom } = useContractRead({
    ...DealerContract,
    functionName: 'getDealerStatus',
    args: [dealerToId],
    enabled: !!dealerToId && !isDealerToIdLoading,
  });

  const { config } = usePrepareContractWrite({
    address: CONTRACTS.FactoryAddress,
    abi: Factory.abi,
    functionName: 'createPool',
    args: [dealerToId, form.payToken, form.oracle, false, 1],
    enabled: !!(canCreateRoom && form.payToken && form.oracle),
  });

  const { write: createRoomWrite } = useContractWrite(config);

  const { config: setPlayersConfig } = usePrepareContractWrite({
    ...DealerContract,
    functionName: 'setPlayers',
    args: [
      dealerToId,
      6,
      [address, ...players.filter(address => isAddress(address))],
    ],
  });

  const { write: setPlayersWrite } = useContractWrite(setPlayersConfig);

  // TODO: setPlayers 默认填充用户address
  const createRoom = useMemo(() => {
    return async () => {
      createRoomWrite?.();
      setPlayersWrite?.();
    };
  }, [createRoomWrite, setPlayersWrite]);

  return {
    canCreateRoom,
    form,
    setForm,
    players,
    setPlayers,
    canSendCreate,
    createRoom,
  };
};
