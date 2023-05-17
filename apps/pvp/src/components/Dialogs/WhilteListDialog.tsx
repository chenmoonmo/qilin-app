import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Dialog } from '@qilin/component';
import { atom, useAtom } from 'jotai';
import type { FC, ReactNode } from 'react';
import { useMemo } from 'react';

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

const WhilteListInput = styled.div`
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

type WhilteListDialogPropsType = {
  children?: ReactNode;
  type: 'aftercreate' | 'add';
  roomId: string;
};

export const whilteListOpenAtom = atom(false);

export const WhilteListDialog: FC<WhilteListDialogPropsType> = ({
  children,
  type = 'aftercreate',
  roomId,
}) => {
  const [open, setOpen] = useAtom(whilteListOpenAtom);
  const holeLink = location.origin;
  const shortLink = holeLink;
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
          <WhilteListInput>
            <input></input>
          </WhilteListInput>
          <WhilteListInput>
            <input></input>
          </WhilteListInput>
          <WhilteListInput>
            <input></input>
          </WhilteListInput>
          <WhilteListInput>
            <input></input>
          </WhilteListInput>
          <WhilteListInput>
            <input></input>
          </WhilteListInput>
          <WhilteListInput>
            <input></input>
          </WhilteListInput>
          <WhilteListInput>
            <input></input>
          </WhilteListInput>
          <WhilteListInput>
            <input></input>
          </WhilteListInput>
          <Button
            css={css`
              margin-top: 20px;
              box-sizing: border-box;
              width: 100%;
              height: 40px;
            `}
          >
            Confirm
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
    </Dialog.Root>
  );
};
