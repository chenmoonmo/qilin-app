import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Dialog } from '@qilin/component';
import { formatAmount } from '@qilin/utils';
import { atom, useAtom } from 'jotai';
import type { FC, ReactNode } from 'react';
import type { Address } from 'wagmi';

import { useClosePostion } from '@/hooks';

const PostionInfoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  color: #9699a3;
  margin-top: 14px;
  &:first-of-type {
    margin-top: 26px;
  }
`;

const PNLItem = styled(PostionInfoItem)`
  padding-top: 20px;
  margin-top: 24px;
  border-top: 1px solid #363a45;
`;

type ClosePostionDialogPropsType = {
  children?: ReactNode;
  position: any;
  // TODO: poolAddress 也不需要 明确下 position 的类型
  poolAddress: Address;
  onSuccess: () => void;
};

export const closePostionDialogOpenAtom = atom(false);

export const ClosePostionDialog: FC<ClosePostionDialogPropsType> = ({
  children,
  position,
  poolAddress,
  onSuccess,
}) => {
  const { isNeedLiquidate, closePostion } = useClosePostion({
    position,
    poolAddress,
  });

  const [open, setOpen] = useAtom(closePostionDialogOpenAtom);

  const pnl = `${position.estPnl > 0 ? '+' : ''}${position.estPnl}`;

  const handleConfirm = async () => {
    await closePostion?.();
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>
            {isNeedLiquidate ? 'Liquidate' : 'Close Postion'}
          </Dialog.Title>
          <Dialog.CloseIcon />
          <PostionInfoItem>
            <span>Symbol</span>
            <span>{position.tradePair}</span>
          </PostionInfoItem>
          <PostionInfoItem>
            <span>Close Price</span>
            {/* TODO: 单位 */}
            <span>{position.closePrice} </span>
          </PostionInfoItem>
          <PostionInfoItem>
            <span>Margin</span>
            <span>
              {position.fomattedMargin} {position.marginSymbol}
            </span>
          </PostionInfoItem>
          {/* TODO: 盈亏色值 */}
          <PNLItem>
            <span>Est.PNL</span>
            <span>
              <strong>{formatAmount(pnl)}</strong> {position.marginSymbol}
            </span>
          </PNLItem>
          <Button
            css={css`
              width: 100%;
              height: 40px;
              margin-top: 94px;
            `}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
      {children}
    </Dialog.Root>
  );
};
