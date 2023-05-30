import styled from '@emotion/styled';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef, useMemo } from 'react';

type ButtonPropsType = {
  backgroundColor?: string;
  as?: React.ElementType;
  children: ReactNode;
  onDisabledClick?: () => void;
} & ButtonHTMLAttributes<any>;

const StyledBotton = styled.button<{ backgroundColor?: string }>`
  --background: ${props => props.backgroundColor ?? '#2e71ff'};
  box-sizing: border-box;
  display: inline-flex;
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
  &[data-disabled='true'],
  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
`;

export const Button = forwardRef<HTMLButtonElement, ButtonPropsType>(
  (
    { as = 'button', children, disabled, onDisabledClick, onClick, ...props },
    ref
  ) => {
    const actionProps = useMemo(() => {
      if (disabled && onDisabledClick) {
        return {
          ['data-disabled']: disabled,
          onClick: (e: any) => {
            if (disabled) {
              e.preventDefault();
              onDisabledClick();
              return;
            }
            onClick?.(e);
          },
        };
      } else {
        return {
          onClick,
          disabled,
        };
      }
    }, [disabled, onDisabledClick, onClick]);

    return (
      <StyledBotton as={as} {...props} {...actionProps} ref={ref}>
        {children}
      </StyledBotton>
    );
  }
);

Button.displayName = 'Button';
