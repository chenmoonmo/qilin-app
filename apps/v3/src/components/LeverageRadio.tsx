import styled from '@emotion/styled';
import * as RadioGroup from '@radix-ui/react-radio-group';
import type { FC } from 'react';

type LeverageRadioType = {
  value?: string;
  leverages?: string[];
  onChange?: (value: string) => void;
};

const Root = styled(RadioGroup.Root)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #2c2f38;
  border-radius: 6px;
  overflow: hidden;
`;

const Item = styled(RadioGroup.Item)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  flex: 1;
  font-size: 12px;
  font-weight: 500;
  color: #737884;
  cursor: pointer;
  &[data-state='checked'],
  &:hover {
    background: #464a56;
    color: #ffffff;
  }
`;

export const LeverageRadio: FC<LeverageRadioType> = ({
  value,
  leverages = ['2', '5', '10'],
  onChange,
}) => {
  return (
    <Root value={value} onValueChange={onChange} defaultValue={leverages[0]}>
      {leverages.map(value => (
        <Item key={value} value={value}>
          {value}x
        </Item>
      ))}
    </Root>
  );
};
