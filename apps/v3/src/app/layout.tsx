'use client';
import './globals.css';

import Web3Provider from '@qilin/wagmi-provider';
import { Poppins } from 'next/font/google';
import { arbitrumGoerli } from 'wagmi/chains';

import { Header } from '@/components';
import { useChainInfo } from '@/hooks';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
});

// export const metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// };

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
        <Web3Provider
          defaultChains={[arbitrumGoerli]}
          connectorNames={['MetaMask']}
        >
          <Header routes={routes} />
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
