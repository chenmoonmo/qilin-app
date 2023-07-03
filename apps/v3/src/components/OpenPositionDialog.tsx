import styled from '@emotion/styled';
import { Button, Dialog } from '@qilin/component';
import { formatAmount } from '@qilin/utils';
import { useMemo, useState } from 'react';

type OpenPositionDialogPropsType = {
  children: React.ReactNode;
  direction?: string;
  pairName?: string;
  margin?: string;
  openPrice?: number;
  size?: number;
  estLiqPrice: string;
  token0Name?: string;
  token1Name?: string;
  marginTokenName?: string;
  isNeedApprove?: boolean;
  onConfirm?: () => void;
};

const Content = styled(Dialog.Content)`
  border-radius: 24px;
  border: 2px solid #323640;
  background: #262930;
  z-index: 10;
`;

const Title = styled(Dialog.Title)`
  display: flex;
  align-items: center;
  margin-bottom: 28px;
  svg {
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

const SubmitButton = styled(Button)`
  width: 100%;
  height: 40px;
  margin-top: 34px;
`;

export const OpenPositionDialog = ({
  children,
  pairName,
  margin,
  openPrice,
  size,
  estLiqPrice,
  token0Name,
  token1Name,
  marginTokenName,
  direction,
  onConfirm,
  isNeedApprove,
}: OpenPositionDialogPropsType) => {
  const [open, setOpen] = useState(false);

  const titleText = useMemo(
    () => `Open ${direction === '1' ? 'Long' : 'Short'}`,
    [direction]
  );

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
          <Title>
            <Dialog.Close asChild>
              <svg
                width="12"
                height="18"
                viewBox="0 0 12 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.3162 0L12 1.51539L3.42286 9.10566L11.9883 16.4632L10.3296 18L0 9.12911L10.3162 0Z"
                  fill="white"
                />
              </svg>
            </Dialog.Close>
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
              {formatAmount(openPrice)} {token1Name}
            </span>
          </PositionInfoItem>
          <PositionInfoItem>
            <span>Size</span>
            <span>
              {formatAmount(size)} {token0Name}
            </span>
          </PositionInfoItem>
          <PositionInfoItem>
            <span>Est.Liq.Price</span>
            <span>
              {estLiqPrice} {token1Name}
            </span>
          </PositionInfoItem>
          <SubmitButton onClick={handleConfirm}>
            {isNeedApprove ? 'Approve' : 'Confirm'}
          </SubmitButton>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
