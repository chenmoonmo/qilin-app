import styled from '@emotion/styled';
import { Button } from '@qilin/component';
import { formatAmount } from '@qilin/utils';
import Link from 'next/link';
import type { FC, ReactNode } from 'react';
import { useMemo } from 'react';

export const PositionInfoContainer = styled.div`
  margin-top: 16px;
  padding: 20px;
  border: 1px solid rgba(139, 162, 212, 0.5);
  border-radius: 6px;
`;

export const RoomInfo = styled.div`
  display: flex;
  align-items: center;
  > div:not(:first-of-type) {
    position: relative;
    margin-left: 20px;
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: -10px;
      width: 1px;
      height: 10px;
      background: #d9d9d9;
      transform: translateY(-50%);
    }
  }
`;

export const Pair = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 12px;
`;

// 仓位方向
export const PositionDirection = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 12px;
  &[data-type='long'] {
    color: #4bd787;
  }
  &[data-type='short'] {
    color: #f45e68;
  }
`;

export const PositionSize = styled.div<{
  leverage: number;
}>`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 12px;
  &::after {
    content: ${props => `'${props.leverage}x'`};
    display: block;
    margin-left: 10px;
    padding: 0 2px;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    background: rgba(83, 97, 147, 0.5);
    border-radius: 2px;
  }
`;

export const PNLInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 70px;
  svg {
    cursor: pointer;
  }
`;

export const PNLInfo = styled.div<{ children: ReactNode }>`
  display: ${props => {
    const pnl = props.children?.toString();
    return pnl ? 'flex' : 'none';
  }};
  align-items: center;
  font-style: normal;
  font-weight: 600;
  font-size: 36px;
  margin-right: 20px;
  color: ${props => {
    const pnl = props.children?.toString();
    if (pnl === 'Not joined') {
      return '#4bd787';
    }
    if (pnl === '-') {
      return '#FFFFFF';
    }
    return pnl?.startsWith('-') ? '#f45e68' : '#4bd787';
  }};
  &::before {
    content: ${props => {
      const pnl = props.children?.toString();
      if (pnl === '-' || !pnl) {
        return null;
      }
      if (!pnl?.startsWith('-') && pnl !== 'Not Joined') {
        return `"+"`;
      }
    }};
  }
`;

export const PriceInfo = styled.div`
  margin-top: 53px;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
`;

export const PriceItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:not(:first-of-type) {
    margin-top: 10px;
  }
`;

export const NotOpen = styled.div`
  margin: 80px 0 0;
  text-align: center;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 20px;
`;

NotOpen.defaultProps = {
  children: 'Not Open',
};

export const TimerTitle = styled.div`
  margin-top: 48px;
  margin-bottom: 23px;
  text-align: center;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 20px;
`;

// Open price 相关
export const PairInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 20px;
  margin: 36px 0 24px;
  border: 1px solid rgba(139, 162, 212, 0.5);
  border-radius: 6px;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 12px;
`;

export const OpenPositionOuter = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
`;

export const OpenPositionForm = styled.div`
  width: 100%;
  padding: 14px 20px;
  border: 1px solid rgba(139, 162, 212, 0.5);
  border-radius: 6px;
`;

export const OpenPositionFormItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 12px;
  color: #ffffff;
  &:not(:first-of-type) {
    margin-top: 12px;
  }
  > :last-child {
    width: 340px;
  }
`;

export const MarginInputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #536193;
  border-radius: 2px;
  white-space: nowrap;
  input {
    font-weight: 600;
    font-size: 16px;
    line-height: 12px;
  }
  > div {
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 12px;
    text-align: right;
    > div:last-of-type {
      font-style: normal;
      font-weight: 500;
      font-size: 10px;
      line-height: 20px;
      color: rgba(255, 255, 255, 0.8);
    }
  }
`;

export const FormButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const SubmitButton = styled(Button)`
  flex: 1;
  padding: 12px 0;
  margin-top: 24px;
  &:not(:first-of-type) {
    margin-left: 12px;
  }
`;

export const BackLink = styled(Link)`
  display: block;
  margin: 20px 0;
  cursor: pointer;
`;

export const PositionInfoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
  > div:last-of-type {
    color: #d0d0d0;
  }
`;

export const WhiteItemContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const WhiteItem = styled.input`
  width: 340px;
  height: 44px;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
  color: #d0d0d0;
  background: #536193;
  border-radius: 2px;
  &:not(:first-of-type) {
    margin-top: 10px;
  }
  &:last-of-type {
    margin-bottom: 44px;
  }
  &:focus-within {
    border: 1px solid var(--active-border-color);
  }
  &:disabled {
    background-color: var(--disabled-input-color);
  }
`;

export const WhiteTip = styled.div`
  margin-top: 8px;
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  color: #d0d0d0;
`;

export const MintButtonContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px 20px;
  background-color: #01144e;
  background-blend-mode: color-burn;
`;

export const MintButton = styled(Button)`
  width: 100%;
  height: 44px;
  flex-shrink: 0;
  &:disabled {
    background-color: #083288;
    color: rgba(255, 255, 255, 0.3);
    opacity: 1;
  }
`;

const PositionPercentContainer = styled.div<{
  long: number;
  short: number;
}>`
  display: flex;
  flex-shrink: 0;
  width: 100%;
  height: 24px;
  border-radius: 4px;
  overflow: hidden;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  > div {
    padding: 2px 12px;
    &:first-of-type {
      display: ${({ long, short }) => {
        return [long, short].every(item => item === 0)
          ? 'block'
          : long
          ? 'block'
          : 'none';
      }};
      flex: calc(
        ${({ long, short }) =>
            [long, short].every(item => item === 0) ? 50 : long}% - 2px
      );

      background: #4bd787;
    }
    &:nth-of-type(2) {
      padding: 0;
      width: 4px;
      background: #ffffff;
    }
    &:last-of-type {
      display: ${({ long, short }) => {
        return [long, short].every(item => item === 0)
          ? 'block'
          : short
          ? 'block'
          : 'none';
      }};
      flex: calc(
        ${({ long, short }) =>
            [long, short].every(item => item === 0) ? 50 : short}% - 2px
      );
      background: #f45e68;
      text-align: right;
    }
  }
`;

// 图例
const PositionChartLegend = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
  > div {
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: 12px;
    line-height: 20px;
    color: rgba(255, 255, 255, 0.8);
    &::before {
      content: '';
      display: block;
      width: 10px;
      height: 10px;
      background: #4bd787;
      border-radius: 2px;
    }
    &::after {
      content: 'Long';
      margin-left: 6px;
    }
    &:last-of-type {
      margin-left: 20px;
      &::before {
        background: #f45e68;
      }
      &::after {
        content: 'Short';
      }
    }
  }
`;

export const PositionPercent: FC<{
  longSize: number | string;
  shortSize: number | string;
}> = ({ longSize, shortSize }) => {
  const [longPercent, shortPrecent] = useMemo(() => {
    const total = +longSize + +shortSize;
    if (total === 0 || isNaN(total)) return [0, 0];
    return [(+longSize / total) * 100, (+shortSize / total) * 100];
  }, [longSize, shortSize]);

  return (
    <>
      <PositionPercentContainer long={longPercent} short={shortPrecent}>
        <div>{formatAmount(longPercent, 2)}%</div>
        <div></div>
        <div>{formatAmount(shortPrecent, 2)}%</div>
      </PositionPercentContainer>
      <PositionChartLegend>
        <div></div>
        <div></div>
      </PositionChartLegend>
    </>
  );
};

export const PositionsList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, max-content);
  grid-template-rows: repeat(6, max-content);
  justify-content: space-between;
  gap: 18px 0;
  padding: 14px 12px;
  margin-top: 24px;
  flex: 1;
  border: 1px solid rgba(139, 162, 212, 0.5);
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
  color: #d0d0d0;
`;

export const Size = styled.div<{
  leverage?: number;
  direction?: 'long' | 'short';
}>`
  display: flex;
  align-items: center;
  &::before {
    content: '';
    display: ${props => (props.direction ? 'block' : 'none')};
    width: 14px;
    height: 9px;
    margin-right: 8px;
    background-image: ${props => `url('/images/${props.direction}.png')`};
    background-repeat: no-repeat;
    background-size: contain;
  }
  &::after {
    content: ${props => `'${props.leverage}x'`};
    display: ${props => (props.leverage ? 'block' : 'none')};
    padding: 0 3px;
    margin-left: 4px;
    background: rgba(83, 97, 147, 0.5);
    border-radius: 2px;
    font-style: normal;
    font-weight: 500;
    font-size: 10px;
    line-height: 15px;
  }
`;

export const CloseContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  h1 {
    all: unset;
    display: flex;
    align-items: center;
    margin-bottom: 27px;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 12px;
    svg {
      width: 9px;
      height: 14px;
      margin-right: 10px;
      cursor: pointer;
    }
  }
`;

export const CloseCard = styled.div`
  padding: 20px 20px 80px;
  border: 1px solid rgba(139, 162, 212, 0.5);
  border-radius: 6px;
`;

export const CloseInfoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
  &:not(:first-of-type) {
    margin-top: 14px;
  }
  > div:first-of-type {
    color: #d0d0d0;
  }
`;

export const SplitLine = styled.div`
  width: 436px;
  height: 1px;
  margin-top: 19px;
  background-color: rgba(69, 95, 144, 0.6);
`;

export const CloseButton = styled(MintButton)`
  margin-top: 37px;
`;

export const XsPNLInfo = styled(PNLInfo)`
  margin-top: 12px;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 12px;
`;

export const PositionPNL = styled(PNLInfo)`
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
`;
