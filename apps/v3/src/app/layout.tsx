'use client';
import './globals.css';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Poppins } from 'next/font/google';

import { Header } from '@/components';
import { useChainInfo } from '@/hooks';

import Providers from './providers';

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
        <Providers>
          <Header routes={routes} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
