'use client';
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Button } from '@qilin/component';
import { formatAmount } from '@qilin/utils';
import Link from 'next/link';
import { forwardRef, useState } from 'react';

import {
  Checkbox,
  LeverageRadio,
  OpenPositionDialog,
  PairSelector,
  SwapRadio,
  TabContent,
  Table,
  TabList,
  TabRoot,
  TabTrigger,
  TokenIcon,
  TradingView,
} from '@/components';
import { useHistoryPositions, usePoolInfo, usePositions } from '@/hooks';

const HistoryColumns = [
  {
    title: 'Trading Pair',
    key: 'tradingPair',
  },
  {
    title: 'Side',
    key: 'side',
  },
  {
    title: 'Type',
    key: 'type',
  },
  {
    title: 'Margin',
    key: 'margin',
  },
  {
    title: 'Price',
    key: 'price',
  },
  {
    title: 'Funding-Fee',
    key: 'fundingFee',
  },
  {
    title: 'Service-Fee',
    key: 'serviceFee',
  },
  {
    title: 'PNL',
    key: 'pnl',
  },
  {
    title: 'Time',
    key: 'time',
  },
];

const PosiditonColumns = [
  {
    title: 'Trading Pair',
    key: 'tradingPair',
  },
  {
    title: 'Margin',
    key: 'margin',
  },
  {
    title: 'Size',
    key: 'size',
  },
  {
    title: 'Open Price',
    key: 'openPrice',
  },
  {
    title: 'Margin Ratio',
    key: 'marginRatio',
  },
  {
    title: 'Funding Fee',
    key: 'fundingFee',
  },
  {
    title: 'PNL',
    key: 'pnl',
  },
  {
    title: 'Operation',
    key: 'operation',
    render: () => {},
  },
];

const Main = styled.main`
  display: grid;
  grid-template-columns: 1fr 332px;
  grid-template-rows: max-content max-content auto;
  justify-content: center;
  gap: 0 24px;
  width: 100%;
  min-width: 1440px;
  padding: 0 12.5%;
`;

const PairInfoContainer = styled.div`
  position: relative;
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  display: flex;
  align-items: center;
  > div {
    position: relative;
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      right: 0;
      width: 1px;
      height: 30px;
      background: #363a45;
      transform: translateY(-50%);
    }
  }
`;

const PairIcon = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 10px;
  > :nth-of-type(2) {
    margin-left: -12px;
  }
`;

const PairInfo = styled.div`
  display: flex;
  align-items: center;
  padding-right: 24px;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  svg {
    margin-left: 5px;
  }
`;

const PairPrice = styled.div`
  padding: 0 21px;
  color: #fff;
  font-size: 14px;
  line-height: 21px;
`;

const PairDataItem = styled.div`
  align-self: stretch;
  padding: 12px 24px 30px;
  > div:first-of-type {
    font-size: 12px;
    font-family: Poppins;
    font-weight: 400;
    color: #737884;
  }

  > div:nth-of-type(2) {
    margin-top: 4px;
    font-size: 10px;
    font-family: Poppins;
    font-weight: 500;
    color: #ffffff;
  }

  > div:nth-of-type(3) {
    font-size: 10px;
    font-family: Poppins;
    font-weight: 500;
    color: #e15c48;
  }
`;

const FormInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  margin-top: 10px;
  padding: 13px 14px 8px;
  background: #2c2f38;
  border-radius: 6px;
  &:last-of-type {
    margin-top: 6px;
  }
`;

const FormInput = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  label {
    font-size: 12px;
    font-weight: 400;
    color: #737884;
  }
  input {
    display: block;
    width: 100%;
    padding: 6px 0;
    margin-top: 10px;
    font-size: 24px;
    font-family: PT Mono;
    font-weight: bold;
    color: #737884;
  }
`;

const PayRight = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 2px;
  font-size: 12px;
  font-weight: 400;
  color: #737884;
  > div {
    text-align: right;
  }
`;

const TokenInfoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const MaxButton = styled.button`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 30px;
  padding: 10px;
  background: #464a56;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 400;
  color: #828792;
`;

const TokenInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 2px;
  margin-left: 6px;
  border-radius: 100px;
  background: #464a56;
  font-size: 14px;
  font-weight: 500;
`;

const TokenSymbol = styled.span`
  padding: 0 12px 0 5px;
  color: #fff;
`;

const Token2 = styled.div`
  align-self: flex-end;
  padding: 5px 10px;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: #828792;
  background: #464a56;
  border-radius: 100px;
`;

const FormLeverageLabel = styled.div`
  margin: 23px 0 14px;
  font-size: 12px;
  font-weight: 500;
  color: #9699a3;
`;

// 预算结果项
const BudgetResultItem = styled.p`
  all: unset;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 9px;
  font-size: 12px;
  font-weight: 400;
  color: #737884;
  &:first-of-type {
    margin-top: 20px;
  }
`;

const OpenButton = styled(Button)`
  width: 100%;
  height: 40px;
  margin-top: 34px;
`;

const TableContainer = styled.div`
  grid-column: 1/3;
`;

const TableTabTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: #9699a3;
`;

const BounceInRight = keyframes`
        0% {
					opacity: 0;
					transform: translateX(100px);
				}

				60% {
					opacity: 1;
					transform: translateX(80px);
				}

				100% {
					transform: translateX(0);
				}
`;

const LiquidateLink = styled(Link)`
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  padding: 17px;
  border: 2px solid #363a45;
  border-radius: 9px;
  background: #242730;
  animation: ${BounceInRight} 0.5s 2s ease-in;
  animation-fill-mode: both;
  font-size: 12px;
  line-height: 16px;
  color: #737884;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #363a45;
  }

  > div:first-of-type {
    margin-right: 50px;
  }
  > div:last-of-type {
    width: 14px;
    height: 9px;
    background-image: url('/images/arrow-right.png');
  }
  span {
    font-size: 14px;
    line-height: 11px;
    color: #fff;
  }
`;

const PositionTable = forwardRef<any>((_, ref) => {
  const data: any[] = [];
  usePositions();
  return <Table ref={ref} columns={PosiditonColumns} dataSource={data} />;
});

PositionTable.displayName = 'PositionTable';

const HistoryTable = forwardRef<any>((_, ref) => {
  const data: any[] = [];
  useHistoryPositions();
  return <Table ref={ref} columns={HistoryColumns} dataSource={data} />;
});

HistoryTable.displayName = 'HistoryTable';

export default function Home() {
  // 多空方向
  const [direction, setDirection] = useState('1');
  const [tableTab, setTableTab] = useState<string>('1');

  const { data: poolInfo } = usePoolInfo();

  return (
    <Main>
      <PairInfoContainer>
        <PairSelector value={poolInfo?.ID}>
          <PairInfo>
            <PairIcon>
              <TokenIcon size={36} />
              <TokenIcon size={36} />
            </PairIcon>
            <span>{poolInfo?.pairName}</span>
            <svg
              width="14"
              height="10"
              viewBox="0 0 14 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.80756 10L0.911934 2.5L12.7032 2.5L6.80756 10Z"
                fill="white"
              />
            </svg>
          </PairInfo>
        </PairSelector>
        <PairPrice>{formatAmount(poolInfo?.spotPrice)}</PairPrice>
        <PairDataItem>
          <div>Chainlink Price</div>
          <div>$ {formatAmount(poolInfo?.spotPrice)}</div>
        </PairDataItem>
        <PairDataItem>
          <div>24h Change</div>
          <div>{formatAmount(poolInfo?.change, 2)}%</div>
        </PairDataItem>
        <PairDataItem>
          <div>24h Volume</div>
          <div>{formatAmount(poolInfo?.volume)} USDC</div>
        </PairDataItem>
        <PairDataItem>
          <div>Fuding</div>
          <div>{formatAmount(poolInfo?.funding)} USDC</div>
        </PairDataItem>
        <PairDataItem>
          <div>Naked Positions</div>
          <div>{formatAmount(poolInfo?.nakePosition)} USDC</div>
        </PairDataItem>
        <LiquidateLink href="/liquidate">
          <div>
            <div>Liquidity Reward</div>
            <span>11 usdc</span>
          </div>
          <div></div>
        </LiquidateLink>
      </PairInfoContainer>
      {/* chart */}
      <TradingView />
      {/* form */}
      <div>
        <SwapRadio value={direction} onChange={setDirection} />
        <FormInputContainer>
          <FormInput>
            <label>Pay</label>
            <input type="text" />
          </FormInput>
          <PayRight>
            <div>Balance: 0</div>
            <TokenInfoContainer>
              <MaxButton>Max</MaxButton>
              <TokenInfo>
                <TokenIcon size={26} />
                <TokenSymbol>ETH</TokenSymbol>
              </TokenInfo>
            </TokenInfoContainer>
          </PayRight>
        </FormInputContainer>
        <FormInputContainer>
          <FormInput>
            <label>Size</label>
            <input type="text" />
          </FormInput>
          <Token2>ETH</Token2>
        </FormInputContainer>
        <FormLeverageLabel>Leverage</FormLeverageLabel>
        <LeverageRadio leverages={poolInfo?.levels} />
        <BudgetResultItem>
          <span>Est.Open Price</span>
          <span>1 ETH = 123.12 USDC</span>
        </BudgetResultItem>
        <BudgetResultItem>
          <span>Slippage</span>
          <span>0.2%</span>
        </BudgetResultItem>
        <BudgetResultItem>
          <span>Est.Liq Price</span>
          <span>1 ETH = 123.12 USDC</span>
        </BudgetResultItem>
        <OpenPositionDialog>
          <OpenButton>Short</OpenButton>
        </OpenPositionDialog>
      </div>
      {/* table */}
      <TableContainer>
        <TabRoot value={tableTab} onValueChange={setTableTab}>
          <TableTabTitle>
            <TabList>
              <TabTrigger value="1">Postions</TabTrigger>
              <TabTrigger value="2">Trade History</TabTrigger>
            </TabList>
            <div
              css={css`
                display: flex;
                align-items: center;
                gap: 10px;
              `}
            >
              <Checkbox />
              Hide Other Positions
            </div>
          </TableTabTitle>
          <TabContent value="1" asChild>
            <PositionTable />
          </TabContent>
          <TabContent value="2" asChild>
            <HistoryTable />
          </TabContent>
        </TabRoot>
      </TableContainer>
    </Main>
  );
}
