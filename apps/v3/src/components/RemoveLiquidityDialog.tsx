import styled from '@emotion/styled';
import { Button, Dialog } from '@qilin/component';
import { formatAmount, formatPrice } from '@qilin/utils';
import * as Slider from '@radix-ui/react-slider';
import { addSeconds } from 'date-fns';
import dayjs from 'dayjs';
import { BigNumber } from 'ethers';
import { useMemo, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';

import { useApplyRemove, type useMyLiquidity, usePoolInfo } from '@/hooks';

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
  font-size: 12px;
  font-weight: 500;
  margin-top: 5px;
  &:first-of-type {
    margin-top: 20px;
  }
`;

const AmountPrecent = styled.div`
  margin: 15px 0;
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
`;

const Note = styled.div`
  margin: 23px 0 9px;
  color: #737884;
  font-size: 12px;
  font-weight: 500;
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

  const [epochNumber, epochEndTimeDate] = useMemo(() => {
    if (!poolInfo) return ['-', '-'];
    let epoch = 1;

    const { epochEndTime, epochCycle } = data;
    const { spotPrice, futurePrice, priceThresholdRatio } = poolInfo;
    const priceDiff = (futurePrice - spotPrice) / spotPrice;

    if (priceDiff >= priceThresholdRatio) {
      epoch = 3;
    } else if (priceDiff >= priceThresholdRatio / 2) {
      epoch = 2;
      // } else if (priceDiff >= 0) {
    } else {
      epoch = 1;
    }

    const epochEndTimeDate = addSeconds(
      new Date(epochEndTime * 1000),
      epoch * epochCycle
    ).valueOf();

    return [
      epoch,
      dayjs(epochEndTimeDate).utc().format('YYYY.MM.DD HH:mm:ss UTC'),
    ];
  }, [data, poolInfo]);

  // const shareWillRemove = useMemo(() => {
  //   return (data.share * precent) / 100;
  // }, [data.share, precent]);

  const marginAmount = useMemo(() => {
    return (
      ((+(LPToken?.formatted ?? 0) * precent) / 100) * (data?.LPPrice ?? 1)
    );
  }, [LPToken?.formatted, data?.LPPrice, precent]);

  const LPAmount = useMemo(() => {
    return LPToken?.value
      ? LPToken.value.mul(precent).div(100)
      : BigNumber.from(0);
  }, [LPToken?.value, precent]);

  // const { isNeedApprove, handleRemoveLiquidity } = useRemoveLiquidity(
  //   data.assetAddress,
  //   poolInfo?.LPAddress,
  //   LPAmount,
  //   onSuccess
  // );

  const { isNeedApprove, handleApplyRemove } = useApplyRemove({
    assetAddress: data.assetAddress,
    LPTokenAddress: poolInfo?.LPAddress,
    amount: LPAmount,
    onSuccess,
  });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Content>
          <Dialog.Close asChild>
            <Dialog.CloseIcon />
          </Dialog.Close>
          <Title>Withdrawal Request</Title>
          <div>
            <PoolInfo>
              <span>Pool</span>
              <span>{data?.name}</span>
            </PoolInfo>
            <PoolInfo>
              <span>Current wait period</span>
              {/* TODO: 计算期限价差和 epochs */}
              <span>
                {epochNumber}{' '}
                {epochNumber !== '-' && +epochNumber > 1 ? 'epochs' : 'epoch'}
              </span>
            </PoolInfo>
            <PoolInfo>
              <span>Withdraw date</span>
              {/* TODO: 计算期限价差和 epochs 结束时间 */}
              <span>{epochEndTimeDate}</span>
            </PoolInfo>
            <PoolInfo>
              <span>Amount</span>
              <span>Balance: {formatAmount(LPToken?.formatted)}</span>
            </PoolInfo>
            <AmountPrecent>
              {/* <h1>
                <span>Remove Amount</span>
                <span>Balance: {formatAmount(LPToken?.formatted)}</span>
              </h1> */}
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
            <PoolInfo>
              <span>Current value</span>
              <span>
                {formatAmount(marginAmount)} {poolInfo?.marginTokenSymbol}
              </span>
            </PoolInfo>
            <PoolInfo>
              <span>Lp Price</span>
              <span>
                {formatPrice(data?.LPPrice)} {poolInfo?.marginTokenSymbol}
              </span>
            </PoolInfo>
            <Note>Note: Position value calculated at withdrawal time.</Note>
            <SubmitButton
              disabled={precent === 0}
              onClick={() => {
                handleApplyRemove();
                setOpen(false);
              }}
            >
              {isNeedApprove ? 'Approve' : 'Request'}
            </SubmitButton>
          </div>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
