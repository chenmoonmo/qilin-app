import styled from '@emotion/styled';
import { Dialog } from '@qilin/component';
import { Cross2Icon } from '@radix-ui/react-icons';
import type { FC, ReactNode } from 'react';

const CreateRoomCloseBtn = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;

type CreateRoomDialogType = {
  defaultOpen?: boolean;
  children: ReactNode;
};

export const CreateRoomDialog: FC<CreateRoomDialogType> = ({
  defaultOpen,
  children,
}) => {
  return (
    <Dialog.Root defaultOpen={defaultOpen}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Create a Betting Room</Dialog.Title>
          <Dialog.Close asChild>
            <CreateRoomCloseBtn>
              <Cross2Icon />
            </CreateRoomCloseBtn>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
      {children}
    </Dialog.Root>
  );
};
