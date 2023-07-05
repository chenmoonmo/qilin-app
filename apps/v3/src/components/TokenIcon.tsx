import styled from '@emotion/styled';
import * as Avatar from '@radix-ui/react-avatar';
import { useMemo } from 'react';
import type { Address } from 'wagmi';

type TokenIconProps = {
  token?: Address;
  src?: string;
  size?: number;
};

const Root = styled(Avatar.Root)<{
  children: React.ReactNode;
  size: number;
}>`
  display: block;
  --size: ${p => p.size}px;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
`;

const Image = styled(Avatar.Image)`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const Fallback = styled(Avatar.Fallback)`
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: url('/images/default.png');
  background-size: cover;
  background-position: center;
`;

export const TokenIcon: React.FC<TokenIconProps> = ({
  token,
  src,
  size = 24,
}) => {
  const tokenImage = useMemo(() => {
    if (src) return src;
    if (token)
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${token}/logo.png`;
  }, [token, src]);

  return (
    <Root size={size}>
      <Image src={tokenImage} alt={token} />
      <Fallback />
    </Root>
  );
};
