import styled from '@emotion/styled';
import type { FC, ReactNode } from 'react';

type ButtonPropsType = {
  as?: React.ElementType;
  children: ReactNode;
};

const StyledBotton = styled.button`
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

export const Button: FC<ButtonPropsType> = ({ as = 'button', children }) => {
  return <StyledBotton as={as}>{children}</StyledBotton>;
};
