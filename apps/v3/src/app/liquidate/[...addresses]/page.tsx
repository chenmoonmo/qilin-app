'use client';

import styled from '@emotion/styled';
import { Button } from '@qilin/component';
import { formatAmount } from '@qilin/utils';
import { useMemo } from 'react';
import type { Address } from 'wagmi';

import { PoolTable } from '@/components';
import { useLiquidationList, usePoolInfo } from '@/hooks';
import { useLiquidity } from '@/hooks/useLiquidity';

const Main = styled.main`
  max-width: 1440px;
  margin: 0 auto;
  padding: 16px 40px 80px;
`;

const Total = styled.div`
  padding: 12px;
  border-radius: 6px;
  background: #2c2f38;
  font-size: 14px;
  font-weight: 600;
  h2 {
    font-size: 14px;
    font-weight: 400;
    color: #9699a3;
    margin: 0 0 12px;
  }
`;

const TableTitle = styled.h1`
  margin: 57px 0 17px;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
`;

export default function Liquidate({
  params: { addresses },
}: {
  params: { addresses: [Address, Address] };
}) {
  const [assetAddress, poolAddress] = addresses;

  const { data: poolInfo } = usePoolInfo({
    assetAddress,
    poolAddress,
  });

  const { data, mutate } = useLiquidationList({
    assetAddress,
    poolAddress,
  });

  const { handleLiquidate } = useLiquidity({
    assetAddress: poolInfo?.assetAddress,
    onSuccess: () => {
      mutate({
        list: [],
        totalReward: 0,
      });
    },
  });

  const columns = useMemo(() => {
    return [
      {
        title: '#',
        key: 'index',
        render: (_: any, _1: any, index: number) => <>{index + 1}</>,
      },
      {
        title: 'Position',
        key: 'size',
        render: (_: any, record: any) => {
          return (
            <>
              {formatAmount(record.size)} {record.symbol}
            </>
          );
        },
      },
      {
        title: 'Rewards',
        key: 'rewards',
        render: (_: any, record: any) => {
          return (
            <>
              {formatAmount(record.rewards)} {record.symbol}
            </>
          );
        },
      },
      {
        title: 'Action',
        key: 'positionId',
        render: (positionId: number) => {
          return (
            <Button onClick={() => handleLiquidate(positionId)}>
              Liqudate
            </Button>
          );
        },
      },
    ];
  }, [handleLiquidate]);
  console.log(data);

  return (
    <Main>
      <Total>
        <h2>Total Value Liquidation Reward</h2>
        <div>
          {formatAmount(data?.totalReward)} {poolInfo?.marginTokenSymbol}
        </div>
      </Total>
      <TableTitle>{poolInfo?.pairName} Liquidation Positions</TableTitle>
      <PoolTable columns={columns} dataSource={data.list} />
    </Main>
  );
}
