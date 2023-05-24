import { Provider } from 'jotai';
import type { FC, ReactNode } from 'react';

// import { CONTRACTS } from '@/constant';
// import Dealer from '@/constant/abis/Dealer.json';
import { golbalStore } from '@/atoms';
// import { useAccount, useContractRead } from 'wagmi';
// import { BigNumber } from 'ethers';
type JotaiProviderPropsType = {
  children: ReactNode;
};

const JotaiProvider: FC<JotaiProviderPropsType> = ({ children }) => {
  // const { address } = useAccount();
  // const setDealerId = useSetAtom(dealerIdAtom);
  // // 玩家拥有的 dealer ID
  // const { data: dealerId } = useContractRead({
  //   address: CONTRACTS.DealerAddress,
  //   abi: Dealer.abi,
  //   functionName: 'dealerToId',
  //   args: [address],
  //   onSuccess: (data: BigNumber) => {
  //     setDealerId(data)
  //     // golbalStore.set(dealerIdAtom, data);
  //   },
  // });

  // useEffect(()=>{
  //   setDealerId(dealerId)
  // },[dealerId])

  return <Provider store={golbalStore}>{children}</Provider>;
};

export default JotaiProvider;
