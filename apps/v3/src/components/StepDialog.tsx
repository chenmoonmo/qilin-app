import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Dialog } from '@qilin/component';
import type { FC } from 'react';
import { useCallback, useMemo, useState } from 'react';

import { Step } from './Step';

type StepDialogProps = {
  title: string;
  steps: {
    title: string;
    buttonText: string;
    onClick: () => void;
  }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSettled?: () => void;
  defaultStep?: number;
};
const Content = styled(Dialog.Content)`
  width: 858px;
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

const StepButton = styled(Button)`
  margin-top: 17px;
  width: 100%;
  height: 40px;
  border-radius: 6px;
  background: #0083ff;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #ffffff;
`;

export const StepDialog: FC<StepDialogProps> = ({
  title,
  open,
  steps,
  defaultStep,
  onOpenChange,
  onSettled,
}) => {
  const [activeStep, setActiveStep] = useState(defaultStep ?? 0);

  const currentHandle = useCallback(async () => {
    await steps[activeStep].onClick();
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      setTimeout(() => {
        onOpenChange(false);
        onSettled?.();
      }, 2000);
    }
  }, [activeStep, onOpenChange, onSettled, steps]);

  const currentButtonText = useMemo(
    () => steps[activeStep].buttonText,
    [activeStep, steps]
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
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
            <div>{title}</div>
          </Title>
          <Step
            css={css`
              margin-top: 37px;
            `}
            steps={steps}
            activeStep={activeStep}
          />
          <StepButton onClick={currentHandle}>{currentButtonText}</StepButton>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
