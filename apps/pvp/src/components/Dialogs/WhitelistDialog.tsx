import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Dialog } from '@qilin/component';
import { atom, useAtom } from 'jotai';
import type { FC, ReactNode } from 'react';
import { useMemo } from 'react';

import { useAddPlayers } from '@/hooks';

const Description = styled.div`
  margin-top: 9px;
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  color: #9699a3;
`;

const LinkToCopy = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  padding: 10px;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  background: #2f313a;
  border-radius: 6px;
  span:nth-of-type(1) {
    color: #737884;
  }
`;

const FromLabel = styled.div`
  margin-top: 23px;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
`;

const WhitelistInput = styled.div`
  display: block;
  width: 100%;
  margin-top: 10px;
  font-size: 10px;
  line-height: 12px;
  border: 1px solid #363a45;
  border-radius: 6px;
  input {
    padding: 10px;
    width: 100%;
  }
`;

type WhitelistDialogPropsType = {
  children?: ReactNode;
  roomId: number;
  type?: 'aftercreate' | 'add';
};

export const WhitelistOpenAtom = atom(false);

export const WhitelistDialog: FC<WhitelistDialogPropsType> = ({
  children,
  type = 'aftercreate',
  roomId,
}) => {
  const [open, setOpen] = useAtom(WhitelistOpenAtom);

  const title = useMemo(() => {
    return type === 'add' ? (
      <Dialog.Title>Share ID or link for friends to joins!</Dialog.Title>
    ) : (
      <>
        <Dialog.Title>Successfully created betting room!</Dialog.Title>
        <Dialog.Title>Share ID or link for friends to join!</Dialog.Title>
      </>
    );
  }, [type]);

  const { addPlayers, seatsAddressValid, playerSeats, setSeats } =
    useAddPlayers({
      id: roomId,
    });

  const handleAdd = async () => {
    await addPlayers();
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          {title}
          <Dialog.CloseIcon />
          <Description>Only whitelist can join betting. </Description>
          <LinkToCopy>
            <span>Link</span>
            <span>https：//ahjkasdjk...12312412</span>
          </LinkToCopy>
          <FromLabel>Whitelist</FromLabel>
          {playerSeats.map((item, index) => {
            return (
              <WhitelistInput key={index}>
                <input
                  value={item}
                  onChange={e => {
                    setSeats(pre => {
                      return [
                        ...pre.slice(0, index),
                        e.target.value,
                        ...pre.slice(index + 1),
                      ];
                    });
                  }}
                />
              </WhitelistInput>
            );
          })}
          <Button
            css={css`
              margin-top: 20px;
              box-sizing: border-box;
              width: 100%;
              height: 40px;
            `}
            disabled={!seatsAddressValid}
            onClick={handleAdd}
          >
            Confirm
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
    </Dialog.Root>
  );
};
