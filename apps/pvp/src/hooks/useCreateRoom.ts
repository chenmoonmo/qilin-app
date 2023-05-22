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
import { BigNumber } from 'ethers';

const DealerContract = {
  address: CONTRACTS.DealerAddress,
  abi: Dealer.abi,
};

const createPoolFormAtom = atom({
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
  // 玩家拥有的 dealer ID
  const { data, isLoading } = useContractRead({
    ...DealerContract,
    functionName: 'dealerToId',
    args: [address],
  });
  return {
    dealerId: data as BigNumber,
    isLoading,
  };
};

export const useCreateRoom = () => {
  const { address } = useAccount();
  const [form, setForm] = useAtom(createPoolFormAtom);
  const [players, setPlayers] = useAtom(playersAtom);
  const canSendCreate = useAtomValue(canSendCreateAtom);

  const { dealerId, isLoading: isDealerToIdLoading } = useDealerId();

  //  是否可以创建房间
  const { data: canCreateRoom } = useContractRead({
    ...DealerContract,
    functionName: 'getDealerStatus',
    args: [dealerId],
    enabled:
      !!dealerId && !isDealerToIdLoading && (dealerId as BigNumber).gt(0),
  });

  // 创建房间
  const { config } = usePrepareContractWrite({
    address: CONTRACTS.FactoryAddress,
    abi: Factory.abi,
    functionName: 'createPool',
    args: [dealerId, form.payToken, form.targetToken, form.oracle, false, 1],
    enabled: !!(
      canCreateRoom &&
      form.payToken &&
      form.oracle &&
      form.targetToken
    ),
  });

  // 设置玩家 mint nft2
  const { writeAsync: createRoomWrite } = useContractWrite(config);

  const { config: setPlayersConfig } = usePrepareContractWrite({
    ...DealerContract,
    functionName: 'setPlayers',
    args: [
      dealerId,
      6,
      [address, ...players.filter(address => isAddress(address))],
    ],
    enabled: !!canCreateRoom,
  });

  const { writeAsync: setPlayersWrite } = useContractWrite(setPlayersConfig);

  // TODO: setPlayers 默认填充用户address
  const createRoom = useMemo(() => {
    return async () => {
      await createRoomWrite?.();
      await setPlayersWrite?.();
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
