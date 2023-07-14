import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Icon } from '@qilin/component';
import { foramtPrecent, formatAmount, formatPrice } from '@qilin/utils';
import * as Popover from '@radix-ui/react-popover';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { usePoolList } from '@/hooks';

import { NoData } from './NoData';
import { TextWithDirection } from './TextWithDirection';
import { TokenIcon } from './TokenIcon';

type PairSelectorType = {
  children: React.ReactNode;
  value?: string | number;
};

const Content = styled(Popover.Content)`
  width: 420px;
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
  height: 40px;
  padding: 0 12px;
  margin: 12px 12px 0;
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
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  text-align: left;
  thead {
    display: table;
    table-layout: fixed;
    width: 100%;
    color: #9699a3;
    font-size: 12px;
    font-weight: 400;
    tr > th {
      padding: 13px 0;
      &:first-of-type {
        padding-left: 12px;
      }
      &:last-of-type {
        padding-right: 12px;
      }
    }
  }
  tbody {
    display: block;
    height: 248px;
    font-size: 10px;
    font-family: Poppins;
    line-height: 12px;
    overflow-y: auto;
    overscroll-behavior: contain;
    tr {
      display: table;
      table-layout: fixed;
      width: 100%;
      cursor: pointer;
      &:hover,
      &[data-active='true'] {
        background: rgba(54, 58, 69, 0.6);
      }

      > td {
        padding: 7px 0;
        &:first-of-type {
          padding-left: 12px;
        }
        &:last-of-type {
          padding-right: 12px;
        }
      }
    }
  }
`;

const LoadMore = styled.div`
  font-size: 12px;
  color: #2781ff;
  font-weight: 500;
  cursor: pointer;
`;

const PairIcon = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-right: 10px;
  > :nth-of-type(2) {
    margin-left: -10px;
  }
`;

export const PairSelector: React.FC<PairSelectorType> = ({
  children,
  value,
}) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const { data, searchInfo, setSearchInfo, canLoadMore, getNextPage } =
    usePoolList();

  const handleClick = useCallback(
    (assetsAddress: string, poolAddress: string) => {
      router.push(`/?assetAddress=${assetsAddress}&poolAddress=${poolAddress}`);
      setOpen(false);
    },
    [router]
  );

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Trigger asChild>{children}</Trigger>
      <Popover.Portal>
        <Content align="start" sideOffset={10}>
          <SearchInput>
            <Icon.SearchIcon />
            <input
              value={searchInfo}
              onChange={e => setSearchInfo(e.target.value)}
              type="text"
              placeholder="Search name or paste address"
            />
          </SearchInput>
          <TableLayout>
            <thead>
              <tr>
                <th
                  css={css`
                    width: 38%;
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
              {data?.map(pool => {
                return (
                  <tr
                    key={pool.ID}
                    data-active={pool.ID === value}
                    onClick={() =>
                      handleClick(pool.assetAddress, pool.poolAddress)
                    }
                  >
                    <td
                      css={css`
                        width: 38%;
                      `}
                    >
                      <div
                        css={css`
                          display: flex;
                          align-items: center;
                          white-space: nowrap;
                        `}
                      >
                        <PairIcon>
                          <TokenIcon size={24} />
                          <TokenIcon size={24} />
                        </PairIcon>
                        <span>{pool.pairName}</span>
                      </div>
                    </td>
                    <td>{formatPrice(pool.futurePrice)}</td>
                    <td>
                      <TextWithDirection>
                        {foramtPrecent(pool.change)}%
                      </TextWithDirection>
                    </td>
                    <td>
                      <span>{`$${formatAmount(pool.volumn)}`}</span>
                    </td>
                  </tr>
                );
              })}
              {data?.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    <NoData />
                  </td>
                </tr>
              )}
              {canLoadMore && (
                <tr
                  css={css`
                    background: transparent !important;
                  `}
                >
                  <td colSpan={4}>
                    <LoadMore onClick={getNextPage}>View More</LoadMore>
                  </td>
                </tr>
              )}
            </tbody>
          </TableLayout>
        </Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
