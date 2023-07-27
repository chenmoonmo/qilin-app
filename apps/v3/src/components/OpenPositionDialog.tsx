import styled from '@emotion/styled';
import { Button, Dialog } from '@qilin/component';
import { formatAmount, formatPrice } from '@qilin/utils';
import { useMemo, useState } from 'react';

type OpenPositionDialogPropsType = {
  children: React.ReactNode;
  direction?: string;
  pairName?: string;
  margin?: string;
  estPrice?: number;
  size?: number;
  slippage?: number;
  estLiqPrice?: number;
  token0Symbol?: string;
  token1Symbol?: string;
  marginTokenName?: string;
  isNeedApprove?: boolean;
  slippageWarning: boolean;
  limited: boolean;
  onConfirm?: () => void;
};

const Content = styled(Dialog.Content)`
  border-radius: 10px;
  border: 2px solid #323640;
  background: #262930;
  z-index: 10;
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

const PositionInfoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  > :first-of-type {
    font-size: 12px;
    font-weight: 400;
    color: #737884;
  }
  > :last-of-type {
    font-size: 12px;
    font-weight: 400;
    color: #9699a3;
  }
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

const SubmitButton = styled(Button)<{
  slippageWarning: boolean;
}>`
  width: 100%;
  height: 40px;
  margin-top: 6px;
  background-color: ${({ slippageWarning }) =>
    slippageWarning ? '#E15C48' : '#0083FF'};
`;

export const OpenPositionDialog = ({
  children,
  pairName,
  margin,
  estPrice,
  size,
  slippage,
  estLiqPrice,
  token0Symbol,
  token1Symbol,
  marginTokenName,
  direction,
  onConfirm,
  slippageWarning,
  limited,
  isNeedApprove,
}: OpenPositionDialogPropsType) => {
  const [open, setOpen] = useState(false);

  const titleText = useMemo(
    () => `Open ${direction === '1' ? 'Long' : 'Short'}`,
    [direction]
  );

  const warningText = useMemo(() => {
    if (limited)
      return "Warning: Price difference between spot and futures markets too large. Can't proceed.";

    if (slippageWarning)
      return `Warning: ${formatAmount(
        slippage,
        2
      )}% price impact on the market price. Continue?`;

    return undefined;
  }, [limited, slippage, slippageWarning]);

  const handleConfirm = () => {
    setOpen(false);
    onConfirm && onConfirm();
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Content>
          <Dialog.Close asChild>
            <Dialog.CloseIcon />
          </Dialog.Close>
          <Title>
            <span>{titleText}</span>
          </Title>
          <PositionInfoItem>
            <span>Trading Pair</span>
            <span>{pairName}</span>
          </PositionInfoItem>
          <PositionInfoItem>
            <span>Margin</span>
            <span>
              {margin} {marginTokenName}
            </span>
          </PositionInfoItem>
          <PositionInfoItem>
            <span>Open Price</span>
            <span>
              {formatPrice(estPrice)} {token1Symbol}
            </span>
          </PositionInfoItem>
          <PositionInfoItem>
            <span>Size</span>
            <span>
              {formatAmount(size)} {token0Symbol}
            </span>
          </PositionInfoItem>
          <PositionInfoItem>
            <span>Est.Liq.Price</span>
            <span>
              {formatAmount(estLiqPrice)} {token1Symbol}
            </span>
          </PositionInfoItem>
          <Note>{warningText}</Note>
          <SubmitButton
            disabled={limited}
            slippageWarning={slippageWarning && !limited}
            onClick={handleConfirm}
          >
            {isNeedApprove ? 'Approve' : 'Confirm'}
            {slippageWarning && !limited && ' Anyway'}
          </SubmitButton>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
