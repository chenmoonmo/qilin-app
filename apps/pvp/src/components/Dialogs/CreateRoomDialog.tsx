import { CONTRACTS } from '@/constant';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Dialog, Select, SelectToken } from '@qilin/component';
import { atom, useAtom } from 'jotai';
import { useState, type FC, type ReactNode, useMemo, useCallback } from 'react';
import { useChainId, useNetwork, usePrepareContractWrite } from 'wagmi';
import Factory from '@/constant/abis/Factory.json';
import { PAIRS, PAY_TOKENS } from '@/constant';
import { useCreateRoom } from '@/hooks';
import { isAddress } from 'ethers/lib/utils.js';

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
  &:focus-within {
    border-color: var(--border-active-color);
  }
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
  const chainId = useChainId();
  const {
    canCreateRoom,
    canSendCreate,
    form,
    setForm,
    createRoom,
    players,
    setPlayers,
  } = useCreateRoom();

  const [searchInfo, setSearchInfo] = useState<string>('');
  const [marginSearchInfo, setMarginSearchInfo] = useState<string>('');
  
  const [open, setOpen] = useAtom(creatRoomOpenAtom);

  const pairFilter = useCallback(
    (item: any) => {
      if (!searchInfo) return true;
      return (
        item.name.includes(searchInfo.toUpperCase()) ||
        (isAddress(searchInfo) && item.oracleAddress.includes(searchInfo))
      );
    },
    [searchInfo]
  );

  const marginFilter = useCallback(
    (item: any) => {
      if (!marginSearchInfo) return true;
      return (
        item.symbol.includes(marginSearchInfo.toUpperCase()) ||
        (isAddress(marginSearchInfo) && item.address.includes(marginSearchInfo))
      );
    },
    [marginSearchInfo]
  );

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
                css={css`
                  width: 264px;
                  margin-left: 31px;
                `}
                selections={PAIRS?.[chainId as keyof typeof PAIRS]}
                valueKey="oracleAddress"
                textKey="name"
                value={form.oracle}
                onChange={selection =>
                  setForm(preForm => ({
                    ...preForm,
                    oracle: selection.oracleAddress,
                  }))
                }
                search={searchInfo}
                onSearchChange={setSearchInfo}
                filter={pairFilter}
              />
            </FromItem>
            <FromItem>
              <label>Margin</label>
              <SelectToken
                css={css`
                  width: 264px;
                  margin-left: 31px;
                `}
                valueKey="address"
                textKey="symbol"
                selections={PAY_TOKENS?.[chainId as keyof typeof PAY_TOKENS]}
                filter={marginFilter}
                value={form.payToken}
                onChange={selection =>
                  setForm(preForm => ({
                    ...preForm,
                    payToken: selection.address,
                  }))
                }
                search={marginSearchInfo}
                onSearchChange={setMarginSearchInfo}
              />
            </FromItem>
            <FromItem>
              <label>Number Of Seats </label>
              <SeatItem value={6} disabled></SeatItem>
            </FromItem>
            <WhielistContainer>
              <label>Whitelist</label>
              {players.map((player, index) => (
                <WhielistItem key={index}>
                  <input
                    type="text"
                    value={player}
                    onChange={e =>
                      setPlayers(prePlayers => {
                        prePlayers[index] = e.target.value;
                        return [...prePlayers];
                      })
                    }
                  />
                </WhielistItem>
              ))}
            </WhielistContainer>
            <Button
              css={css`
                box-sizing: border-box;
                display: flex;
                width: 100%;
                height: 40px;
                margin: 10px auto 0;
              `}
              disabled={!canSendCreate}
              onClick={createRoom}
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
