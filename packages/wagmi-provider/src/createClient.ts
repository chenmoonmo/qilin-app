import type { Chain, Connector } from 'wagmi';
import { configureChains, createClient as wagmiCreateClient } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

export type ConnectorNameType =
  | 'MetaMask'
  | 'CoinbaseWallet'
  | 'WalletConnectLegacy'
  | 'Ledger'
  | 'Injected';

export async function createClient<TChain extends Chain = Chain>(
  defaultChains: TChain[],
  connectorNames: ConnectorNameType[],
  autoConnect = true
) {
  const { chains, provider, webSocketProvider } = configureChains(
    defaultChains,
    [publicProvider()]
  );

  const connectorsFactory: Promise<Connector>[] = [];

  connectorNames.forEach(connectorName => {
    if (connectorName === 'MetaMask') {
      connectorsFactory.push(
        import('wagmi/connectors/metaMask').then(({ MetaMaskConnector }) => {
          return new MetaMaskConnector({
            chains,
            options: {
              UNSTABLE_shimOnConnectSelectAccount: true,
            },
          });
        })
      );
    }
    if (connectorName === 'CoinbaseWallet') {
      connectorsFactory.push(
        import('wagmi/connectors/coinbaseWallet').then(
          ({ CoinbaseWalletConnector }) => {
            return new CoinbaseWalletConnector({
              chains,
              options: {
                appName: 'wagmi',
              },
            });
          }
        )
      );
    }
    if (connectorName === 'WalletConnectLegacy') {
      connectorsFactory.push(
        import('wagmi/connectors/walletConnectLegacy').then(
          ({ WalletConnectLegacyConnector }) => {
            return new WalletConnectLegacyConnector({
              chains,
              options: {
                qrcode: true,
              },
            });
          }
        )
      );
    }
    if (connectorName === 'Ledger') {
      connectorsFactory.push(
        import('wagmi/connectors/ledger').then(({ LedgerConnector }) => {
          return new LedgerConnector({
            chains,
          });
        })
      );
    }
    if (connectorName === 'Injected') {
      connectorsFactory.push(
        import('wagmi/connectors/injected').then(({ InjectedConnector }) => {
          return new InjectedConnector({
            chains,
            options: {
              name: detectedName =>
                `Injected (${
                  typeof detectedName === 'string'
                    ? detectedName
                    : detectedName.join(', ')
                })`,
              shimDisconnect: true,
            },
          });
        })
      );
    }
  });

  const connectors = await Promise.all(connectorsFactory);

  const client = wagmiCreateClient({
    autoConnect,
    provider,
    webSocketProvider,
    connectors,
  });

  return client;
}
