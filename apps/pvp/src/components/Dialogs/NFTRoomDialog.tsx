import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Dialog } from '@qilin/component';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useAtomValue } from 'jotai';
import type { FC, ReactNode } from 'react';

import { NFTIDAtom } from '@/atoms';

const CloseBtn = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;

const NFTContainer = styled.iframe`
  all: unset;
  width: 100%;
  height: 100%;
`;

export const NFTMMainDialog: FC<{ children: ReactNode }> = ({ children }) => {
  const NFTID = useAtomValue(NFTIDAtom);

  console.log(NFTID);

  return (
    <Dialog.Root>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content
          css={css`
            width: 1200px;
            max-width: 1200px;
            height: 772px;
            max-height: 772px;
            padding: 0;
            overflow: hidden;
          `}
        >
          <NFTContainer src={`/nft/${NFTID}`} />
          {/* <Dialog.Title>Create a Betting Room</Dialog.Title> */}
          <Dialog.Close asChild>
            <CloseBtn>
              <Cross2Icon />
            </CloseBtn>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
      {children}
    </Dialog.Root>
  );
};
