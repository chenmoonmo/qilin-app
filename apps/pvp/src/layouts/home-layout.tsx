import { css } from '@emotion/react';
import { Button, Tooltip } from '@qilin/component';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { FC, ReactNode } from 'react';
import { useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { useNetwork } from 'wagmi';
import { useSwitchNetwork } from 'wagmi';

import { Logo, MetaMaskIcon } from '@/components';

import { ChainInfo, Header, MenuItem } from './styles';

type HomeLayoutType = {
  children: ReactNode;
};

const HomeLayout: FC<HomeLayoutType> = ({ children }) => {
  const router = useRouter();
  const { connect, connectors } = useConnect();
  const { chain, chains } = useNetwork();
  const { address, isConnected } = useAccount();
  const { switchNetwork } = useSwitchNetwork();

  const shortAddress = address?.slice(0, 6) + '...' + address?.slice(-4);

  const isErrorNetwork = !chains.find(item => item.id === chain?.id);

  const handleConnect = () => {
    connect({
      connector: connectors[0],
    });
  };

  const handleSwitchNetwork = (id: number) => {
    switchNetwork?.(id);
  };

  useEffect(() => {
    handleConnect();
  }, []);

  return (
    <>
      <Head>
        <title>PIX</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header>
        <div
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          <Logo
            css={css`
              margin-right: 86px;
            `}
          />
          <MenuItem href="/" data-active={router.pathname === '/'}>
            Collections
          </MenuItem>
          {/* TODO: 白名单显示 */}
          <MenuItem href="/mint" data-active={router.pathname === '/mint'}>
            Mint
          </MenuItem>
        </div>
        <div
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          {isConnected ? (
            !isErrorNetwork ? (
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
                  <MetaMaskIcon
                    css={css`
                      position: relative;
                      margin-right: 11px;
                    `}
                  />
                  <Tooltip text={address}>
                    <span>{shortAddress}</span>
                  </Tooltip>
                </div>
              </ChainInfo>
            ) : (
              <Button
                backgroundColor="#e15c48"
                onClick={() => handleSwitchNetwork(chains[0]?.id)}
              >
                Switch Network
              </Button>
            )
          ) : (
            <Button onClick={handleConnect}>Connect Wallet</Button>
          )}
          <ChainInfo
            css={css`
              margin-left: 14px;
            `}
          >
            More
          </ChainInfo>
        </div>
      </Header>
      {children}
      {/* <main></main> */}
    </>
  );
};

export default HomeLayout;
