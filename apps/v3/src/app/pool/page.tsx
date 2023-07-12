'use client';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button } from '@qilin/component';
import { foramtPrecent, formatAmount } from '@qilin/utils';
import { useCallback, useMemo } from 'react';

import {
  AddLiquidityDialog,
  PoolTable,
  RemoveLiquidityDialog,
} from '@/components';
import { useMyLiquidity, usePoolList } from '@/hooks';

const Main = styled.main`
  max-width: 1440px;
  margin: 0 auto;
  padding: 16px 40px 80px;
`;

const TableTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
`;

export default function Pool() {
  const { data: poolList, mutate: refreshPoolList } = usePoolList(false);
  const { data: myLiquidityList, mutate: refreshMyLiquidity } =
    useMyLiquidity();

  const handleSuccess = useCallback(() => {
    setTimeout(() => {
      refreshPoolList();
      refreshMyLiquidity();
    }, 2000);
  }, [refreshMyLiquidity, refreshPoolList]);

  const liquidityColumns = useMemo(() => {
    return [
      {
        title: 'Pool',
        key: 'name',
      },
      {
        title: 'Liquidity',
        key: 'userLiquidity',
        render: (value: any, item: any) => {
          return `${formatAmount(value)}($ ${formatAmount(
            item.userLiquidityValue
          )})`;
        },
      },
      {
        title: 'Share',
        key: 'share',
        render: (value: any) => {
          return `${foramtPrecent(value)}%`;
        },
      },
      {
        title: 'Rol',
        key: 'roi',
        render: (value: any) => {
          return value ? foramtPrecent(value) + '%' : foramtPrecent(value);
        },
      },
      {
        title: 'Operation',
        key: 'operation',
        render: (_: any, item: any) => {
          return (
            <>
              <AddLiquidityDialog
                assetAddress={item.assetAddress}
                tokenAddress={item.token}
                poolAddress={item.poolAddress}
                oracleAddress={item.oracleAddress}
                onSuccess={handleSuccess}
              >
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
          `${formatAmount(value)}($ ${formatAmount(item.liquidityValue)})`,
      },
      {
        title: 'LP Price',
        key: 'LPPrice',
        render: (value: any, item: any) =>
          value
            ? `${formatAmount(value, 4, true)} ${item.marginTokenSymbol}`
            : formatAmount(value),
      },
      {
        title: 'APY',
        key: 'apy',
        render: (value: any) => {
          return value ? foramtPrecent(value) + '%' : foramtPrecent(value);
        },
      },
      {
        title: 'Operation',
        key: 'Operation',
        render: (_: any, item: any) => {
          return (
            <AddLiquidityDialog
              assetAddress={item.assetAddress}
              poolAddress={item.poolAddress}
              oracleAddress={item.oracleAddress}
              tokenAddress={item.marginTokenAddress}
              onSuccess={handleSuccess}
            >
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
        <AddLiquidityDialog onSuccess={handleSuccess}>
          <Button>New Position </Button>
        </AddLiquidityDialog>
      </div>
      <PoolTable columns={liquidityColumns} dataSource={myLiquidityList} />
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
