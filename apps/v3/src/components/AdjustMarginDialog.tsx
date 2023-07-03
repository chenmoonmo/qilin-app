import styled from '@emotion/styled';
import { Button, Dialog } from '@qilin/component';
import { useState } from 'react';

import { useAdjustPosition } from '@/hooks';

type AddLiquidityDialogPropsType = {
  children: React.ReactNode;
};

const Content = styled(Dialog.Content)`
  border-radius: 24px;
  border: 2px solid #323640;
  background: #262930;
  overscroll-behavior: contain;
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
}) => {
  const [open, setOpen] = useState(false);

  useAdjustPosition();

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
            Adjust Margin
          </Title>
          <InfoItem>
            <span>balance</span>
            <span>0.0001 USDT</span>
          </InfoItem>
          <MarginInput>
            <input type="text" placeholder="Margin" />
            <MarginSymbol>USDC</MarginSymbol>
          </MarginInput>
          <InfoItem>
            <span>Currently Assigned Margin</span>
            <span>0.0001 USDT</span>
          </InfoItem>
          <InfoItem>
            <span>Currently Assigned Margin</span>
            <span>0.0001 USDT</span>
          </InfoItem>
          <SubmitButton>Confirm</SubmitButton>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
