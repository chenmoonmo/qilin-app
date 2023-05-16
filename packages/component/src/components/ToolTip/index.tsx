import styled from '@emotion/styled';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import type { FC } from 'react';

type TooltipPropsType = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  text?: React.ReactNode;
};

const TriggerContainer = styled.span`
  display: inline-flex;
  align-items: center;
  button {
    display: inline-flex;
    align-items: center;
    margin-left: 4px;
    cursor: help;
  }
`;

const Content = styled(RadixTooltip.Content)`
  padding: 10px;
  border: 0.5px solid var(--tooltip-content-border-color);
  border-radius: 8px;
  font-size: 12px;
  line-height: 18px;
  color: #dbdde5;
  background: var(--tooltip-content-background-color);
`;

export const Tooltip: FC<TooltipPropsType> = ({ children, text, icon }) => {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root delayDuration={0}>
        {icon ? (
          <TriggerContainer>
            {children}
            <RadixTooltip.Trigger asChild>
              <button>{icon}</button>
            </RadixTooltip.Trigger>
          </TriggerContainer>
        ) : (
          <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        )}
        <RadixTooltip.Portal>
          <Content sideOffset={5} side="bottom">
            {text}
          </Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};
