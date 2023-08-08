import styled from '@emotion/styled';
import { Button, Dialog } from '@qilin/component';
import { formatAmount, formatPrice } from '@qilin/utils';
import { useMemo, useState } from 'react';

import type { usePositions } from '@/hooks';
import { useClosePosition } from '@/hooks/useClosePosition';
import { useLiquidity } from '@/hooks/useLiquidity';

import { TextWithDirection } from './TextWithDirection';

type AddLiquidityDialogPropsType = {
  children: React.ReactNode;
  data: ReturnType<typeof usePositions>['data'][number];
  onSuccess: () => void;
};

const Content = styled(Dialog.Content)`
  border-radius: 10px;
  border: 2px solid #323640;
  background: #262930;
  overscroll-behavior: contain;
`;

const Title = styled(Dialog.Title)`
  display: flex;
  align-items: center;
  margin-bottom: 28px;
  svg {
    width: 10px;
    height: 16px;
    margin-right: 10px;
    cursor: pointer;
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  height: 40px;
  margin-top: 6px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  > span:first-of-type {
    color: #737884;
  }
  &:not(:first-of-type) {
    margin-top: 9px;
  }
`;

const SplitLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: #363a45;
  margin: 20px 0;
`;

const Note = styled.div`
  margin-top: 22px;
  color: #737884;
  font-family: Poppins;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
`;

export const ClosePositionDialog: React.FC<AddLiquidityDialogPropsType> = ({
  children,
  data,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);

  const { positionValue, handleClosePosition } = useClosePosition({
    enabled: open,
    data,
    onSuccess,
  });

  const { handleLiquidate } = useLiquidity({
    assetAddress: data.assetAddress,
    onSuccess,
  });

  const realizedPNL = useMemo(() => {
    return +data.pnl + +data.fundingFee - +data.serviceFee;
  }, [data.fundingFee, data.pnl, data.serviceFee]);

  const warning = useMemo(() => {
    if (positionValue?.marginExist) {
      return 'Warning:Insufficient liquidity pool for full redemption. Confirm to proceed.';
    }
    if (positionValue?.limited) {
      return "Warning: Price difference between spot and futures markets too large. Can't proceed.";
    }
    return undefined;
  }, [positionValue?.limited, positionValue?.marginExist]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Content>
          <Dialog.Close asChild>
            <Dialog.CloseIcon />
          </Dialog.Close>
          <Title>Close Position</Title>
          <InfoItem>
            <span>Trading Pair</span>
            <span>{data.pool_name}</span>
          </InfoItem>
          <InfoItem>
            <span>Open Price</span>
            <span>
              {formatPrice(data.openPrice)} {data.token1Symbol}
            </span>
          </InfoItem>
          <InfoItem>
            <span>Close Price</span>
            <span>
              {formatPrice(positionValue?.closePrice)} {data.token1Symbol}
            </span>
          </InfoItem>
          <InfoItem>
            <span>Size</span>
            <span>{formatAmount(data.size)}</span>
          </InfoItem>
          <SplitLine />
          <InfoItem>
            <span>Realized PNL</span>
            <span>
              <TextWithDirection>
                {formatAmount(realizedPNL)} {data.symbol}
              </TextWithDirection>
            </span>
          </InfoItem>
          <Note>{warning}</Note>
          <SubmitButton
            disabled={positionValue?.limited}
            backgroundColor={positionValue?.marginExist ? '#FF3B30' : '#2e71ff'}
            onClick={() => {
              if (data.needLiquidation) {
                handleLiquidate(data.positionId);
              } else {
                handleClosePosition();
              }
              setOpen(false);
            }}
          >
            {positionValue?.marginExist ? 'Confirm Anyway' : 'Confirm'}
          </SubmitButton>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
