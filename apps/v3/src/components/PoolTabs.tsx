import styled from '@emotion/styled';
import * as Tabs from '@radix-ui/react-tabs';

export const PoolTabRoot = Tabs.Root;

export const PoolTabList = styled(Tabs.List)`
  border-radius: 4px;
  background: #262930;
  max-width: max-content;
`;

export const PoolTabTrigger = styled(Tabs.Trigger)`
  padding: 5px 27px;
  font-size: 12px;
  font-weight: 400;
  border-radius: 4px;
  &[data-state='active'] {
    background: #0083ff;
  }
`;

export const PoolTabContent = Tabs.Content;
