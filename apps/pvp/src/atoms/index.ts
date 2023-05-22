import { BigNumber } from 'ethers';
import { atom, createStore } from 'jotai';

export * from './home';

export const systemDateAtom = atom(new Date());
export const dealerIdAtom = atom<BigNumber | null>(null);

export const golbalStore = createStore();