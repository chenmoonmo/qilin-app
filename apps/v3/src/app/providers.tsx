'use client';
import { ToastProvider } from '@qilin/component';
import Web3Provider from '@qilin/wagmi-provider';
import { arbitrumGoerli } from 'wagmi/chains';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Web3Provider
      defaultChains={[arbitrumGoerli]}
      connectorNames={['MetaMask', 'WallectConnect']}
    >
      <ToastProvider>{children}</ToastProvider>
    </Web3Provider>
  );
}