import { atom } from 'jotai';

import type { ChainInfo } from '@/type';

export const chainInfoAtom = atom<ChainInfo | null>(null);
