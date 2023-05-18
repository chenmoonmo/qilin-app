import { isAddress } from 'ethers/lib/utils.js';
import { atom, useAtom, useAtomValue } from 'jotai';
import { Address, useBalance } from 'wagmi';

type useSearchTokenProps = {
  type: 'pair' | 'margin';
  // 需要排除的地址
  exclude?: string[];
};

const searchAtom = atom<string>('');

const isTokenAddressAtom = atom(get => isAddress(get(searchAtom)));

export const useSearchToken = (param: useSearchTokenProps) => {
  const [searchInfo, setSearchInfo] = useAtom(searchAtom);
  const isTokenAddress = useAtomValue(isTokenAddressAtom);

  const { data } = useBalance({
    address: searchInfo as Address,
    enabled: isTokenAddress,
  });

  return {
    data,
    searchInfo,
    setSearchInfo,
  };
};
