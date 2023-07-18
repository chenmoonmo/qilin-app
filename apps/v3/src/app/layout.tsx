'use client';
import './globals.css';

import { ToastProvider } from '@qilin/component';
import Web3Provider from '@qilin/wagmi-provider';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Poppins } from 'next/font/google';
import { arbitrumGoerli } from 'wagmi/chains';

import { Header } from '@/components';
import { useChainInfo } from '@/hooks';

dayjs.extend(duration);

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
});

const routes = [
  {
    path: '/',
    name: 'Trade',
  },
  {
    path: '/pool',
    name: 'Pool',
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useChainInfo();

  return (
    <html lang="en">
      <body className={poppins.className}>
        <head>
          <title>QILIN V3 interface</title>
        </head>
        <Web3Provider
          defaultChains={[arbitrumGoerli]}
          connectorNames={['MetaMask', 'WallectConnect']}
        >
          <ToastProvider>
            <Header routes={routes} />
            {children}
          </ToastProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
