'use client';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button } from '@qilin/component';
import { formatAmount } from '@qilin/utils';
import { useMemo } from 'react';
import { useNetwork } from 'wagmi';

import {
  AddLiquidityDialog,
  PoolTable,
  RemoveLiquidityDialog,
} from '@/components';
import { useMyLiquidity, usePoolList } from '@/hooks';

const Main = styled.main`
  padding: 16px 12.5% 0;
`;

const TableTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
`;

export default function Pool() {
  const { data: poolList } = usePoolList();
  const { data: myLiquidityList } = useMyLiquidity();

  const LiquidityColumns = [
    {
      title: 'Pool',
      key: 'name',
    },
    {
      title: 'Liquidity',
      key: 'liquidity',
      render: (value: any) => {
        return `${formatAmount(value)}`;
      },
    },
    {
      title: 'Share',
      key: 'share',
      render: (value: any) => {
        return `${formatAmount(value, 2)}%`;
      },
    },
    {
      title: 'Rol',
      key: 'roi',
      render: (value: any) => {
        return `${formatAmount(value)}`;
      },
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (_, item: any) => {
        return (
          <>
            <AddLiquidityDialog data={item}>
              <Button>Add</Button>
            </AddLiquidityDialog>
            <RemoveLiquidityDialog data={item}>
              <Button
                backgroundColor="#464A56"
                css={css`
                  margin-left: 6px;
                `}
              >
                Remove
              </Button>
            </RemoveLiquidityDialog>
          </>
        );
      },
    },
  ];

  const poolsColumns = useMemo(() => {
    return [
      {
        title: 'Pool',
        key: 'pairName',
      },
      {
        title: 'Liquidity',
        key: 'liquidity',
        render: (value: any, item: any) =>
          formatAmount(value) + ' ' + item.token0Name,
      },
      {
        title: 'LP Price',
        key: 'futurePrice',
        render: (value: any, item: any) =>
          formatAmount(value) + ' ' + item.token1Name,
      },
      {
        title: 'APY',
        key: 'APY',
      },
      {
        title: 'Operation',
        key: 'Operation',
        render: (_, item: any) => {
          return (
            <AddLiquidityDialog data={item}>
              <Button>Add</Button>
            </AddLiquidityDialog>
          );
        },
      },
    ];
  }, []);

  return (
    <Main>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 11px;
        `}
      >
        <TableTitle>My Liquidity</TableTitle>
        {/* <AddLiquidityDialog> */}
        <Button>New Position </Button>
        {/* </AddLiquidityDialog> */}
      </div>
      <PoolTable columns={LiquidityColumns} dataSource={myLiquidityList} />
      <TableTitle
        css={css`
          margin: 20px 0 17px;
        `}
      >
        Pools
      </TableTitle>
      <PoolTable columns={poolsColumns} dataSource={poolList} />
    </Main>
  );
}
