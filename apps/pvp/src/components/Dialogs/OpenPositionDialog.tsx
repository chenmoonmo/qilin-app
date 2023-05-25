import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Dialog, Tooltip } from '@qilin/component';
import { atom, useAtom } from 'jotai';
import type { FC, ReactNode } from 'react';

import type { SubmitPositionForm } from '@/hooks/useSubmitPositon';

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
  span {
    &[data-level] {
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
    &[data-type='long'] {
      &::after {
        background: #44c27f;
      }
    }
    &[data-type='short'] {
      &::after {
        background: #e15c48;
      }
    }
  }
`;
type OpenPositionDialogPropsType = {
  children?: ReactNode;
  poolInfo?: any;
  stakePrice: number;
  mergePositions?: any;
  form: SubmitPositionForm;
  lpPrice?: string;
  value?: string;
  onConfirm?: () => void;
};

const openPositionDialogOpenAtom = atom(false);

export const OpenPositionDialog: FC<OpenPositionDialogPropsType> = ({
  poolInfo,
  form,
  lpPrice,
  value,
  stakePrice,
  mergePositions,
  children,
  onConfirm,
}) => {
  const [open, setOpen] = useAtom(openPositionDialogOpenAtom);

  const handleSubmit = async () => {
    await onConfirm?.();
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>
            Open {form.direction?.slice(0, 1).toUpperCase()}
            {form.direction?.slice(1)}
          </Dialog.Title>
          <Dialog.CloseIcon />
          <OpponentInfo
            css={css`
              padding-top: 35px;
              margin-bottom: 27px;
            `}
            long={+(mergePositions?.long?.formattedLp ?? 0)}
            short={+(mergePositions?.short?.formattedLp ?? 0)}
            stakePrice={stakePrice}
            marginTokenSymbol={poolInfo?.pay_token_symbol}
          />
          <OpenPositionInfo>
            <span>Symbol</span>
            <span>{poolInfo?.trade_pair}</span>
          </OpenPositionInfo>
          <OpenPositionInfo>
            <span>Open price</span>
            <span>100.12 USDC</span>
          </OpenPositionInfo>
          <OpenPositionInfo>
            <span>Margin</span>
            <span data-level={`${form.leverage}x`} data-type={form.direction}>
              {form.marginAmount} {poolInfo?.pay_token_symbol}
            </span>
          </OpenPositionInfo>
          <OpenPositionInfo>
            <Tooltip text="111" icon={<FQASvg />}>
              <span>Stake amount</span>
            </Tooltip>
            <span>
              {value} {poolInfo?.pay_token_symbol}
            </span>
          </OpenPositionInfo>
          <OpenPositionInfo>
            <Tooltip text="111" icon={<FQASvg />}>
              <span>Stake price</span>
            </Tooltip>
            <span>
              {lpPrice} {poolInfo?.pay_token_symbol}
            </span>
          </OpenPositionInfo>
          <OpenPositionInfo>
            <span>Value</span>
            <span>
              {value} {poolInfo?.pay_token_symbol}
            </span>
          </OpenPositionInfo>
          <Button
            css={css`
              width: 100%;
              height: 40px;
              margin-top: 37px;
            `}
            onClick={handleSubmit}
          >
            Comfirm
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
      {children}
    </Dialog.Root>
  );
};
