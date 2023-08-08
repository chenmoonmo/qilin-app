import styled from '@emotion/styled';
import type { FC } from 'react';

type StepProps = {
  steps: {
    title: string;
    onClick: () => void;
  }[];
  activeStep: number;
  css?: any;
};

const Root = styled.div`
  padding: 12px 12px 16px;
  border-radius: 6px;
  background: #2c2f38;
`;

const StepInfos = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
`;

const StepInfo = styled.div`
  color: #737884;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 10px;
  > div:nth-of-type(2) {
    margin-top: 4px;
    font-size: 12px;
    font-weight: 500;
    line-height: 20px; /* 166.667% */
  }
  &[data-active='true'] {
    color: #ffffff;
  }
`;

const StepTrack = styled.div<{ value: number }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 6px;
  border-radius: 100px;
  background: #464a56;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: ${props => Math.min(props.value, 100)}%;
    height: 100%;
    border-radius: 100px;
    background: #0083ff;
    transition: width 0.3s ease-in-out;
  }
`;

const StepTrackItem = styled.div<{ index: number; length: number }>`
  position: absolute;
  top: 50%;
  left: ${props => {
    if (props.index === 0) {
      return '24px';
    }
    if (props.index === props.length - 1) {
      return `calc(100% - 24px)`;
    }
    return `calc(100%  * ${props.index} / ${props.length - 1})`;
  }};
  width: 8px;
  height: 8px;
  border: 3px solid #737884;
  box-sizing: content-box;
  background: #fff;
  border-radius: 100%;
  transform: translate(-50%, -50%);
  z-index: 100;
  &[data-active='true'] {
    border-color: #0083ff;
  }
`;

export const Step: FC<StepProps> = ({ steps, activeStep, ...props }) => {
  return (
    <Root {...props}>
      <StepInfos>
        {steps.map((step, index) => (
          <StepInfo key={step.title} data-active={index < activeStep}>
            <div>Step {index + 1}</div>
            <div>{step.title}</div>
          </StepInfo>
        ))}
      </StepInfos>
      <StepTrack value={(100 / steps.length) * activeStep}>
        {steps.map((step, index) => (
          <StepTrackItem
            key={step.title}
            index={index}
            length={steps.length}
            data-active={index < activeStep}
          />
        ))}
      </StepTrack>
    </Root>
  );
};
