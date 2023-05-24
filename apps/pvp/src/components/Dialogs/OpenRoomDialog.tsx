import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, DatePicker, Dialog } from '@qilin/component';
import {
  addHours,
  millisecondsToSeconds,
} from 'date-fns';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { atom, useAtom } from 'jotai';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import type { Address } from 'wagmi';

import { useOpenPosition } from '@/hooks';

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.tz.setDefault('UTC');

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
  enabled: boolean;
};

export const openRoomOpenAtom = atom(false);

export const OpenRoomDialog: FC<OpenRoomDIalogPropsType> = ({
  poolAddress,
  children,
  enabled,
}) => {
  const [open, setOpen] = useAtom(openRoomOpenAtom);

  // 默认时间 当前时间 + 3小时
  const [endTime, setEndTime] = useState(() => {
    const utcOffset = dayjs().utcOffset() / 60;
    return addHours(new Date(), 3 - utcOffset);
  });

  const utcTime = dayjs(endTime).tz('UTC', true).toDate();

  const openPosition = useOpenPosition({
    poolAddress,
    endTime: millisecondsToSeconds(+utcTime),
    enabled,
  });

  // TODO: 合约调用提示
  const handleOpen = async () => {
    await openPosition?.();
    setOpen(false);
  };

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
              onChange={date => setEndTime(date!)}
            />
          </EndTimeContainer>
          <Button
            css={css`
              width: 100%;
              height: 40px;
              margin-top: 94px;
            `}
            onClick={handleOpen}
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
