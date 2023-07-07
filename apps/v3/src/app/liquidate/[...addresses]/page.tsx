'use client';

import styled from '@emotion/styled';
import { formatAmount } from '@qilin/utils';
import type { Address } from 'wagmi';

import { PoolTable } from '@/components';
import { useLiquidationList, usePoolInfo } from '@/hooks';

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

  const { data } = useLiquidationList({
    assetAddress,
    poolAddress,
  });

  const columns = [
    {
      title: '#',
      key: 'index',
    },
    {
      title: 'Position',
      key: 'position',
    },
    {
      title: 'Rewards',
      key: 'rewards',
    },
    {
      title: 'Action',
      key: 'Action',
    },
  ];

  return (
    <Main>
      <Total>
        <h2>Total Value Liquidation Reward</h2>
        <div>${formatAmount(data?.totalReward)}</div>
      </Total>
      <TableTitle>{poolInfo?.pairName} Liquidation Positions</TableTitle>
      <PoolTable columns={columns} />
    </Main>
  );
}
