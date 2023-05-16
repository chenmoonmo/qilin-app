import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Dialog, Select, SelectToken } from '@qilin/component';
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

const FormContainer = styled.div`
  padding: 24px 0 0;
`;

const FromItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  margin-top: 8px;
  &:first-of-type {
    margin-top: 0;
  }
`;

const SeatItem = styled.input`
  display: block;
  width: 264px;
  padding: 10px;
  background: #2f313a;
  border-radius: 6px;
  cursor: not-allowed;
`;

const WhielistContainer = styled.div`
  margin-top: 33px;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  label {
    display: block;
  }
`;

const WhielistItem = styled.div`
  display: block;
  border: 1px solid #363a45;
  border-radius: 6px;
  margin-top: 10px;
  input {
    width: 100%;
    padding: 10px;
  }
`;

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
          <FormContainer>
            <FromItem>
              <label>Pricing Source</label>
              <Select
                disabled
                selections={[{ text: 'Chainlink', value: '1' }]}
                value="Chainlink"
                onChange={() => {}}
                css={css`
                  width: 264px;
                  margin-left: 31px;
                `}
              />
            </FromItem>
            <FromItem>
              <label>Select Pair</label>
              <SelectToken
                selections={[
                  {
                    address: '1111',
                    symbol: 'usdt',
                    balance: '0',
                  },
                ]}
                // value="1"
                onChange={() => {}}
                css={css`
                  width: 264px;
                  margin-left: 31px;
                `}
              />
            </FromItem>
            <FromItem>
              <label>Margin</label>
              <SelectToken
                selections={[
                  {
                    address: '1111',
                    symbol: 'usdt',
                    balance: '0',
                  },
                ]}
                value="1"
                onChange={() => {}}
                css={css`
                  width: 264px;
                  margin-left: 31px;
                `}
              />
            </FromItem>
            <FromItem>
              <label>Number Of Seats </label>
              <SeatItem value={6} disabled></SeatItem>
            </FromItem>
            <WhielistContainer>
              <label>Whitelist</label>
              <WhielistItem>
                <input type="text" />
              </WhielistItem>
              <WhielistItem>
                <input type="text" />
              </WhielistItem>
              <WhielistItem>
                <input type="text" />
              </WhielistItem>
              <WhielistItem>
                <input type="text" />
              </WhielistItem>
              <WhielistItem>
                <input type="text" />
              </WhielistItem>
              <WhielistItem>
                <input type="text" />
              </WhielistItem>
            </WhielistContainer>
            <Button
              css={css`
                display: flex;
                width: 380px;
                height: 40px;
                margin: 10px auto 0;
              `}
            >
              Create Room & Mint NFT
            </Button>
          </FormContainer>
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
