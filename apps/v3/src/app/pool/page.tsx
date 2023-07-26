'use client';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button } from '@qilin/component';
import { foramtPrecent, formatAmount, formatPrice } from '@qilin/utils';
import { useCallback, useMemo } from 'react';

import {
  AddLiquidityDialog,
  PoolTable,
  RemoveLiquidityDialog,
} from '@/components';
import { useMyLiquidity, usePoolLiquidity, useSwitchNetwork } from '@/hooks';

const Main = styled.main`
  max-width: 1440px;
  margin: 0 auto;
  padding: 16px 40px 80px;
`;

const TableTitle = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
`;

export default function Pool() {
  const { isErrorNetwork, switchNetwork } = useSwitchNetwork();

  const { data: poolList, mutate: refreshPoolList } = usePoolLiquidity();

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
          return (
            <div>
              <div>${formatAmount(item.userLiquidityValue)}</div>
              <div>
                {formatAmount(value)} {item.marginTokenSymbol}
              </div>
            </div>
          );
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
                <Button
                  onClick={e => {
                    if (isErrorNetwork) {
                      switchNetwork();
                      e.stopPropagation();
                      e.preventDefault();
                    }
                  }}
                >
                  Add
                </Button>
              </AddLiquidityDialog>
              <RemoveLiquidityDialog data={item} onSuccess={handleSuccess}>
                <Button
                  backgroundColor="#464A56"
                  css={css`
                    margin-left: 6px;
                  `}
                  onClick={e => {
                    if (isErrorNetwork) {
                      switchNetwork();
                      e.stopPropagation();
                      e.preventDefault();
                    }
                  }}
                >
                  Remove
                </Button>
              </RemoveLiquidityDialog>
            </>
          );
        },
      },
    ];
  }, [handleSuccess, isErrorNetwork, switchNetwork]);

  const poolsColumns = useMemo(() => {
    return [
      {
        title: 'Pool',
        key: 'pairName',
      },
      {
        title: 'Liquidity',
        key: 'liquidity',
        render: (value: any, item: any) => (
          <div>
            <div>${formatAmount(item.liquidityValue)}</div>
            <div>
              {formatAmount(value)} {item.marginTokenSymbol}
            </div>
          </div>
        ),
      },
      {
        title: 'LP Price',
        key: 'LPPrice',
        render: (value: any, item: any) =>
          value
            ? `${formatPrice(value)} ${item.marginTokenSymbol}`
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
              <Button
                onClick={e => {
                  if (isErrorNetwork) {
                    switchNetwork();
                    e.stopPropagation();
                    e.preventDefault();
                  }
                }}
              >
                Add
              </Button>
            </AddLiquidityDialog>
          );
        },
      },
    ];
  }, [handleSuccess, isErrorNetwork, switchNetwork]);

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
          <Button
            onClick={e => {
              if (isErrorNetwork) {
                switchNetwork();
                e.stopPropagation();
                e.preventDefault();
              }
            }}
          >
            New Position{' '}
          </Button>
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
