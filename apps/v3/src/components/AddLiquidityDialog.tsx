import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Dialog } from '@qilin/component';
import { formatAmount, formatInput } from '@qilin/utils';
import { useState } from 'react';

import type { usePoolList } from '@/hooks';
import { useAddLiquidity, usePoolParam } from '@/hooks';

import { PoolSelector } from './PoolSelector';
import { TokenIcon } from './TokenIcon';

type AddLiquidityDialogPropsType = {
  children: React.ReactNode;
  data: ReturnType<typeof usePoolList>['data'][number];
};

const Content = styled(Dialog.Content)`
  width: 858px;
  max-width: 858px;
  border-radius: 24px;
  border: 2px solid #323640;
  background: #262930;
  overscroll-behavior: contain;
`;

const Title = styled(Dialog.Title)`
  display: flex;
  align-items: center;
  svg {
    margin-right: 10px;
    cursor: pointer;
  }
`;

const Contianer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 43px;
  margin-top: 18px;
  > div {
    flex: 1;
  }
`;

const SubTitle = styled.h2`
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  margin: 0 0 6px;
`;

const Balance = styled.div`
  font-size: 12px;
  font-family: Poppins;
  font-weight: 500;
`;

const AmountInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 10px;
  height: 40px;
  border-radius: 6px;
  background: #2c2f38;
  input {
    flex: 1;
    color: #737884;
    font-size: 16px;
    font-family: PT Mono;
    font-weight: 700;
  }
`;

const MaxButton = styled.button`
  padding: 5px 10px;
  border-radius: 100px;
  background: #464a56;
  color: #828792;
  font-size: 12px;
  line-height: 18px;
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
`;

const SubmitButton = styled(Button)`
  width: 100%;
  height: 40px;
  margin-top: 34px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  > span:first-of-type {
    color: #737884;
  }
  &:not(:first-of-type) {
    margin-top: 9px;
  }
`;

export const AddLiquidityDialog: React.FC<AddLiquidityDialogPropsType> = ({
  children,
  data,
}) => {
 

  const [open, setOpen] = useState(false);

  const { amount, setAmount, marginToken, handleAddLiquidty } =
    useAddLiquidity(data);

  const { data: poolParam } = usePoolParam(
    data.assetAddress,
    data.poolAddress,
    open
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Content>
          <Title>
            <Dialog.Close asChild>
              <svg
                width="12"
                height="18"
                viewBox="0 0 12 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.3162 0L12 1.51539L3.42286 9.10566L11.9883 16.4632L10.3296 18L0 9.12911L10.3162 0Z"
                  fill="white"
                />
              </svg>
            </Dialog.Close>
            Add Liquidity
          </Title>
          <Contianer>
            <div>
              <SubTitle>Select Oracle</SubTitle>
              <PoolSelector disabled value="chainlink" />
              <SubTitle
                css={css`
                  margin-top: 20px;
                `}
              >
                Select Pool
              </SubTitle>
              <PoolSelector />
              <SubTitle
                css={css`
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin-top: 20px;
                `}
              >
                Amount
                <Balance>
                  balance: {formatAmount(marginToken?.formatted)}
                </Balance>
              </SubTitle>
              <AmountInput>
                <input
                  type="text"
                  value={amount}
                  placeholder="0.0"
                  onChange={e => setAmount(formatInput(e.target.value))}
                />
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                  `}
                >
                  <MaxButton
                    onClick={() =>
                      setAmount(formatInput(marginToken!.formatted))
                    }
                  >
                    Max
                  </MaxButton>
                  <TokenInfo>
                    <TokenIcon size={26} />
                    <TokenSymbol>{marginToken?.symbol}</TokenSymbol>
                  </TokenInfo>
                </div>
              </AmountInput>
              <SubmitButton onClick={handleAddLiquidty}>
                Add Liquidity
              </SubmitButton>
            </div>
            <div>
              <SubTitle>Select Oracle</SubTitle>
              <InfoItem>
                <span>Liquidity</span>
                <span>{formatAmount(poolParam?.liquidity)} ETH($123.12)</span>
              </InfoItem>
              <InfoItem>
                <span>LP Price</span>
                <span>{formatAmount(poolParam?.lp_price)} ETH</span>
              </InfoItem>
              <InfoItem>
                <span>APY</span>
                <span>{formatAmount(poolParam?.apy)}</span>
              </InfoItem>
              <InfoItem>
                <span>Share Of Pool</span>
                <span>0.15%</span>
              </InfoItem>
              <SubTitle
                css={css`
                  margin-top: 40px;
                `}
              >
                Parameters
              </SubTitle>
              <InfoItem>
                <span>Fee</span>
                <span>{formatAmount(poolParam?.fee_ratio, 2)} %</span>
              </InfoItem>
              <InfoItem>
                <span>Leverage Rate (L)</span>
                <span>{formatAmount(poolParam?.leverage_rate)}</span>
              </InfoItem>
              <InfoItem>
                <span>Min Margin Ratio (Dmin)</span>
                <span>{formatAmount(poolParam?.margin_ratio)}</span>
              </InfoItem>
            </div>
          </Contianer>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
