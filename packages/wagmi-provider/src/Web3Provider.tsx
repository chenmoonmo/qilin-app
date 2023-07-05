'use client';
import type { FC } from 'react';
import React, { memo, useEffect } from 'react';
import type { Chain } from 'wagmi';
import { WagmiConfig } from 'wagmi';

import type { ConnectorNameType } from './createClient';
import { createClient } from './createClient';

type Web3ProviderProps<TChain extends Chain = Chain> = {
  defaultChains: TChain[];
  connectorNames: ConnectorNameType[];
  children?: React.ReactNode;
};

const Web3Provider: FC<Web3ProviderProps> = ({
  defaultChains,
  connectorNames,
  children,
}) => {
  const [client, setClient] = React.useState<any | null>(null);

  useEffect(() => {
    createClient(defaultChains, connectorNames).then(client => {
      setClient(client);
    });
  }, []);

  if (!client) {
    return null;
  }
  return <WagmiConfig client={client}>{children}</WagmiConfig>;
};

export default memo(Web3Provider);
