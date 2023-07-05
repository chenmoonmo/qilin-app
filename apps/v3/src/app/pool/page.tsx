'use client';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button } from '@qilin/component';
import { formatAmount } from '@qilin/utils';
import { useCallback, useMemo } from 'react';

import {
  AddLiquidityDialog,
  PoolTable,
  RemoveLiquidityDialog,
} from '@/components';
import { useMyLiquidity, usePoolList } from '@/hooks';

const Main = styled.main`
  padding: 16px 12.5% 80px;
`;

const TableTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
`;

export default function Pool() {
  const { data: poolList, mutate: refreshPoolList } = usePoolList();
  const { data: myLiquidityList, mutate: refreshMyLiquidity } =
    useMyLiquidity();

  const handleSuccess = useCallback(() => {
    refreshPoolList();
    refreshMyLiquidity();
  }, [refreshMyLiquidity, refreshPoolList]);

  const LiquidityColumns = useMemo(() => {
    return [
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
        render: (_: any, item: any) => {
          return (
            <>
              <AddLiquidityDialog data={item} onSuccess={handleSuccess}>
                <Button>Add</Button>
              </AddLiquidityDialog>
              <RemoveLiquidityDialog data={item} onSuccess={handleSuccess}>
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
  }, [handleSuccess]);

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
          formatAmount(value) + ' ' + item.marginTokenSymbol,
      },
      {
        title: 'LP Price',
        key: 'LPPrice',
        render: (value: any, item: any) =>
          formatAmount(value) + ' ' + item.marginTokenSymbol,
      },
      {
        title: 'APY',
        key: 'APY',
      },
      {
        title: 'Operation',
        key: 'Operation',
        render: (_: any, item: any) => {
          return (
            <AddLiquidityDialog data={item} onSuccess={handleSuccess}>
              <Button>Add</Button>
            </AddLiquidityDialog>
          );
        },
      },
    ];
  }, [handleSuccess]);

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
