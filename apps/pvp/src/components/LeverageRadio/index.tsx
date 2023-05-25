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
  justify-content: space-between;
  margin-left: -17px;
`;

const Item = styled(RadioGroup.Item)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin-left: 17px;
  flex: 1;
  background: #2c2f38;
  border-radius: 6px;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 12px;
  cursor: pointer;
  &[data-state='checked'] {
    background: #464a56;
  }
  &:hover {
    background: #464a56;
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
