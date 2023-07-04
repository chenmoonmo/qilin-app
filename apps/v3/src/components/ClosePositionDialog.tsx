import styled from '@emotion/styled';
import { Button, Dialog } from '@qilin/component';
import { formatAmount } from '@qilin/utils';
import { useMemo, useState } from 'react';

import type { usePositions } from '@/hooks';
import { useClosePosition } from '@/hooks/useClosePosition';
import { TextWithDirection } from './TextWithDirection';

type AddLiquidityDialogPropsType = {
  children: React.ReactNode;
  data: ReturnType<typeof usePositions>['data'][number];
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

const SplitLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: #363a45;
  margin: 20px 0;
`;

export const ClosePositionDialog: React.FC<AddLiquidityDialogPropsType> = ({
  children,
  data,
}) => {
  const [open, setOpen] = useState(false);

  const { handleClosePosition } = useClosePosition(data);

  const realizedPNL = useMemo(() => {
    return +data.pnl + +data.funding_fee - +data.service_fee;
  }, [data.funding_fee, data.pnl, data.service_fee]);

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
            Close Position
          </Title>
          <InfoItem>
            <span>Trading Pair</span>
            <span>{data.pool_name}</span>
          </InfoItem>
          <InfoItem>
            <span>Open Price</span>
            <span>
              {formatAmount(data.open_price)} {data.token1Name}
            </span>
          </InfoItem>
          <InfoItem>
            <span>Close Price</span>
            <span>
              {formatAmount(data.open_price)} {data.token1Name}
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
              {/* TODO: 计算 */}
              <TextWithDirection>
                {formatAmount(realizedPNL)} {data.symbol}
              </TextWithDirection>
            </span>
          </InfoItem>
          <SubmitButton onClick={handleClosePosition}>Confirm</SubmitButton>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
