// import JotaiProvider from '@/providers/JotaiProvider';
import '@/styles/globals.css';

import { ToastProvider } from '@qilin/component';
import Web3Provider from '@qilin/wagmi-provider';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import { arbitrum } from 'wagmi/chains';

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const EmptyLayout = (page: ReactElement) => page;

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || EmptyLayout;

  return (
    <Web3Provider defaultChains={[arbitrum]} connectorNames={['MetaMask']}>
      <ToastProvider>{getLayout(<Component {...pageProps} />)}</ToastProvider>
    </Web3Provider>
  );
}
