import styled from '@emotion/styled';
import { formatAmount } from '@qilin/utils';
import { AllHTMLAttributes, FC, useMemo } from 'react';

const StakePrice = styled.div`
  display: flex;
  width: max-content;
  margin: auto;
  padding: 4px 12px;
  background: #464a56;
  border-radius: 100px;
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 15px;
  zoom: 0.84;
`;

const PostionRate = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 74px;
  height: 74px;
  border: 3px solid #44c27f;
  border-radius: 50%;
  background: #1f2127;
  background: radial-gradient(rgba(68, 194, 127, 0.4) 28px, #1f2127 9px),
    #1f2127;
  transform: translate(-50%, -58%);
  font-style: normal;
  font-weight: 400;
  font-size: 8px;
  line-height: 12px;
  > div:nth-of-type(1) {
    margin-bottom: 5px;
    font-family: 'Impact';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 12px;
  }
`;

const OpponentItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 5px 0;
  background-color: rgba(68, 194, 127, 0.4);
  border-radius: 100px;

  &:nth-of-type(2) {
    background: rgba(225, 92, 72, 0.4);
    ${PostionRate} {
      left: unset;
      right: 0;
      transform: translate(50%, -58%);
      border-color: #e15c48;
      background: radial-gradient(rgba(225, 92, 72, 0.4) 28px, #1f2127 9px),
        #1f2127;
    }
  }
  > div:nth-of-type(1) {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 12px;
    color: #ffffff;
  }
  > div:nth-of-type(2) {
    margin-top: 2px;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 12px;
    color: #9d9d9d;
    zoom: 0.66;
  }
`;

const OpponentContainer = styled.div`
  display: flex;
  padding: 0 30px;
  margin-top: 6px;
`;

type OpponentInfoPropsType = {
  marginTokenSymbol?: string;
  stakePrice: number;
  long?: number;
  short?: number;
} & AllHTMLAttributes<HTMLDivElement>;

export const OpponentInfo: FC<OpponentInfoPropsType> = ({
  long = 0,
  short = 0,
  marginTokenSymbol,
  stakePrice,
  ...props
}) => {
  const [longPrecent, shortPrecent] = useMemo(() => {
    let longPrecent = (long / (long + short)) * 100;
    let shortPrecent = (short / (long + short)) * 100;
    // 排除NaN
    if (isNaN(longPrecent)) {
      longPrecent = 0;
    }
    if (isNaN(shortPrecent)) {
      shortPrecent = 0;
    }
    return [longPrecent, shortPrecent];
  }, [long, short]);

  return (
    <div {...props}>
      <StakePrice>
        Stake Price: {formatAmount(stakePrice)} {marginTokenSymbol}
      </StakePrice>
      <OpponentContainer>
        <OpponentItem>
          <div>{formatAmount(long)} LP</div>
          <div>{formatAmount(long * stakePrice)} USDC</div>
          <PostionRate>
            <div>{formatAmount(longPrecent, 2)}%</div>
            <div>Long</div>
          </PostionRate>
        </OpponentItem>
        <OpponentItem>
          <div>{formatAmount(short)} LP</div>
          <div>{formatAmount(short * stakePrice)} USDC</div>
          <PostionRate>
            <div>{formatAmount(shortPrecent, 2)}%</div>
            <div>Short</div>
          </PostionRate>
        </OpponentItem>
      </OpponentContainer>
    </div>
  );
};
