import '@/styles/globals.css';

import Web3Provider from '@qilin/wagmi-provider';
import type { AppProps } from 'next/app';
import { mainnet } from 'wagmi';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3Provider defaultChains={[mainnet]} connectorNames={['MetaMask']}>
      <Component {...pageProps} />
    </Web3Provider>
  );
}
