import { css } from '@emotion/react';
import { formatAmount } from '@qilin/utils';
import { useMemo } from 'react';
import { useAccount, useBalance } from 'wagmi';

import { ArrowIcon, FlashIcon } from '@/component';
import {
  AbsoluteArrow,
  ActionButton,
  Address,
  Balacne,
  BottomArea,
  LeftArow,
  Main,
  NFTContain,
  NFTName,
  Roadmap,
} from '@/styles/nft';

const Index = () => {
  const { address, isConnected } = useAccount();

  const shortedAddress =
    address && `${address.slice(0, 6)}...${address.slice(-4)}`;

  const { data: supplie } = useBalance({
    token: '0xBA3a852aDB46C8AD31A03397CD22b2E896625548',
    address,
  });
  const { data: borrow } = useBalance({
    token: '0x853382Ba681B4EF27c10403F736c43f9F558a600',
    address,
  });

  const abledToConfirm = useMemo(() => {
    return supplie?.value.gt(0) && borrow?.value.gt(0);
  }, [supplie, borrow]);

  const button = useMemo(() => {
    if (!isConnected) {
      return <ActionButton>Connect Wallet</ActionButton>;
    } else {
      if (abledToConfirm) {
        return <ActionButton>Confirm</ActionButton>;
      }
      return <ActionButton disabled>Nothing borrowed in AAVE</ActionButton>;
    }
  }, []);

  return (
    <Main>
      {address && <Address>{shortedAddress}</Address>}
      <NFTContain>
        <NFTName>Reclaim collateral without repayment</NFTName>
        <Roadmap>
          <span>
            <FlashIcon />
            (Borrow)
          </span>
          <ArrowIcon />
          <span>
            <strong>AAVE</strong>(Repay)
          </span>
          <ArrowIcon />
          <span>
            <strong>AAVE</strong>(Withdraw)
          </span>
          <span
            css={css`
              grid-column: 2;
            `}
          >
            <FlashIcon />
            (Borrow)
          </span>
          <LeftArow />
          <span>
            <strong>UNI</strong>(Swap)
          </span>
          <AbsoluteArrow />
        </Roadmap>
        <BottomArea>
          <Balacne>
            <span>Your supplie</span>
            <span>
              {formatAmount(supplie?.formatted)} {supplie?.symbol.slice(4)}
            </span>
          </Balacne>
          <Balacne>
            <span>Your borrow</span>
            <span>
              {formatAmount(borrow?.formatted)} {borrow?.symbol.slice(15)}
            </span>
          </Balacne>
          {button}
        </BottomArea>
      </NFTContain>
    </Main>
  );
};

export default Index;
