import styled from '@emotion/styled';
import * as RadioGroup from '@radix-ui/react-radio-group';
import type { FC } from 'react';

type SwapRadioPropsType = {
  value?: string;
  onChange?: (value: string) => void;
};

const Root = styled(RadioGroup.Root)`
  display: flex;
  background: #2c2f38;
  border-radius: 6px;
  overflow: hidden;
  font-size: 14px;
  font-weight: 400;
  color: #737884;
`;

const Item = styled(RadioGroup.Item)`
  flex: 1;
  padding: 10px 0 8px;
  text-align: center;
  border-radius: 6px;

  &:first-of-type[data-state='checked'] {
    background: #44c27f;
    color: #fff;
  }
  &:last-of-type[data-state='checked'] {
    background: #e15c48;
    color: #fff;
  }
`;

export const SwapRadio: FC<SwapRadioPropsType> = ({ value, onChange }) => {
  return (
    <Root value={value} onValueChange={onChange}>
      <Item value="1">Long</Item>
      <Item value="2">Short</Item>
    </Root>
  );
};
