import styled from '@emotion/styled';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

type ButtonPropsType = {
  backgroundColor?: string;
  as?: React.ElementType;
  children: ReactNode;
} & ButtonHTMLAttributes<any>;

const StyledBotton = styled.button<{ backgroundColor?: string }>`
  --background: ${props => props.backgroundColor ?? '#2e71ff'};
  box-sizing: border-box;
  display: inline-flex;;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  background: var(--background);
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: #fff;
  border-radius: 6px;
  user-select: none;
  cursor: pointer;
  &:disabled {
    opacity: 0.3;
  }
`;

export const Button = forwardRef<HTMLButtonElement, ButtonPropsType>(
  ({ as = 'button', children, ...props }, ref) => {
    return (
      <StyledBotton as={as} {...props} ref={ref}>
        {children}
      </StyledBotton>
    );
  }
);

Button.displayName = 'Button';
