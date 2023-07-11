'use client';
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Button } from '@qilin/component';
import { foramtPrecent, formatAmount, formatInput } from '@qilin/utils';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, useBalance, useNetwork } from 'wagmi';

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
  TextWithDirection,
  TokenIcon,
  TradingView,
} from '@/components';
import {
  useHistoryPositions,
  useKLine,
  useLiquidationList,
  useOpenPositon,
  usePoolAddress,
  usePoolInfo,
  usePoolList,
  usePositions,
} from '@/hooks';

const Main = styled.main`
  display: grid;
  grid-template-columns: minmax(500px, 1060px) 332px;
  grid-template-rows: max-content max-content auto;
  justify-content: center;
  gap: 0 24px;
  padding: 16px 40px 80px;
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
  transition: background 0.3s ease;
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

const PositionTable = forwardRef<any, { columns: any; isFilter: boolean }>(
  ({ columns, isFilter }, ref) => {
    const { data } = usePositions(isFilter);
    return <Table ref={ref} columns={columns} dataSource={data} />;
  }
);

PositionTable.displayName = 'PositionTable';

const HistoryTable = forwardRef<any, { isFilter: boolean }>(
  ({ isFilter }, ref) => {
    const { chain } = useNetwork();

    const HistoryColumns = useMemo(() => {
      return [
        {
          title: 'Trading Pair',
          key: 'pool_name',
        },
        {
          title: 'Side',
          key: 'Direction',
          render: (value: 1 | 2) => {
            const direction = value === 1 ? 'Long' : 'Short';

            return (
              <TextWithDirection
                direction={direction.toLowerCase() as 'long' | 'short'}
              >
                {direction}
              </TextWithDirection>
            );
          },
        },
        {
          title: 'Type',
          key: 'Status',
        },
        {
          title: 'Margin',
          key: 'Margin',
          render: (value: string, item: any) => (
            <TableItem>
              <div>{formatAmount(value)}</div>
              <div>{item.symbol}</div>
            </TableItem>
          ),
        },
        {
          title: 'Price',
          key: 'Price',
          render: (value: string, item: any) => (
            <TableItem>
              <div>{formatAmount(value)}</div>
              <div>{item.token1Symbol}</div>
            </TableItem>
          ),
        },
        {
          title: 'Funding Fee',
          key: 'FundingFee',
          render: (value: string, item: any) => (
            <TableItem>
              <div>{formatAmount(value)}</div>
              <div>{item.symbol}</div>
            </TableItem>
          ),
        },
        {
          title: 'Service Fee',
          key: 'ServicesFee',
          render: (value: string, item: any) => (
            <TableItem>
              <div>{formatAmount(value)}</div>
              <div>{item.symbol}</div>
            </TableItem>
          ),
        },
        {
          title: 'PNL',
          key: 'PNL',
          render: (value: string, item: any) => (
            <TableItem>
              <div>{formatAmount(value)}</div>
              <div>{item.symbol}</div>
            </TableItem>
          ),
        },
        {
          title: 'Time',
          key: 'ActionTime',
          render: (value: number, item: any) => (
            <Link
              target="_blank"
              href={`${chain?.blockExplorers?.default.url}/tx/${item.ActionHash}`}
              css={css`
                display: flex;
                align-items: center;
                cursor: pointer;
              `}
            >
              {dayjs.unix(value).utc().format('YYYY.MM.DD HH:mm:ss UTC')}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                css={css`
                  margin-left: 3px;
                `}
              >
                <path
                  d="M4.86094 0.0124667C5.20303 -0.0561744 5.53593 0.165539 5.60442 0.507617C5.67306 0.849694 5.45134 1.18259 5.10925 1.25123C2.88704 1.69675 1.26297 3.65528 1.26297 5.94702C1.26297 8.59244 3.40977 10.7371 6.05881 10.7371C8.33468 10.7371 10.2838 9.14173 10.7502 6.94747C10.8228 6.6062 11.1581 6.38835 11.4994 6.46086C11.8406 6.53337 12.0585 6.86884 11.986 7.20995C11.3962 9.98492 8.9341 12 6.05914 12C2.71286 12 0 9.29013 0 5.94702C0 3.05024 2.05205 0.576258 4.86094 0.0124667ZM10.7367 0.000543109C11.0717 0.000543109 11.393 0.133475 11.6299 0.370174C11.8667 0.607034 11.9998 0.928164 12 1.26315V4.7371C12 4.96268 11.8798 5.17118 11.6843 5.28413C11.4889 5.39692 11.2481 5.39692 11.0527 5.28413C10.8572 5.17134 10.737 4.96268 10.737 4.7371V1.99822L5.68257 7.21059C5.45375 7.44681 5.08186 7.46792 4.82791 7.25893L4.78956 7.22445C4.66935 7.10779 4.60023 6.94828 4.59765 6.7807C4.59507 6.61329 4.6592 6.45151 4.7757 6.33131L9.69014 1.26315H7.26313C6.93184 1.26315 6.65695 1.00744 6.6331 0.676964L6.63165 0.632009C6.63165 0.283164 6.9146 0.00022085 7.26313 0.00022085L10.7367 0.000543109Z"
                  fill="white"
                />
              </svg>
            </Link>
          ),
        },
      ];
    }, [chain?.blockExplorers?.default.url]);

    const { data } = useHistoryPositions(isFilter);

    return <Table ref={ref} columns={HistoryColumns} dataSource={data} />;
  }
);

HistoryTable.displayName = 'HistoryTable';

export default function Home() {
  const { address } = useAccount();
  const router = useRouter();

  const [assetAddress, poolAddress] = usePoolAddress();

  const enabled = useMemo(
    () => !!(assetAddress && poolAddress),
    [assetAddress, poolAddress]
  );

  const [tableTab, setTableTab] = useState<string>('1');
  const [isFilter, setIsFilter] = useState<boolean>(false);

  const {
    data: { totalReward },
  } = useLiquidationList({
    assetAddress,
    poolAddress,
  });

  const { data: poolList, mutate: refreshPoolList } = usePoolList();

  const {
    data: poolInfo,
    error,
    mutate: refreshPoolInfo,
  } = usePoolInfo({
    assetAddress,
    poolAddress,
    enabled,
  });

  const { data: kLine, mutate: refreshKLine } = useKLine(
    poolInfo?.oracleAddress
  );

  const handleSuccsee = useCallback(() => {
    refreshPoolList();
    refreshPoolInfo();
    refreshKLine();
  }, [refreshKLine, refreshPoolInfo, refreshPoolList]);

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
    slippage,
    estLiqPrice,
  } = useOpenPositon(poolInfo, handleSuccsee);

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

  const positionColumns = useMemo(
    () => [
      {
        title: 'Trading Pair',
        key: 'poolName',
        render: (value: string, item: any) => {
          return (
            <Link
              href={`/?assetAddress=${item.asset_address}&poolAddress=${item.pool_address}`}
              data-active={
                item.pool_address === poolInfo?.poolAddress &&
                item.asset_address === poolInfo?.assetAddress
              }
              data-direction={item.side}
              css={css`
                cursor: pointer;
              `}
            >
              {value}
            </Link>
          );
        },
      },
      {
        title: 'Margin',
        key: 'margin',
        render: (value: string, item: any) => (
          <div
            css={css`
              display: flex;
              align-items: center;
            `}
          >
            <TableItem>
              <div>{formatAmount(value)}</div>
              <div>{item.symbol}</div>
            </TableItem>
            <div
              css={css`
                padding: 0 5px;
                margin-left: 8px;
                border-radius: 2px;
                background: #2c2f38;
                color: #fff;
                font-size: 10px;
                font-style: normal;
                font-weight: 400;
              `}
            >
              x{item.leverage}
            </div>
          </div>
        ),
      },
      {
        title: 'Size',
        key: 'size',
        render: (value: string, item: any) => (
          <TableItem>
            <div>{formatAmount(value)}</div>
            <div>{item.token0Symbol}</div>
          </TableItem>
        ),
      },
      {
        title: 'Open Price',
        key: 'openPrice',
        render: (value: string, item: any) => (
          <TableItem>
            <div>{formatAmount(value, 4, true)}</div>
            <div>{item.token1Symbol}</div>
          </TableItem>
        ),
      },
      {
        title: 'Margin Ratio',
        key: 'positionRatio',
        render: (value: number, item: any) => {
          let { marginRatio } = item;
          const positionRatio = value * 100;
          marginRatio = marginRatio * 100;
          const ratiaText = positionRatio >= marginRatio * 2 ? 'safe' : 'risk';
          return `${foramtPrecent(positionRatio)}%(> ${foramtPrecent(
            marginRatio
          )}% ${ratiaText})`;
        },
      },
      {
        title: 'Funding Fee',
        key: 'fundingFee',
        render: (_: any, item: any) => {
          return (
            <TableItem>
              <div>{formatAmount(item.fundingFee)}</div>
              <div>{item.symbol}</div>
            </TableItem>
          );
        },
      },
      {
        title: 'PNL',
        key: 'pnl',
        render: (value: string, item: any) => (
          <TableItem>
            <TextWithDirection>{formatAmount(value)}</TextWithDirection>
            <div>{item.symbol}</div>
          </TableItem>
        ),
      },
      {
        title: 'Operation',
        key: 'operation',
        render: (_: any, item: any) => (
          <>
            <AdjustMarginDialog data={item} onSuccess={handleSuccsee}>
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
            <ClosePositionDialog data={item as any} onSuccess={handleSuccsee}>
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
    ],
    [handleSuccsee, poolInfo?.assetAddress, poolInfo?.poolAddress]
  );

  useEffect(() => {
    const pool = poolList?.[0];
    if ((!enabled || error) && pool) {
      router.replace(
        `/?assetAddress=${pool.assetAddress}&poolAddress=${pool.poolAddress}`
      );
    }
  }, [assetAddress, enabled, error, poolAddress, poolList, router]);

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
        <PairPrice>{formatAmount(poolInfo?.futurePrice, 4, true)}</PairPrice>
        <PairDataItem>
          <div>Chainlink Price</div>
          <div>$ {formatAmount(poolInfo?.spotPrice, 4, true)}</div>
        </PairDataItem>
        <PairDataItem>
          <div>24h Change</div>
          <div>
            <TextWithDirection>
              {foramtPrecent(poolInfo?.change)}%
            </TextWithDirection>
          </div>
        </PairDataItem>
        <PairDataItem>
          <div>24h Volume</div>
          <div>$ {formatAmount(poolInfo?.volume)}</div>
        </PairDataItem>
        <PairDataItem>
          <div>Funding</div>
          <div>
            <TextWithDirection>
              {foramtPrecent(poolInfo?.funding)}%
            </TextWithDirection>
          </div>
        </PairDataItem>
        <PairDataItem>
          <div>Naked Positions</div>
          <div>
            {formatAmount(poolInfo?.nakePosition)} {marginToken?.symbol}
          </div>
        </PairDataItem>
        {!!totalReward && (
          <LiquidateLink href={`/liquidate/${assetAddress}/${poolAddress}`}>
            <div>
              <div>Liquidity Reward</div>
              <span>
                {totalReward} {poolInfo?.marginTokenSymbol}
              </span>
            </div>
            <div></div>
          </LiquidateLink>
        )}
      </PairInfoContainer>
      {/* chart */}
      <TradingView data={kLine} />
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
          <Token2>{poolInfo?.token0Symbol}</Token2>
        </FormInputContainer>
        <FormLeverageLabel>Leverage</FormLeverageLabel>
        <LeverageRadio
          value={leverage}
          leverages={poolInfo?.leverages}
          onChange={setLeverage}
        />
        <BudgetResultItem>
          <span>Est.Open Price</span>
          <span>
            1 {poolInfo?.token0Symbol} = {formatAmount(estPrice)}{' '}
            {poolInfo?.token1Symbol}
          </span>
        </BudgetResultItem>
        <BudgetResultItem>
          <span>Slippage</span>
          <span>{foramtPrecent(slippage)}%</span>
        </BudgetResultItem>
        <BudgetResultItem>
          <span>Est.Liq Price</span>
          <span>
            1 {poolInfo?.token0Symbol} = {formatAmount(estLiqPrice)}{' '}
            {poolInfo?.token1Symbol}
          </span>
        </BudgetResultItem>
        <OpenPositionDialog
          margin={margin}
          openPrice={estPrice}
          estLiqPrice={estLiqPrice}
          size={size}
          direction={direction}
          isNeedApprove={isNeedApprove}
          pairName={poolInfo?.pairName}
          token0Symbol={poolInfo?.token0Symbol}
          token1Symbol={poolInfo?.token1Symbol}
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
            <PositionTable columns={positionColumns} isFilter={isFilter} />
          </TabContent>
          <TabContent value="2" asChild>
            <HistoryTable isFilter={isFilter} />
          </TabContent>
        </TabRoot>
      </TableContainer>
    </Main>
  );
}
