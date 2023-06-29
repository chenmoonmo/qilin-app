import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Dialog } from '@qilin/component';

import { PoolSelector } from './PoolSelector';
import { TokenIcon } from './TokenIcon';

type AddLiquidityDialogPropsType = {
  children: React.ReactNode;
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
}) => {
  return (
    <Dialog.Root>
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
              <PoolSelector />
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
                <Balance>balance:0</Balance>
              </SubTitle>
              <AmountInput>
                <input></input>
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                  `}
                >
                  <MaxButton>Max</MaxButton>
                  <TokenInfo>
                    <TokenIcon size={26} />
                    <TokenSymbol>ETH</TokenSymbol>
                  </TokenInfo>
                </div>
              </AmountInput>
              <SubmitButton>Add Liquidity</SubmitButton>
            </div>
            <div>
              <SubTitle>Select Oracle</SubTitle>
              <InfoItem>
                <span>Liquidity</span>
                <span>321.12 ETH($123.12)</span>
              </InfoItem>
              <InfoItem>
                <span>LP Price</span>
                <span>0.12 ETH</span>
              </InfoItem>
              <InfoItem>
                <span>APY</span>
                <span>+12.12%</span>
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
                <span>0.01%</span>
              </InfoItem>
              <InfoItem>
                <span>Leverage Rate (L)</span>
                <span>10</span>
              </InfoItem>
              <InfoItem>
                <span>Min Margin Ratio (Dmin)</span>
                <span>0.03</span>
              </InfoItem>
            </div>
          </Contianer>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
