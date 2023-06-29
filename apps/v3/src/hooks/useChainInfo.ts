import { useSetAtom } from "jotai";
import { useEffect } from "react";

import { chainInfoAtom } from "@/atoms";
import { fetcher } from "@/helper";
import type { ChainInfo } from "@/type";



export const useChainInfo = () => {
    const setChainInfo = useSetAtom(chainInfoAtom);
    useEffect(() => {
      fetcher<{
        chain_list: ChainInfo[];
      }>('/blockInfo', {
        method: 'GET',
      }).then(res => {
        setChainInfo(res.chain_list[0]);
      });
    }, [setChainInfo]);

}