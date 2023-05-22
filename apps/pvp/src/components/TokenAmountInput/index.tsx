import styled from '@emotion/styled';
import type { FC, HtmlHTMLAttributes } from 'react';

type TokenAmountInputContainerPropsType = {
  maxShow?: boolean;
} & Omit<HtmlHTMLAttributes<HTMLDivElement>, 'onChange'>;

type TokenAmountInputPropsType = TokenAmountInputContainerPropsType & {
  value?: string;
  disabled?: boolean;
  symbol?: string;
  onChange?: (value: string) => void;
  onMaxClick?: () => void;
};

const MaxButton = styled.button`
  position: absolute;
  right: 68px;
  top: 50%;
  padding: 5px 4px;
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  background: #464a56;
  border-radius: 6px;
  transform: translate(0, -50%);
  cursor: pointer;
  user-select: none;
  color: #9699a3;
`;

const TokenAmountInputRoot = styled.div<TokenAmountInputContainerPropsType>`
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: stretch;
  border: 1px solid #363a45;
  border-radius: 6px;
  background-color: #242730;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 12px;
  &:active,
  &:focus-within {
    border-color: #636363;
  }

  input {
    flex: auto;
    padding: 14px;
  }
  label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 54px;
    padding: 0 17px;
    color: #9699a3;
    border-left: 1px solid #363a45;
    cursor: text;
  }
  ${MaxButton} {
    display: ${({ maxShow }) => (maxShow ? 'block' : 'none')};
  }
`;

export const TokenAmountInput: FC<TokenAmountInputPropsType> = ({
  value,
  onChange,
  disabled,
  symbol,
  onMaxClick,
  ...props
}) => {
  return (
    <TokenAmountInputRoot {...props}>
      <input
        id={symbol}
        type="text"
        disabled={disabled}
        value={value}
        onChange={e => onChange?.(e.target.value)}
      />
      <MaxButton onClick={onMaxClick}>MAX</MaxButton>
      <label htmlFor={symbol}>{symbol}</label>
    </TokenAmountInputRoot>
  );
};
