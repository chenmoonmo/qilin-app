import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, DatePicker, Dialog } from '@qilin/component';
import { atom, useAtom } from 'jotai';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import {
  addHours,
  getHours,
  getMinutes,
  isBefore,
  millisecondsToSeconds,
} from 'date-fns';
import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Address } from 'wagmi';
import { useOpenPosition } from '@/hooks';

dayjs.extend(utc);

const EndTimeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
`;

const Note = styled.div`
  text-align: center;
  margin-top: 13px;
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  color: #9699a3;
`;

type OpenRoomDIalogPropsType = {
  children: ReactNode;
  poolAddress: Address;
};

export const openRoomOpenAtom = atom(false);

export const OpenRoomDialog: FC<OpenRoomDIalogPropsType> = ({
  poolAddress,
  children,
}) => {
  const [open, setOpen] = useAtom(openRoomOpenAtom);

  // 默认时间 当前时间 + 3小时
  const [endTime, setEndTime] = useState(addHours(new Date(), 1));

  const openPosition = useOpenPosition({
    poolAddress,
    endTime: millisecondsToSeconds(+endTime),
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Open</Dialog.Title>
          <Dialog.CloseIcon />
          {/* date-fns */}
          <EndTimeContainer>
            <span>End Time</span>
            <DatePicker
              editable={true}
              cleanable={false}
              css={css`
                width: 313px;
                height: 40px;
                border-radius: 6px;
              `}
              value={endTime}
              format="yyyy-MM-dd HH:mm"
              shouldDisableDate={date => {
                return isBefore(date, new Date());
              }}
              shouldDisableHour={(hour, date) => {
                return hour < getHours(new Date());
              }}
              shouldDisableMinute={(minute, date) => {
                return minute < getMinutes(new Date());
              }}
              onChange={setEndTime}
            />
          </EndTimeContainer>
          <Button
            css={css`
              width: 100%;
              height: 40px;
              margin-top: 94px;
            `}
            onClick={openPosition}
          >
            Confirm
          </Button>
          <Note>Note:Once confirming, you cannot make any changes.</Note>
        </Dialog.Content>
      </Dialog.Portal>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
    </Dialog.Root>
  );
};