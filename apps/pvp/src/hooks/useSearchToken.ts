import { isAddress } from 'ethers/lib/utils.js';
import { atom, useAtom, useAtomValue } from 'jotai';

type useSearchTokenProps = {
  type: 'pair' | 'margin';
  // 需要排除的地址
    exclude?: string[];
};

const searchAtom = atom<string>('');

const isTokenAddressAtom = atom(get => isAddress(get(searchAtom)));


const useSearchToken = (param: useSearchTokenProps) => {
  const [searchInfo, set] = useAtom(searchAtom);
  const isTokenAddress = useAtomValue(isTokenAddressAtom);


};
