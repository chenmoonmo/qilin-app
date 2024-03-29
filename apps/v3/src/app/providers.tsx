'use client';
import { ToastProvider } from '@qilin/component';
import Web3Provider from '@qilin/wagmi-provider';
import { arbitrum } from 'wagmi/chains';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Web3Provider
      // defaultChains={[
      //   process.env.NEXT_PUBLIC_DOMAIN_ENV === 'development'
      //     ? arbitrumGoerli
      //     : arbitrum,
      // ]}
      defaultChains={[arbitrum]}
      connectorNames={['MetaMask', 'WallectConnect']}
    >
      <ToastProvider>{children}</ToastProvider>
    </Web3Provider>
  );
}
