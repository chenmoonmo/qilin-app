'use client';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Dialog, Icon } from '@qilin/component';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useAccount, useConnect, useNetwork, useSwitchNetwork } from 'wagmi';

const AccountInfoContainer = styled.div`
  padding: 24px 15px;
  background: #35373e;
  border-radius: 9px;
`;

const Address = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  gap: 23px;
`;
const ActionItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
  color: #b7bbc6;
  span {
    margin-right: 10px;
  }
  a {
    line-height: 0;
  }
  img {
    cursor: pointer;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 13px;
`;

const ChangeButton = styled(Button)`
  border: 1px solid #616570;
  border-radius: 14px;
`;

const Connectors = styled.div`
  margin-top: 32px;
`;

const Connector = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 14px;
  background: #35373e;
  border: 1px solid #464952;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  & + & {
    margin-top: 8px;
  }
  &:hover {
    border: 1px solid #2781ff;
  }
  img {
    width: 18px;
    height: auto;
  }
`;

const ChainInfo = styled.div`
  height: 33px;
  grid-column: 4 / 5;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid #363a45;
  border-radius: 6px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  color: #737884;
  cursor: pointer;
`;

const ConnectIcons: any = {
  MetaMask: '/images/metamask.png',
  WalletConnect: '/images/walletconnect.png',
};

export const AccountInfo = () => {
  const { address, isConnected } = useAccount();
  const { chains, chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const shortAddress = useMemo(
    () => address?.slice(0, 6) + '...' + address?.slice(-4),
    [address]
  );
  const isErrorNetwork = useMemo(
    () => !chains.find(item => item.id === chain?.id),
    [chains, chain]
  );

  const [accountOpen, setAccountOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);

  const { connect, connectors } = useConnect({
    onSuccess: () => {
      setAccountOpen(false);
      setConnectOpen(false);
    },
    onError: () => {
      setConnectOpen(false);
    },
  });

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address!);
  };

  const handleSwitchNetwork = (id: number) => {
    switchNetwork?.(id);
  };

  const handleConnect = useCallback(() => {
    connect({
      connector: connectors[0],
    });
  }, [connect, connectors]);

  useLayoutEffect(() => {
    handleConnect();
  }, [handleConnect]);

  return (
    <>
      <Dialog.Root open={accountOpen} onOpenChange={setAccountOpen}>
        {isConnected ? (
          !isErrorNetwork ? (
            <Dialog.Trigger asChild>
              <ChainInfo>
                <span
                  css={css`
                    position: relative;
                    margin-right: 36px;
                    &::after {
                      content: '';
                      position: absolute;
                      top: 50%;
                      right: -22px;
                      transform: translate(-50%, -50%);
                      width: 1px;
                      height: 16px;
                      background: #363a45;
                    }
                  `}
                >
                  {chain?.name}
                </span>
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                  `}
                >
                  <Icon.MetaMaskIcon
                    css={css`
                      position: relative;
                      margin-right: 11px;
                    `}
                  />
                  <span>{shortAddress}</span>
                </div>
              </ChainInfo>
            </Dialog.Trigger>
          ) : (
            <Button
              css={css`
                height: 33px;
              `}
              backgroundColor="#e15c48"
              onClick={() => handleSwitchNetwork(chains[0]?.id)}
            >
              Switch Network
            </Button>
          )
        ) : (
          <Button onClick={() => setConnectOpen(true)}>Connect Wallet</Button>
        )}
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Title>Account</Dialog.Title>
            <Dialog.Close>
              <Dialog.CloseIcon />
            </Dialog.Close>
            <AccountInfoContainer>
              <Address>{shortAddress}</Address>
              <Actions>
                <ActionItem>
                  <span>Copy Address</span>
                  <Image
                    src="/images/copy.png"
                    width={13.8}
                    height={13.8}
                    alt={''}
                    onClick={handleCopyAddress}
                  />
                </ActionItem>
                <ActionItem>
                  <span>View on Etherscan</span>
                  <Link
                    href={`${chain?.blockExplorers?.default.url}address/${address}`}
                    target="__blank"
                  >
                    <Image
                      src="/images/link-to.png"
                      width={12.3}
                      height={12.3}
                      alt={''}
                    />
                  </Link>
                </ActionItem>
              </Actions>
            </AccountInfoContainer>
            <ButtonContainer>
              <ChangeButton
                backgroundColor="transprent"
                onClick={() => setConnectOpen(true)}
              >
                Change
              </ChangeButton>
            </ButtonContainer>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Dialog.Root open={connectOpen} onOpenChange={setConnectOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            css={css`
              z-index: 101;
            `}
          />
          <Dialog.Content
            css={css`
              z-index: 102;
            `}
          >
            <Dialog.Title>Connect to a wallet</Dialog.Title>
            <Dialog.Close>
              <Dialog.CloseIcon />
            </Dialog.Close>
            <Connectors>
              {connectors.map(connector => {
                return (
                  <Connector
                    key={connector.id}
                    onClick={() => {
                      connect({
                        connector,
                      });
                      setAccountOpen(false);
                      setConnectOpen(false);
                    }}
                  >
                    <span>{connector.name}</span>
                    <Image
                      src={ConnectIcons[connector.name]}
                      width="18"
                      height="16"
                      alt={''}
                    />
                  </Connector>
                );
              })}
            </Connectors>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
