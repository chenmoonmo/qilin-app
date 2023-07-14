import styled from '@emotion/styled';
import { Button, Dialog } from '@qilin/component';
import { foramtPrecent, formatAmount, formatPrice } from '@qilin/utils';
import * as Slider from '@radix-ui/react-slider';
import { BigNumber } from 'ethers';
import { useMemo, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';

import { type useMyLiquidity, usePoolInfo, useRemoveLiquidity } from '@/hooks';

import { TokenIcon } from './TokenIcon';

type RemoveLiquidityDialogPropsType = {
  children: React.ReactNode;
  data: ReturnType<typeof useMyLiquidity>['data'][number];
  onSuccess: () => void;
};

const Content = styled(Dialog.Content)`
  border-radius: 10px;
  border: 2px solid #323640;
  background: #262930;
  z-index: 10;
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

const PoolInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
  font-size: 12px;
  font-weight: 500;
`;

const AmountPrecent = styled.div`
  margin-top: 8px;
  padding: 6px 12px 26px;
  border-radius: 6px;
  background: #2c2f38;
  h1 {
    all: unset;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    color: #737884;
    font-size: 12px;
    line-height: 18px;
  }
`;

const PrecentValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
  span {
    font-size: 24px;
    font-family: PT Mono;
    font-weight: 700;
  }
`;

const PrecentRadioContainer = styled.div`
  display: flex;
  align-items: center;
`;

const PrecentRadio = styled.div<{ active: boolean }>`
  padding: 5px 10px;
  border-radius: 100px;
  background: ${props => (props.active ? '#0083FF' : '#464a56')};
  color: ${props => (props.active ? '#fff' : '#828792')};
  font-size: 12px;
  line-height: 18px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease-in-out;
  &:not(:last-child) {
    margin-right: 6px;
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  height: 40px;
  margin-top: 34px;
`;

const SliderRoot = styled(Slider.Root)`
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 16px;
  user-select: none;
  touch-action: none;
  width: 100%;
  height: 14px;
`;

const SliderTrack = styled(Slider.Track)`
  background-color: #464a56;
  position: relative;
  flex-grow: 1;
  border-radius: 100px;
  height: 6px;
`;

const SliderRange = styled(Slider.Range)`
  position: absolute;
  background-color: #0083ff;
  border-radius: 9999px;
  height: 100%;
`;

const SliderThumb = styled(Slider.Thumb)`
  box-sizing: content-box;
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 8px;
  background: #fff;
  border: 3px solid #0083ff;
  cursor: pointer;
`;

const LpAmount = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
  padding: 32px 12px 12px;
  border-radius: 6px;
  background: #2c2f38;
  > span {
    font-size: 24px;
    font-family: PT Mono;
    font-weight: 700;
    color: #737884;
  }
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: 50%;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    border: 2px solid #1f2127;
    background: #2c2f38;
    transform: translate(-50%, -50%);
    background-image: url('/images/arrow-down.svg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 12px;
  }
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

const SubTitle = styled.div`
  margin-top: 14px;
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
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

export const RemoveLiquidityDialog: React.FC<
  RemoveLiquidityDialogPropsType
> = ({ children, data, onSuccess }) => {
  const { address } = useAccount();
  const [open, setOpen] = useState(false);
  const [precent, setPrecent] = useState(50);

  const { data: poolInfo } = usePoolInfo({
    assetAddress: data.assetAddress,
    poolAddress: data.poolAddress,
    enabled: open,
  });

  const { data: LPToken } = useBalance({
    token: poolInfo?.LPAddress,
    address,
  });

  const shareWillRemove = useMemo(() => {
    return (data.share * precent) / 100;
  }, [data.share, precent]);

  const marginAmount = useMemo(() => {
    return (
      ((+(LPToken?.formatted ?? 0) * precent) / 100) * (poolInfo?.LPPrice ?? 1)
    );
  }, [LPToken?.formatted, poolInfo?.LPPrice, precent]);

  const LPAmount = useMemo(() => {
    return LPToken?.value
      ? LPToken.value.mul(precent).div(100)
      : BigNumber.from(0);
  }, [LPToken?.value, precent]);

  const { isNeedApprove, handleRemoveLiquidity } = useRemoveLiquidity(
    data.assetAddress,
    poolInfo?.LPAddress,
    LPAmount,
    onSuccess
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
            Remove Liquidity
          </Title>
          <div>
            <PoolInfo>
              <span>Pool</span>
              <span>{data?.name}</span>
            </PoolInfo>
            <AmountPrecent>
              <h1>
                <span>Remove Amount</span>
                <span>Balance: {formatAmount(LPToken?.formatted)}</span>
              </h1>
              <PrecentValue>
                <span>{precent}%</span>
                <PrecentRadioContainer>
                  <PrecentRadio
                    active={precent === 25}
                    onClick={() => setPrecent(25)}
                  >
                    25%
                  </PrecentRadio>
                  <PrecentRadio
                    active={precent === 50}
                    onClick={() => setPrecent(50)}
                  >
                    50%
                  </PrecentRadio>
                  <PrecentRadio
                    active={precent === 75}
                    onClick={() => setPrecent(75)}
                  >
                    75%
                  </PrecentRadio>
                  <PrecentRadio
                    active={precent === 100}
                    onClick={() => setPrecent(100)}
                  >
                    100%
                  </PrecentRadio>
                </PrecentRadioContainer>
              </PrecentValue>
              <SliderRoot
                value={[precent]}
                defaultValue={[50]}
                max={100}
                step={1}
                onValueChange={value => setPrecent(value[0])}
              >
                <SliderTrack>
                  <SliderRange></SliderRange>
                </SliderTrack>
                <SliderThumb></SliderThumb>
              </SliderRoot>
            </AmountPrecent>
            <LpAmount>
              <span>{formatAmount(marginAmount)}</span>
              <TokenInfo>
                <TokenIcon size={26} />
                <TokenSymbol>{poolInfo?.marginTokenSymbol}</TokenSymbol>
              </TokenInfo>
            </LpAmount>
            <SubTitle>Summary</SubTitle>
            <InfoItem>
              <span>Lp Price</span>
              <span>
                {formatPrice(poolInfo?.LPPrice)} {poolInfo?.marginTokenSymbol}
              </span>
            </InfoItem>
            <InfoItem>
              <span>Share Of Pool</span>
              <span>{foramtPrecent(shareWillRemove)}%</span>
            </InfoItem>
            <SubmitButton
              disabled={precent === 0}
              onClick={() => {
                handleRemoveLiquidity();
                setOpen(false);
              }}
            >
              {isNeedApprove ? 'Approve' : 'Remove Liquidity'}
            </SubmitButton>
          </div>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
