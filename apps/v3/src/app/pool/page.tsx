'use client';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button } from '@qilin/component';
import { foramtPrecent, formatAmount, formatPrice } from '@qilin/utils';
import { useCallback, useMemo, useState } from 'react';

import {
  AddLiquidityDialog,
  PoolTabContent,
  PoolTable,
  PoolTabList,
  PoolTabRoot,
  PoolTabTrigger,
  RemoveLiquidityDialog,
  TextWithDirection,
} from '@/components';
import {
  useApplyRemoveList,
  useMyLiquidity,
  usePoolLiquidity,
  useRemoveLiquidityAfterApply,
  useSwitchNetwork,
} from '@/hooks';

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

const ClaimTable = () => {
  const { data, mutate } = useApplyRemoveList();

  const { handleRemoveLiquidityAfterApply } = useRemoveLiquidityAfterApply();

  const handleClaim = useCallback(
    (item: any) => {
      handleRemoveLiquidityAfterApply({
        assetAddress: item.assetAddress,
        removeIndex: item.index,
      });
      setTimeout(() => {
        mutate();
      }, 2000);
    },
    [handleRemoveLiquidityAfterApply, mutate]
  );

  const claimColumns = useMemo(() => {
    return [
      {
        title: 'Pool',
        key: 'name',
      },
      {
        title: 'Liquidity',
        key: 'LPAmount',
        render: (_: any, item: any) => {
          return formatAmount(item.LPAmount);
        },
      },
      {
        title: 'Withdraw Date',
        key: 'withdrawDate',
      },
      {
        title: 'Operation',
        key: 'operation',
        render: (_: any, item: any) => {
          return (
            <Button
              disabled={item.status === 1}
              onClick={() => handleClaim(item)}
            >
              Claim
            </Button>
          );
        },
      },
    ];
  }, [handleClaim]);
  return <PoolTable columns={claimColumns} dataSource={data} />;
};

const MyLiquidityTable = () => {
  const { isErrorNetwork, switchNetwork } = useSwitchNetwork();

  const { data: myLiquidityList, mutate: handleSuccess } = useMyLiquidity();

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
        title: 'Withdraw Request',
        key: 'withdrawRequest',
        render: (value: any) => formatAmount(value),
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
                  Widthdraw
                </Button>
              </RemoveLiquidityDialog>
            </>
          );
        },
      },
    ];
  }, [handleSuccess, isErrorNetwork, switchNetwork]);

  return <PoolTable columns={liquidityColumns} dataSource={myLiquidityList} />;
};

export default function Pool() {
  const { isErrorNetwork, switchNetwork } = useSwitchNetwork();
  const { data: poolList, mutate: refreshPoolList } = usePoolLiquidity();

  const [activeTab, setActiveTab] = useState('list');

  const handleSuccess = useCallback(() => {
    setTimeout(() => {
      refreshPoolList();
      // refreshMyLiquidity();
    }, 2000);
  }, [refreshPoolList]);

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
          return (
            <TextWithDirection>
              {value ? foramtPrecent(value) + '%' : foramtPrecent(value)}
            </TextWithDirection>
          );
        },
      },
      {
        title: 'Epoch',
        key: 'epochIndex',
        render: (value: number, item: any) => {
          return (
            <div
              css={css`
                display: flex;
                align-items: center;
              `}
            >
              <div
                css={css`
                  padding: 4px;
                  margin-right: 13px;
                  /* font-size: 14px; */
                  line-height: 21px;
                  font-weight: 500;
                  border-radius: 4px;
                  background: #464a56;
                `}
              >
                {value}
              </div>
              <div
                css={css`
                  /* font-size: 14px; */
                  font-weight: 500;
                  line-height: normal;
                `}
              >
                <div>Start：{item.epochStartTime}</div>
                <div>End：{item.epochEndTime}</div>
              </div>
            </div>
          );
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
      <TableTitle>My Liquidity</TableTitle>
      <PoolTabRoot value={activeTab} onValueChange={setActiveTab}>
        <PoolTabList
          css={css`
            margin: 25px 0 12px;
          `}
        >
          <PoolTabTrigger value="list">List</PoolTabTrigger>
          <PoolTabTrigger value="claim">Claim</PoolTabTrigger>
        </PoolTabList>
        <PoolTabContent value="list">
          <MyLiquidityTable />
        </PoolTabContent>
        <PoolTabContent value="claim">
          <ClaimTable />
        </PoolTabContent>
      </PoolTabRoot>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 37px 0 9px;
        `}
      >
        <TableTitle>Pools</TableTitle>
        <AddLiquidityDialog onSuccess={handleSuccess}>
          <Button
            css={css`
              height: 38px;
            `}
            onClick={e => {
              if (isErrorNetwork) {
                switchNetwork();
                e.stopPropagation();
                e.preventDefault();
              }
            }}
          >
            New Position
          </Button>
        </AddLiquidityDialog>
      </div>
      <PoolTable columns={poolsColumns} dataSource={poolList} />
    </Main>
  );
}
