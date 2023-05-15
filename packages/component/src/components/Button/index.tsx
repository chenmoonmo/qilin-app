import styled from '@emotion/styled';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

type ButtonPropsType = {
  as?: React.ElementType;
  children: ReactNode;
} & ButtonHTMLAttributes<any>;

const StyledBotton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  background: #2e71ff;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: #fff;
  border-radius: 6px;
  user-select: none;
  cursor: pointer;
  :hover {
    background-color: #4580fe;
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
