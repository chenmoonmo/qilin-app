import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Dialog } from '@qilin/component';
import {
  foramtPrecent,
  formatAmount,
  formatInput,
  formatPrice,
} from '@qilin/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { type Address, useAccount, useBalance } from 'wagmi';

import {
  useAddLiquidity,
  useCreatePool,
  useOracles,
  usePoolFromOracle,
} from '@/hooks';

import { PoolSelector } from './PoolSelector';
import { StepDialog } from './StepDialog';
import { TextWithDirection } from './TextWithDirection';
import { TokenIcon } from './TokenIcon';

type AddLiquidityDialogPropsType = {
  children: React.ReactNode;
  assetAddress?: Address;
  tokenAddress?: Address;
  poolAddress?: Address;
  oracleAddress?: Address;
  onSuccess: () => void;
};

const Content = styled(Dialog.Content)`
  width: 858px;
  max-width: 858px;
  border-radius: 10px;
  border: 2px solid #323640;
  background: #262930;
  overscroll-behavior: contain;
`;

const Title = styled(Dialog.Title)`
  display: flex;
  align-items: center;
  svg {
    width: 10px;
    height: 16px;
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
    font-size: 16px;
    font-family: PT Mono;
    font-weight: 700;
    &::placeholder {
      color: #737884;
    }
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
  oracleAddress,
  tokenAddress,
  assetAddress,
  poolAddress,
  onSuccess,
}) => {
  const { address } = useAccount();
  const [open, setOpen] = useState(false);
  const [stepOpen, setStepOpen] = useState(false);

  const [activeStep, setActiveStep] = useState(0);

  const [poolIndex, setPoolIndex] = useState<string | undefined>();
  const [amount, setAmount] = useState('');

  const {
    data: oraclesList,
    searchInfo,
    setSearchInfo,
    currentItem,
  } = useOracles(poolIndex);

  const { data: poolParam } = usePoolFromOracle({
    poolAddress: poolAddress,
    assetAddress: assetAddress,
    oracleAddress: currentItem?.oracleAddress,
    tokenAddress: currentItem?.tokenAddress,
    // enabled: open,
  });

  const { data: LPToken } = useBalance({
    token: poolParam?.lp,
    enabled: !!poolParam?.lp,
    address,
  });

  const share = useMemo(() => {
    if (!poolParam || !LPToken) {
      return undefined;
    }
    const { LPAmount, LPPrice } = poolParam;

    const addLPAmount = +amount / LPPrice;

    const totalLP = LPAmount + addLPAmount;

    const totalUserLP = +LPToken?.formatted + addLPAmount;

    return Math.min(totalUserLP / totalLP, 1);
  }, [LPToken, amount, poolParam]);

  // if has poolParam, means the pool is exist
  const isNewPool = useMemo(() => {
    return !poolParam;
  }, [poolParam]);

  const {
    handleAddLiquidty,
    isNeedApprove,
    steps: addLiquiditySteps,
  } = useAddLiquidity({
    marginTokenAddress: currentItem?.tokenAddress,
    assetAddress: poolParam?.assetAddress,
    amount,
  });

  const { handleCreatePool, steps } = useCreatePool({
    oracleAddress: currentItem?.oracleAddress,
    tokenAddress: currentItem?.tokenAddress,
    amount,
  });

  const { data: marginTokenInfo } = useBalance({
    token: currentItem?.tokenAddress,
    enabled: false,
    address,
  });

  const marginToken = useMemo(
    () => (currentItem?.tokenAddress ? marginTokenInfo : undefined),
    [currentItem?.tokenAddress, marginTokenInfo]
  );

  const titleText = useMemo(() => {
    if (!isNewPool) {
      return 'Add Liquidity';
    } else {
      return 'New Position';
    }
  }, [isNewPool]);

  const buttonText = useMemo(() => {
    if (!isNewPool) {
      return 'Add Liquidity';
    } else {
      return 'Create a pool';
    }
  }, [isNewPool]);

  const currentSteps = useMemo(() => {
    if (!isNewPool) {
      return addLiquiditySteps;
    } else {
      return steps;
    }
  }, [addLiquiditySteps, isNewPool, steps]);

  const enableSubmit = useMemo(() => {
    return (
      poolIndex &&
      amount &&
      +amount > 0 &&
      +amount <= +(marginToken?.formatted ?? 0)
    );
  }, [amount, marginToken?.formatted, poolIndex]);

  const handleSuccess = useCallback(() => {
    onSuccess?.();
    setOpen(false);
    setStepOpen(false);
  }, [onSuccess]);

  const handleSubmit = useCallback(async () => {
    setActiveStep(0);
    if (isNewPool) {
      setStepOpen(true);
      setOpen(false);
      await handleCreatePool();
      setActiveStep(1);
    } else {
      if (isNeedApprove) {
        setStepOpen(true);
        setOpen(false);
      }
      await handleAddLiquidty();
      if (isNeedApprove) {
        setActiveStep(1);
      } else {
        handleSuccess();
      }
    }
  }, [
    handleAddLiquidty,
    handleCreatePool,
    handleSuccess,
    isNeedApprove,
    isNewPool,
  ]);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  useEffect(() => {
    if (
      oracleAddress &&
      tokenAddress &&
      oraclesList.length &&
      poolIndex === undefined
    ) {
      const index = oraclesList.findIndex(
        item =>
          item.oracleAddress === oracleAddress &&
          item.tokenAddress === tokenAddress
      );

      if (index !== -1) {
        setPoolIndex(index.toString());
      }
    }
  }, [oraclesList, oracleAddress, poolIndex, tokenAddress]);

  return (
    <>
      <Dialog.Root open={open} onOpenChange={handleOpenChange}>
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
              {titleText}
            </Title>
            <Contianer>
              <div>
                <SubTitle>Select Oracle</SubTitle>
                <PoolSelector
                  disabled
                  selections={[{ text: 'chainlink', value: 'chainlink' }]}
                  value="chainlink"
                />
                <SubTitle
                  css={css`
                    margin-top: 20px;
                  `}
                >
                  Select Pool
                </SubTitle>
                <PoolSelector
                  value={poolIndex}
                  selections={oraclesList}
                  onValueChange={(item: any) => setPoolIndex(item.value)}
                  searchInfo={searchInfo}
                  onSearchInfoChange={setSearchInfo}
                />
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
                      disabled={!marginToken}
                      onClick={() =>
                        setAmount(formatInput(marginToken!.formatted))
                      }
                    >
                      Max
                    </MaxButton>
                    <TokenInfo>
                      <TokenIcon size={26} src={currentItem?.marginTokenIcon} />
                      <TokenSymbol>{marginToken?.symbol ?? '-'}</TokenSymbol>
                    </TokenInfo>
                  </div>
                </AmountInput>
                <SubmitButton disabled={!enableSubmit} onClick={handleSubmit}>
                  {buttonText}
                </SubmitButton>
              </div>
              <div>
                <SubTitle>Select Oracle</SubTitle>
                <InfoItem>
                  <span>Liquidity</span>
                  <span>
                    {formatAmount(poolParam?.liquidity)} {marginToken?.symbol}
                    {poolParam?.liquidityValue && (
                      <>($ {formatAmount(poolParam?.liquidityValue)})</>
                    )}
                  </span>
                </InfoItem>
                <InfoItem>
                  <span>LP Price</span>
                  <span>
                    {formatPrice(poolParam?.LPPrice)} {marginToken?.symbol}
                  </span>
                </InfoItem>
                <InfoItem>
                  <span>APY</span>
                  <TextWithDirection>
                    {poolParam?.apy === undefined
                      ? '-'
                      : `${foramtPrecent(poolParam?.apy)}%`}
                  </TextWithDirection>
                </InfoItem>
                <InfoItem>
                  <span>Share Of Pool</span>
                  <span>{share ? `${foramtPrecent(share * 100)}%` : '-'}</span>
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
                  <span>
                    {poolParam?.feeRatio === undefined
                      ? '-'
                      : `${foramtPrecent(poolParam?.feeRatio)}%`}
                  </span>
                </InfoItem>
                <InfoItem>
                  <span>Leverage Rate (L)</span>
                  <span>
                    {poolParam?.assetLevel === undefined
                      ? '-'
                      : `${foramtPrecent(poolParam?.assetLevel)}`}
                  </span>
                </InfoItem>
                <InfoItem>
                  <span>Min Margin Ratio (Dmin)</span>
                  <span>
                    {poolParam?.marginRatio === undefined
                      ? '-'
                      : `${foramtPrecent(poolParam?.marginRatio)}%`}
                  </span>
                </InfoItem>
              </div>
            </Contianer>
          </Content>
        </Dialog.Portal>
      </Dialog.Root>
      <StepDialog
        title={titleText}
        steps={currentSteps}
        open={stepOpen}
        activeStep={activeStep}
        onActiveStepChange={setActiveStep}
        onOpenChange={setStepOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
};
