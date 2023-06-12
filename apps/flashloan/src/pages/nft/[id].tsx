import { css } from '@emotion/react';
import { formatAmount } from '@qilin/utils';
import { useCallback, useEffect, useMemo } from 'react';
import { useAccount, useConnect } from 'wagmi';

// import { useToast } from '@/component';
import { ArrowIcon, FlashIcon, ToastProvider } from '@/component';
import { useFlashlona, useNFT } from '@/hooks';
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

import type { NextPageWithLayout } from '../_app';

const Index: NextPageWithLayout = () => {
  const { hasNFT } = useNFT();
  const { connect, connectors } = useConnect();
  // const { showToast, closeToast } = useToast();
  const { address, isConnected } = useAccount();

  const shortedAddress =
    address && `${address.slice(0, 6)}...${address.slice(-4)}`;

  const { isNeedApprove, hanldeApprove, handleFlashLoan, supplie, borrow } =
    useFlashlona();

  const abledToConfirm = useMemo(() => {
    return supplie?.value.gt(0) && borrow?.value.gt(0);
  }, [supplie, borrow]);

  const handleConnect = useCallback(() => {
    connect({
      connector: connectors[0],
    });
  }, [connect, connectors]);

  const button = useMemo(() => {
    if (!hasNFT) {
      return <ActionButton disabled>Account lacks current NFT</ActionButton>;
    }
    if (!isConnected) {
      return (
        <ActionButton onClick={handleConnect}>Connect Wallet</ActionButton>
      );
    } else {
      if (isNeedApprove) {
        return <ActionButton onClick={hanldeApprove}>Approve</ActionButton>;
      }
      if (abledToConfirm) {
        return <ActionButton onClick={handleFlashLoan}>Confirm</ActionButton>;
      }
      return <ActionButton disabled>Nothing borrowed in AAVE</ActionButton>;
    }
  }, [
    hasNFT,
    isConnected,
    handleConnect,
    isNeedApprove,
    abledToConfirm,
    hanldeApprove,
    handleFlashLoan,
  ]);

  useEffect(() => {
    (window as any).connectRefetch = () => {
      handleConnect();
    };
  }, [handleConnect]);

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
              {supplie?.value.gt(0) ? (
                <>
                  {formatAmount(supplie?.formatted)} {supplie?.symbol.slice(4)}
                </>
              ) : (
                'Nothing supplied in AAVE'
              )}
            </span>
          </Balacne>
          <Balacne>
            <span>Your borrow</span>
            <span>
              {borrow?.value.gt(0) ? (
                <>
                  {formatAmount(borrow?.formatted)} {borrow?.symbol.slice(15)}
                </>
              ) : (
                'Nothing borrowed in AAVE'
              )}
            </span>
          </Balacne>
          {button}
        </BottomArea>
      </NFTContain>
    </Main>
  );
};

Index.getLayout = page => {
  return <ToastProvider>{page}</ToastProvider>;
};

export default Index;
