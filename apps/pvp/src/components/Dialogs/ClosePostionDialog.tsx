import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Dialog } from '@qilin/component';
import { atom, useAtom } from 'jotai';
import type { FC } from 'react';

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

type ClosePostionDialogPropsType = {};

export const closePostionDialogOpenAtom = atom(false);

export const ClosePostionDialog: FC<ClosePostionDialogPropsType> = () => {
  const [open, setOpen] = useAtom(closePostionDialogOpenAtom);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Close Postion</Dialog.Title>
          <Dialog.CloseIcon />
          <PostionInfoItem>
            <span>Symbol</span>
            <span>ETH / USDC</span>
          </PostionInfoItem>
          <PostionInfoItem>
            <span>Close Price</span>
            <span>199.12 USDC</span>
          </PostionInfoItem>
          <PostionInfoItem>
            <span>Margin</span>
            <span>988.12 USDC</span>
          </PostionInfoItem>
          {/* TODO: 盈亏色值 */}
          <PNLItem>
            <span>Est.PNL</span>
            <span>
              <strong>+456781.23</strong> USDC
            </span>
          </PNLItem>
          <Button
            css={css`
              width: 100%;
              height: 40px;
              margin-top: 94px;
            `}
          >
            Confirm
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
