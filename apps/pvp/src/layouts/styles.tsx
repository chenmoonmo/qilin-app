import styled from '@emotion/styled';
import Link from 'next/link';

export const Header = styled.header`
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: var(--background-color);
`;

export const MenuItem = styled(Link)`
  all: unset;
  font-style: normal;
  font-weight: 500;
  font-size: var(--text-xl);
  line-height: 24px;
  margin-left: 40px;
  color: #9699a3;
  cursor: pointer;
  &:hover,
  &[data-active='true'] {
    color: #fff;
  }
`;

export const ChainInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid #363a45;
  border-radius: 6px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  color: #737884;
`;
