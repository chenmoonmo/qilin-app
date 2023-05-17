import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Dialog, Tooltip } from '@qilin/component';
import { atom, useAtom } from 'jotai';
import type { FC, ReactNode } from 'react';

import { FQASvg } from '../Icons';
import { OpponentInfo } from '../OpponentInfo';

const OpenPositionInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 500;
  color: #737884;
  margin-top: 13px;
  span[data-level] {
    display: flex;
    align-items: center;
    &::after {
      content: attr(data-level);
      display: block;
      padding: 4px 3px;
      margin-left: 5px;
      font-size: 10px;
      line-height: 1;
      font-weight: 400;
      color: #ffffff;
      background: #44c27f;
      border-radius: 2px;
      zoom: 0.83;
    }
  }
`;
type OpenPositionDialogPropsType = {
  children?: ReactNode;
};

const openPositionDialogOpenAtom = atom(false);

export const OpenPositionDialog: FC<OpenPositionDialogPropsType> = ({
  children,
}) => {
  const [open, setOpen] = useAtom(openPositionDialogOpenAtom);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Open Position</Dialog.Title>
          <Dialog.CloseIcon />
          <OpponentInfo
            css={css`
              padding-top: 35px;
              margin-bottom: 27px;
            `}
          />
          <OpenPositionInfo>
            <span>Symbol</span>
            <span>ETH/USDC</span>
          </OpenPositionInfo>
          <OpenPositionInfo>
            <span>Open price</span>
            <span>100.12 USDC</span>
          </OpenPositionInfo>
          <OpenPositionInfo>
            <span>Margin</span>
            <span data-level="10x">100.12 USDC</span>
          </OpenPositionInfo>
          <OpenPositionInfo>
            <Tooltip text="111" icon={<FQASvg />}>
              <span>LP amount</span>
            </Tooltip>
            <span>100.12</span>
          </OpenPositionInfo>

          <OpenPositionInfo>
            <Tooltip text="111" icon={<FQASvg />}>
              <span>LP price</span>
            </Tooltip>
            <span>1230 USDC</span>
          </OpenPositionInfo>
          <OpenPositionInfo>
            <span>value</span>
            <span>1230 USDC</span>
          </OpenPositionInfo>
          <Button
            css={css`
              width: 100%;
              height: 40px;
              margin-top: 37px;
            `}
          >
            Comfirm
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
      {children}
    </Dialog.Root>
  );
};
