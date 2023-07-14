import styled from '@emotion/styled';
import * as Tabs from '@radix-ui/react-tabs';

export const TabRoot = Tabs.Root;

export const TabList = styled(Tabs.List)`
  font-size: 14px;
  font-weight: 500;
  color: #9699a3;
`;

export const TabTrigger = styled(Tabs.Trigger)`
  padding: 28px 0 24px 0;
  font-size: 14px;
  font-weight: 500;
  color: #9699a3;
  &:not(:first-of-type) {
    margin-left: 30px;
  }
  &[data-state='active'] {
    color: #e0e0e0;
  }
`;

export const TabContent = Tabs.Content;
