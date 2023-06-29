'use client';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button } from '@qilin/component';
import { formatAmount } from '@qilin/utils';

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
  const { data: poolList } = usePoolList();

  console.log(poolList);

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

  const PoolsColumns = [
    {
      title: 'Pool',
      key: 'pairName',
    },
    {
      title: 'Liquidity',
      key: 'liquidity',
      render: (value: any) => formatAmount(value),
    },
    {
      title: 'LP Price',
      key: 'futurePrice',
      render: (value: any) => formatAmount(value),
    },
    {
      title: 'APY',
      key: 'APY',
    },
    {
      title: 'Operation',
    },
  ];

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
        <AddLiquidityDialog>
          <Button>New Position </Button>
        </AddLiquidityDialog>
      </div>
      <PoolTable columns={LiquidityColumns} />
      <TableTitle
        css={css`
          margin: 20px 0 17px;
        `}
      >
        Pools
      </TableTitle>
      <PoolTable columns={PoolsColumns} dataSource={poolList} />
      <RemoveLiquidityDialog></RemoveLiquidityDialog>
    </Main>
  );
}
