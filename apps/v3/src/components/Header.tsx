'use client';
import styled from '@emotion/styled';
import Link from 'next/link';
import type { FC } from 'react';

type HeaderPropsType = {
  routes: Array<{
    path: string;
    name: string;
  }>;
};

const HeaderContainer = styled.header`
  display: grid;
  grid-template-columns: max-content max-content 1fr max-content max-content;
  align-items: center;
`;

const Logo = styled.div`
  grid-column: 1 / 2;
`;

const RoutesContainer = styled.div`
  grid-column: 2 / 3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  font-size: 16px;
  font-family: Poppins;
  font-weight: 500;
  color: #9699a3;
`;

const Route = styled(Link)<{ active?: boolean }>`
  text-decoration: none;
  color: #9699a3;
  &:hover {
    color: #6cb3ff;
  }
`;

const AddressContainer = styled.div`
  grid-column: 3 / 4;
`;

const More = styled.div`
  grid-column: 4/ 5;
`;

export const Header: FC<HeaderPropsType> = ({ routes }) => {
  return (
    <HeaderContainer>
      <Logo>QILIN</Logo>
      <RoutesContainer>
        {routes?.map(route => (
          <Route key={route.path} href={route.path}>
            {route.name}
          </Route>
        ))}
      </RoutesContainer>
      <AddressContainer></AddressContainer>
      <More>More</More>
    </HeaderContainer>
  );
};
