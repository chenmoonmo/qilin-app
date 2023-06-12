import styled from '@emotion/styled';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { type FC, type PropsWithChildren, useMemo } from 'react';
import { useAccount } from 'wagmi';

import { OwnerIcon } from '@/components';
import { css } from '@emotion/react';

type NFTLayoutProps = PropsWithChildren;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: scroll;
  padding: 10px 20px;
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
  @media (max-width: 500px) {
    padding: 20px;
    filter: none;
    &::after {
      filter: brightness(0.8) blur(5px);
    }
  }
`;

export const Title = styled.h1`
  all: unset;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 18px;
  line-height: 20px;
  @media (max-width: 500px) {
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 12px;
  }
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
  @media (max-width: 500px) {
    padding: 4px 9px;
    font-style: normal;
    font-weight: 500;
    font-size: 10px;
    line-height: 15px;
  }
`;

export const CardHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// mini card 呈现
export const XsCard = styled.div`
  flex: 1;
  display: none;
  flex-direction: column;
  justify-content: flex-end;
  @media (max-width: 500px) {
    display: flex;
  }
`;

export const XsCardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ExternalInfo = styled.div`
  margin-bottom: 12px;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 12px;
`;

export const XsCardStatus = styled.div`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 12px;
  svg {
    width: 6px;
    height: 9px;
    margin-left: 3px;
  }
`;

export const MdCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  @media (max-width: 500px) {
    display: none;
  }
`;

export const Header: FC<{
  title?: ReactNode;
  shortId?: string;
}> = ({ title, shortId }) => {
  const router = useRouter();
  const id = router.query.id as string;
  const { address } = useAccount();
  const shortAddress = useMemo(() => {
    return address ? address?.slice(0, 6) + '...' + address?.slice(-4) : '';
  }, [address]);

  return (
    <CardHeader>
      <Title>
        {title || (
          <>
            <span
              css={css`
                @media (max-width: 500px) {
                  display: none;
                }
              `}
            >
              Trading Room ID ：{shortId}
            </span>
            <span
              css={css`
                display: none;
                @media (max-width: 500px) {
                  display: block;
                }
              `}
            >
              ID ：{shortId}
            </span>
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
  );
};

const Layout: FC<NFTLayoutProps> = ({ children }) => {
  return <Main>{children}</Main>;
};

export default Layout;
