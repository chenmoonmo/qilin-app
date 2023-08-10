'use client';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Tooltip, useToast } from '@qilin/component';
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
  const { showToast } = useToast();
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
        key: 'tokenAmount',
        render: (tokenAmount: any, item: any) => {
          return `${formatAmount(tokenAmount)} ${item.poolName}`;
        },
      },
      {
        title: 'Withdraw Date',
        key: 'outTime',
      },
      {
        title: 'Operation',
        key: 'operation',
        render: (_: any, item: any) => {
          return (
            <Button
              disabled={item.status === 1}
              onClick={() => handleClaim(item)}
              onDisabledClick={() => {
                showToast({
                  type: 'warning',
                  title: 'Claim the assets after the withdrawal date.',
                  message: '',
                  duration: 2000,
                });
              }}
            >
              Claim
            </Button>
          );
        },
      },
    ];
  }, [handleClaim]);
  return (
    <PoolTable
      columns={claimColumns}
      dataSource={data}
      noData="Withdrawal requests will be displayed here"
    />
  );
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
        render: (value: any, item: any) =>
          `${formatAmount(value)} ${item.marginTokenSymbol}`,
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
        title: (
          <div
            css={css`
              display: flex;
              align-items: center;
              gap: 5px;
            `}
          >
            Epoch
            <Tooltip
              text={
                <>
                  <div>
                    Withdrawals follow an epoch system, with each epoch lasting
                    48 hours.
                  </div>
                  <div>
                    You can submit a request to withdraw your assets at any
                    time,
                  </div>
                  <div>
                    but the actual withdrawal will occur during a specific
                    withdrawal epoch.
                  </div>
                  <div>
                    The specific withdraw epoch is determined based on the
                  </div>
                  <div>
                    Futures-Spot Price Spread and may be scheduled between 1 and
                    3 epochs later.
                  </div>
                </>
              }
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 14C3.13396 14 0 10.866 0 7C0 3.13396 3.13396 0 7 0C10.866 0 14 3.13396 14 7C14 10.866 10.866 14 7 14ZM7 12.6875C10.1411 12.6875 12.6875 10.1411 12.6875 7C12.6875 3.85893 10.1411 1.3125 7 1.3125C3.85893 1.3125 1.3125 3.85893 1.3125 7C1.3125 10.1411 3.85893 12.6875 7 12.6875ZM7.12141 3.01875C7.84948 3.01875 8.44302 3.20906 8.89091 3.61229C9.33898 4.00422 9.56284 4.54198 9.56284 5.22503C9.56284 5.78503 9.41737 6.24422 9.14849 6.6026C9.04768 6.71453 8.72284 7.01695 8.18526 7.48745C7.98365 7.65534 7.83799 7.84583 7.73737 8.04745C7.62544 8.27148 7.5693 8.50664 7.5693 8.77552V8.93229H6.28122V8.77552C6.28122 8.34987 6.34849 7.98018 6.50526 7.67794C6.65091 7.37552 7.08768 6.90521 7.81575 6.25552L7.9501 6.09875C8.15172 5.85229 8.25253 5.58359 8.25253 5.30359C8.25253 4.93409 8.1406 4.64279 7.93898 4.43005C7.72607 4.21714 7.42383 4.11651 7.04302 4.11651C6.5501 4.11651 6.20302 4.26198 5.99029 4.5757C5.79979 4.83328 5.71029 5.20297 5.71029 5.67328H4.43333C4.43333 4.84458 4.66849 4.1949 5.16141 3.72458C5.64284 3.25391 6.29253 3.01875 7.12141 3.01875ZM6.5625 9.8H7.29167C7.45281 9.8 7.58333 9.93052 7.58333 10.0917V10.9083C7.58333 11.0695 7.45281 11.2 7.29167 11.2H6.5625C6.40135 11.2 6.27083 11.0695 6.27083 10.9083V10.0917C6.27083 9.93052 6.40135 9.8 6.5625 9.8Z"
                  fill="#737884"
                />
              </svg>
            </Tooltip>
          </div>
        ),
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
