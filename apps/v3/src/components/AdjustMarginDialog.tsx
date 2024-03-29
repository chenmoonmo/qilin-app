import styled from '@emotion/styled';
import { Button, Dialog } from '@qilin/component';
import { formatAmount, formatInput } from '@qilin/utils';
import { useMemo, useState } from 'react';

import type { usePositions } from '@/hooks';
import { useAdjustPosition } from '@/hooks';

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

const MarginInput = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  height: 50px;
  margin: 12px 0 22px;
  border-radius: 6px;
  background: #363a45;
  overflow: hidden;
  input {
    flex: 1;
    padding: 18px 20px;
    color: #737884;
    font-size: 16px;
  }
`;

const MarginSymbol = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 400;
  color: #9699a3;
  background: #2b2f39;
`;

const SubmitButton = styled(Button)`
  width: 100%;
  height: 40px;
  margin-top: 34px;
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

export const AdjustMarginDialog: React.FC<AddLiquidityDialogPropsType> = ({
  children,
  data,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);

  const {
    amount,
    setAmount,
    marginToken,
    isNeedApprove,
    estLiqPrice,
    handleAdjustPosition,
  } = useAdjustPosition(data, onSuccess);

  const currentMargin = useMemo(() => {
    return formatAmount(+data.margin + (amount ? +amount : 0));
  }, [data.margin, amount]);

  const enableSubmit = useMemo(() => {
    return amount && +amount <= +(marginToken?.formatted ?? 0);
  }, [amount, marginToken?.formatted]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Content>
          <Dialog.Close asChild>
            <Dialog.CloseIcon />
          </Dialog.Close>
          <Title>Adjust Margin</Title>
          <InfoItem>
            <span>Balance</span>
            <span>
              {formatAmount(marginToken?.formatted)} {marginToken?.symbol}
            </span>
          </InfoItem>
          <MarginInput>
            <input
              value={amount}
              onChange={e => setAmount(formatInput(e.target.value))}
              type="text"
              placeholder="Margin"
            />
            <MarginSymbol>{marginToken?.symbol}</MarginSymbol>
          </MarginInput>
          <InfoItem>
            <span>Currently Assigned Margin</span>
            <span>
              {currentMargin} {marginToken?.symbol}
            </span>
          </InfoItem>
          <InfoItem>
            <span>Est.Liq.Price after increase</span>
            <span>
              {formatAmount(estLiqPrice)} {marginToken?.symbol}
            </span>
          </InfoItem>
          <SubmitButton
            disabled={!enableSubmit}
            onClick={() => {
              handleAdjustPosition();
              setOpen(false);
            }}
          >
            {isNeedApprove ? 'Approve' : 'Confirm'}
          </SubmitButton>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
