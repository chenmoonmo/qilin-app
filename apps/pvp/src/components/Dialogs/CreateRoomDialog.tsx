import { CONTRACTS } from '@/constant';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Dialog, Select, SelectToken } from '@qilin/component';
import { atom, useAtom } from 'jotai';
import type { FC, ReactNode } from 'react';
import { usePrepareContractWrite } from 'wagmi';
import Factory from '@/constant/abis/Factory.json'

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

export const creatRoomOpenAtom = atom(false);

export const CreateRoomDialog: FC<CreateRoomDialogType> = ({
  defaultOpen,
  children,
}) => {
  const [open, setOpen] = useAtom(creatRoomOpenAtom);

  const {config}  = usePrepareContractWrite({
    address: CONTRACTS.FactoryAddress,
    abi: Factory.abi,
    functionName: 'CreatePool',
    args: [
      //pool,
      //payToken,
      //oracle,
      //reverse,
      //typ,
      //id
    ]
  })
  

  return (
    <Dialog.Root defaultOpen={defaultOpen} open={open} onOpenChange={setOpen}>
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
                    symbol: 'USDT',
                    balance: '0',
                  },
                ]}
                value="1111"
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
                    symbol: 'USDT',
                    balance: '0',
                  },
                  {
                    address: '2222',
                    symbol: 'UDT',
                    balance: '0',
                  },
                  {
                    address: '3333',
                    symbol: 'UT',
                    balance: '0',
                  },
                  {
                    address: '3332',
                    symbol: 'U3',
                    balance: '0',
                  },
                  {
                    address: '3432',
                    symbol: 'U33',
                    balance: '0',
                  },
                  {
                    address: '322',
                    symbol: 'U33',
                    balance: '0',
                  },
                ]}
                value="1111"
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
                box-sizing: border-box;
                display: flex;
                width: 100%;
                height: 40px;
                margin: 10px auto 0;
              `}
            >
              Create Room & Mint NFT
            </Button>
          </FormContainer>
          <Dialog.CloseIcon />
        </Dialog.Content>
      </Dialog.Portal>
      {children}
    </Dialog.Root>
  );
};
