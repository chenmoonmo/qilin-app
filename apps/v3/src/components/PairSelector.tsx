import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Icon } from '@qilin/component';
import * as Popover from '@radix-ui/react-popover';

import { TokenIcon } from './TokenIcon';

type PairSelectorType = {
  children: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
};

const Content = styled(Popover.Content)`
  width: 420px;
  padding: 12px;
  border-radius: 6px;
  border: 2px solid #363a45;
  background: #1f2127;
`;

const Trigger = styled(Popover.Trigger)`
  svg {
    transform: rotate(0deg);
    transition: all 0.1s ease-out;
  }
  &[data-state='open'] svg {
    transform: rotate(180deg);
  }
`;

const SearchInput = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border-radius: 6px;
  background: #363a45;
  border: 1px solid #363a45;
  input {
    width: 100%;
    padding: 12px 0;
    margin-left: 8px;
    color: #9699a3;
    font-size: 12px;
    font-family: Poppins;
    line-height: 12px;
  }
`;

const TableLayout = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  text-align: left;
  thead {
    display: table;
    /* table-layout: fixed; */
    width: 100%;
    color: #9699a3;
    font-size: 12px;
    font-weight: 400;
    tr > th {
      padding: 13px 0;
    }
  }
  tbody {
    display: block;
    height: 248px;
    font-size: 10px;
    font-family: Poppins;
    line-height: 12px;
    overflow: auto;
    tr {
      display: table;
      width: 100%;
      cursor: pointer;
      &:hover {
        background: rgba(54, 58, 69, 0.3);
        /* TODO: selected */
        /* background: rgba(54, 58, 69, 0.6); */
      }

      > td {
        padding: 7px 0;
      }
    }
  }
`;

const PairIcon = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-right: 10px;
  > :nth-child(2) {
    margin-left: -10px;
  }
`;

export const PairSelector: React.FC<PairSelectorType> = ({ children }) => {
  return (
    <Popover.Root>
      <Trigger asChild>{children}</Trigger>
      <Popover.Portal>
        <Content align="start" sideOffset={10}>
          <SearchInput>
            <Icon.SearchIcon />
            <input type="text" placeholder="Search name or paste address" />
          </SearchInput>
          <TableLayout>
            <thead>
              <tr>
                <th
                  css={css`
                    width: 40%;
                  `}
                >
                  Trading Pair
                </th>
                <th>Price</th>
                <th>24h Change</th>
                <th>24h Vol</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  css={css`
                    width: 40%;
                  `}
                >
                  <div
                    css={css`
                      display: flex;
                      align-items: center;
                    `}
                  >
                    <PairIcon>
                      <TokenIcon size={24}></TokenIcon>
                      <TokenIcon size={24}></TokenIcon>
                    </PairIcon>
                    <span>WAGMI/ETH</span>
                  </div>
                </td>
                <td>0.</td>
                <td>0.</td>
                <td>0.</td>
              </tr>
              <tr>
                <td
                  css={css`
                    width: 40%;
                  `}
                >
                  <div
                    css={css`
                      display: flex;
                      align-items: center;
                    `}
                  >
                    <PairIcon>
                      <TokenIcon size={24}></TokenIcon>
                      <TokenIcon size={24}></TokenIcon>
                    </PairIcon>
                    <span>WAGMI/ETH</span>
                  </div>
                </td>
                <td>0.</td>
                <td>0.</td>
                <td>0.</td>
              </tr>
              <tr>
                <td
                  css={css`
                    width: 40%;
                  `}
                >
                  <div
                    css={css`
                      display: flex;
                      align-items: center;
                    `}
                  >
                    <PairIcon>
                      <TokenIcon size={24}></TokenIcon>
                      <TokenIcon size={24}></TokenIcon>
                    </PairIcon>
                    <span>WAGMI/ETH</span>
                  </div>
                </td>
                <td>0.</td>
                <td>0.</td>
                <td>0.</td>
              </tr>
              <tr>
                <td
                  css={css`
                    width: 40%;
                  `}
                >
                  <div
                    css={css`
                      display: flex;
                      align-items: center;
                    `}
                  >
                    <PairIcon>
                      <TokenIcon size={24}></TokenIcon>
                      <TokenIcon size={24}></TokenIcon>
                    </PairIcon>
                    <span>WAGMI/ETH</span>
                  </div>
                </td>
                <td>0.</td>
                <td>0.</td>
                <td>0.</td>
              </tr>
              <tr>
                <td
                  css={css`
                    width: 40%;
                  `}
                >
                  <div
                    css={css`
                      display: flex;
                      align-items: center;
                    `}
                  >
                    <PairIcon>
                      <TokenIcon size={24}></TokenIcon>
                      <TokenIcon size={24}></TokenIcon>
                    </PairIcon>
                    <span>WAGMI/ETH</span>
                  </div>
                </td>
                <td>0.</td>
                <td>0.</td>
                <td>0.</td>
              </tr>
              <tr>
                <td
                  css={css`
                    width: 40%;
                  `}
                >
                  <div
                    css={css`
                      display: flex;
                      align-items: center;
                    `}
                  >
                    <PairIcon>
                      <TokenIcon size={24}></TokenIcon>
                      <TokenIcon size={24}></TokenIcon>
                    </PairIcon>
                    <span>WAGMI/ETH</span>
                  </div>
                </td>
                <td>0.</td>
                <td>0.</td>
                <td>0.</td>
              </tr>{' '}
              <tr>
                <td
                  css={css`
                    width: 40%;
                  `}
                >
                  <div
                    css={css`
                      display: flex;
                      align-items: center;
                    `}
                  >
                    <PairIcon>
                      <TokenIcon size={24}></TokenIcon>
                      <TokenIcon size={24}></TokenIcon>
                    </PairIcon>
                    <span>WAGMI/ETH</span>
                  </div>
                </td>
                <td>0.</td>
                <td>0.</td>
                <td>0.</td>
              </tr>
              <tr>
                <td
                  css={css`
                    width: 40%;
                  `}
                >
                  <div
                    css={css`
                      display: flex;
                      align-items: center;
                    `}
                  >
                    <PairIcon>
                      <TokenIcon size={24}></TokenIcon>
                      <TokenIcon size={24}></TokenIcon>
                    </PairIcon>
                    <span>WAGMI/ETH</span>
                  </div>
                </td>
                <td>0.</td>
                <td>0.</td>
                <td>0.</td>
              </tr>
              <tr>
                <td
                  css={css`
                    width: 40%;
                  `}
                >
                  <div
                    css={css`
                      display: flex;
                      align-items: center;
                    `}
                  >
                    <PairIcon>
                      <TokenIcon size={24}></TokenIcon>
                      <TokenIcon size={24}></TokenIcon>
                    </PairIcon>
                    <span>WAGMI/ETH</span>
                  </div>
                </td>
                <td>0.</td>
                <td>0.</td>
                <td>0.</td>
              </tr>
            </tbody>
          </TableLayout>
        </Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
