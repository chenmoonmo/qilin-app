import styled from '@emotion/styled';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { type FC, type PropsWithChildren, useMemo } from 'react';
import { useAccount } from 'wagmi';

import { OwnerIcon } from '@/components';

type NFTLayoutProps = PropsWithChildren<{
  title?: ReactNode;
}>;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: scroll;
  padding: 10px 20px;
  border: 5px solid #2e71ff;
  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 6px;
    background-image: url('/nft-bg.png');
    background-size: 108% 108%;
    background-repeat: no-repeat;
    background-position: center center;
    filter: brightness(0.32);
    z-index: -2;
  }
`;

export const CardHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.h1`
  all: unset;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 18px;
  line-height: 20px;
`;

export const Owner = styled(Link)`
  width: 20px;
  height: 20px;
  margin-left: 8px;
  cursor: pointer;
  svg {
    transition: fill 0.2s ease-in-out;
    &:hover {
      fill: #2e71ff;
    }
  }
  &[data-active='true'] svg {
    fill: #2e71ff;
  }
`;

export const Address = styled.div`
  padding: 5px 15px;
  border: 1px solid #546293;
  border-radius: 6px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  opacity: 0.5;
`;

const Layout: FC<NFTLayoutProps> = ({ children, title }) => {
  const router = useRouter();
  const { id } = router.query;

  const { address } = useAccount();
  const shortAddress = useMemo(() => {
    return address ? address?.slice(0, 6) + '...' + address?.slice(-4) : '';
  }, [address]);

  return (
    <Main>
      <CardHeader>
        <Title>
          {title || (
            <>
              Trading Room ID ：123
              <Owner
                href={`/player/${id}/white-list`}
                data-active={router.asPath.endsWith('/white-list')}
              >
                <OwnerIcon />
              </Owner>
            </>
          )}
        </Title>
        <Address>{shortAddress}</Address>
      </CardHeader>
      {children}
    </Main>
  );
};

export default Layout;
