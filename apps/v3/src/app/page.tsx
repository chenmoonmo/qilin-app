'use client';
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Button } from '@qilin/component';
import { formatAmount, formatInput } from '@qilin/utils';
import Link from 'next/link';
import { forwardRef, useMemo, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';

import {
  AdjustMarginDialog,
  Checkbox,
  ClosePositionDialog,
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
import {
  useHistoryPositions,
  useOpenPositon,
  usePoolInfo,
  usePositions,
} from '@/hooks';

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
    color: #dbdde5;

    &::placeholder {
      color: #737884;
    }
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

const TableItem = styled.div`
  color: #fff;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  > div:last-of-type {
    color: #737884;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;

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
    key: 'pool_name',
  },
  {
    title: 'Margin',
    key: 'margin',
    render: (value: string, item: any) => (
      <TableItem>
        <div>{formatAmount(value)}</div>
        <div>{item.symbol}</div>
      </TableItem>
    ),
  },
  {
    title: 'Size',
    key: 'size',
    render: (value: string, item: any) => (
      <TableItem>
        <div>{formatAmount(value)}</div>
        <div>{item.token0Name}</div>
      </TableItem>
    ),
  },
  {
    title: 'Open Price',
    key: 'open_price',
    render: (value: string, item: any) => (
      <TableItem>
        <div>{formatAmount(value)}</div>
        <div>{item.token1Name}</div>
      </TableItem>
    ),
  },
  {
    title: 'Margin Ratio',
    key: 'margin_ratio',
    render: (value: string) => `${formatAmount(+value * 100, 2)}%`,
  },
  {
    title: 'Funding Fee',
    key: 'funding_fee',
    render: (value: string, item: any) => (
      <TableItem>
        <div>{formatAmount(value)}</div>
        <div>{item.symbol}</div>
      </TableItem>
    ),
  },
  {
    title: 'PNL',
    key: 'pnl',
    render: (value: string, item: any) => (
      <TableItem>
        <div>{formatAmount(value)}</div>
        <div>{item.symbol}</div>
      </TableItem>
    ),
  },
  {
    title: 'Operation',
    key: 'operation',
    render: () => (
      <>
        <AdjustMarginDialog>
          <Button>
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              css={css`
                margin-right: 5px;
              `}
            >
              <rect y="3" width="8" height="2" fill="white" />
              <rect
                x="5"
                width="8"
                height="2"
                transform="rotate(90 5 0)"
                fill="white"
              />
            </svg>
            Margin
          </Button>
        </AdjustMarginDialog>
        <ClosePositionDialog>
          <Button
            backgroundColor="#464A56"
            css={css`
              margin-left: 8px;
            `}
          >
            Close
          </Button>
        </ClosePositionDialog>
      </>
    ),
  },
];

const PositionTable = forwardRef<any, { isFilter: boolean }>(
  ({ isFilter }, ref) => {
    const { data } = usePositions(isFilter);
    console.log(data);
    return <Table ref={ref} columns={PosiditonColumns} dataSource={data} />;
  }
);

PositionTable.displayName = 'PositionTable';

const HistoryTable = forwardRef<any>((_, ref) => {
  const data: any[] = [];
  useHistoryPositions();
  return <Table ref={ref} columns={HistoryColumns} dataSource={data} />;
});

HistoryTable.displayName = 'HistoryTable';

export default function Home() {
  const { address } = useAccount();

  const [tableTab, setTableTab] = useState<string>('1');
  const [isFilter, setIsFilter] = useState<boolean>(false);

  const { data: poolInfo } = usePoolInfo();

  console.log(poolInfo);

  const {
    margin,
    setMargin,
    leverage,
    setLeverage,
    direction,
    setDirection,
    size,
    estPrice,
    isNeedApprove,
    hanldeOpenPosition,
  } = useOpenPositon({
    marginTokenAddress: poolInfo?.marginTokenAddress,
    price: poolInfo?.spotPrice,
    positionLong: poolInfo?.positionLong,
    positionShort: poolInfo?.positionShort,
    liquidity: poolInfo?.liquidity,
  });

  const { data: marginToken } = useBalance({
    address,
    token: poolInfo?.marginTokenAddress,
  });

  const disabledConfirm = useMemo(() => {
    if (!marginToken?.formatted || !margin) return true;
    return +margin > +marginToken.formatted;
  }, [margin, marginToken]);

  const [buttonText, buttonColor] = useMemo(() => {
    return direction === '1' ? ['Long', '#44c27f'] : ['Short', '#e15c48'];
  }, [direction]);

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
        <PairPrice>{formatAmount(poolInfo?.futurePrice)}</PairPrice>
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
          <div>
            {formatAmount(poolInfo?.volume)} {marginToken?.symbol}
          </div>
        </PairDataItem>
        <PairDataItem>
          <div>Fuding</div>
          <div>
            {formatAmount(poolInfo?.funding)} {marginToken?.symbol}
          </div>
        </PairDataItem>
        <PairDataItem>
          <div>Naked Positions</div>
          <div>
            {formatAmount(poolInfo?.nakePosition)} {marginToken?.symbol}
          </div>
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
            <input
              type="text"
              placeholder="0.0"
              value={margin}
              onChange={e => {
                setMargin(formatInput(e.target.value));
              }}
            />
          </FormInput>
          <PayRight>
            <div>Balance: {formatAmount(marginToken?.formatted)}</div>
            <TokenInfoContainer>
              <MaxButton
                onClick={() => {
                  setMargin(marginToken?.formatted ?? '0');
                }}
              >
                Max
              </MaxButton>
              <TokenInfo>
                <TokenIcon size={26} />
                <TokenSymbol>{marginToken?.symbol}</TokenSymbol>
              </TokenInfo>
            </TokenInfoContainer>
          </PayRight>
        </FormInputContainer>
        <FormInputContainer>
          <FormInput>
            <label>Size</label>
            <input
              type="text"
              placeholder="0.0"
              value={size ? formatAmount(size) : ''}
              disabled
            />
          </FormInput>
          <Token2>{poolInfo?.token0Name}</Token2>
        </FormInputContainer>
        <FormLeverageLabel>Leverage</FormLeverageLabel>
        <LeverageRadio
          value={leverage}
          leverages={poolInfo?.levels}
          onChange={setLeverage}
        />
        <BudgetResultItem>
          <span>Est.Open Price</span>
          <span>
            1 {poolInfo?.token0Name} = {formatAmount(estPrice)}{' '}
            {poolInfo?.token1Name}
          </span>
        </BudgetResultItem>
        <BudgetResultItem>
          <span>Slippage</span>
          <span>0.2%</span>
        </BudgetResultItem>
        <BudgetResultItem>
          <span>Est.Liq Price</span>
          <span>
            1 {poolInfo?.token0Name} = 123.12 {poolInfo?.token1Name}
          </span>
        </BudgetResultItem>
        <OpenPositionDialog
          margin={margin}
          openPrice={estPrice}
          size={size}
          direction={direction}
          isNeedApprove={isNeedApprove}
          pairName={poolInfo?.pairName}
          token0Name={poolInfo?.token0Name}
          token1Name={poolInfo?.token1Name}
          marginTokenName={marginToken?.symbol}
          onConfirm={hanldeOpenPosition}
        >
          <OpenButton disabled={disabledConfirm} backgroundColor={buttonColor}>
            {buttonText}
          </OpenButton>
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
              <Checkbox
                checked={isFilter}
                onCheckedChange={val => setIsFilter(val as boolean)}
              />
              Hide Other Positions
            </div>
          </TableTabTitle>
          <TabContent value="1" asChild>
            <PositionTable isFilter={isFilter} />
          </TabContent>
          <TabContent value="2" asChild>
            <HistoryTable />
          </TabContent>
        </TabRoot>
      </TableContainer>
    </Main>
  );
}
