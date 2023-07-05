'use client';

import styled from '@emotion/styled';

import { PoolTable } from '@/components';

const Main = styled.main`
  padding: 16px 12.5% 0;
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

export default function Liquidate() {
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
    },
  ];
  return (
    <Main>
      <Total>
        <h2>Total Value Liquidation Reward</h2>
        <div>$88,541,999.65</div>
      </Total>
      <TableTitle>ETH-USDC-Vanilla Liquidation Positions</TableTitle>
      <PoolTable columns={columns} />
    </Main>
  );
}
