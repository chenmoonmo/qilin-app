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
import { usePoolList } from '@/hooks';

const Main = styled.main`
  padding: 16px 12.5% 0;
`;

const TableTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
`;

export default function Pool() {
  const { chain } = useNetwork();
  const { data: poolList } = usePoolList();
  console.log({
    poolList,
  });

  const LiquidityColumns = [
    {
      title: 'Pool',
      key: 'pool',
    },
    {
      title: 'Liquidity',
      key: 'liquidity',
    },
    {
      title: 'Share',
      key: 'share',
    },
    {
      title: 'Rol',
      key: 'rol',
    },
    {
      title: 'Operation',
      key: 'operation',
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
        render: (value: any, item) =>
          formatAmount(value) + ' ' + item.token0Name,
      },
      {
        title: 'LP Price',
        key: 'futurePrice',
        render: (value: any, item) =>
          formatAmount(value) + ' ' + item.token1Name,
      },
      {
        title: 'APY',
        key: 'APY',
      },
      {
        title: 'Operation',
        key: 'Operation',
        render: (value, item) => {
          return (
            <AddLiquidityDialog data={item as any}>
              <Button>Add</Button>
            </AddLiquidityDialog>
          );
        },
      },
    ];
  }, [chain]);

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
      <PoolTable columns={LiquidityColumns} />
      <TableTitle
        css={css`
          margin: 20px 0 17px;
        `}
      >
        Pools
      </TableTitle>
      <PoolTable columns={poolsColumns} dataSource={poolList} />
      <RemoveLiquidityDialog></RemoveLiquidityDialog>
    </Main>
  );
}
