'use client';
import styled from '@emotion/styled';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type FC } from 'react';

import { AccountInfo } from './AccountInfo';

type HeaderPropsType = {
  routes: Array<{
    path: string;
    name: string;
  }>;
};

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: max-content max-content 1fr max-content max-content;
  align-items: center;
  padding: 0 20px;
  z-index: 10;
  background: var(--background-color);
`;

const Logo = styled.svg`
  grid-column: 1 / 2;
  margin-right: 44.5px;
`;

const RoutesContainer = styled.div`
  grid-column: 2 / 3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-family: Poppins;
  font-weight: 500;
  color: #9699a3;
`;

const Route = styled(Link)<{ active?: boolean }>`
  padding: 20px 22.5px;
  text-decoration: none;
  color: #9699a3;
  cursor: pointer;
  user-select: none;
  &[data-active='true'],
  &:hover {
    color: #e0e0e0;
  }
  &[data-active='true'] {
    pointer-events: none;
  }
`;

const More = styled.a`
  grid-column: 5/ 6;
  display: flex;
  align-items: center;
  height: 33px;
  padding: 8px 12px;
  border: 1px solid #363a45;
  border-radius: 6px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  color: #737884;
  margin-left: 14px;
  cursor: pointer;
  box-sizing: border-box;
`;

More.defaultProps = {
  children: 'DOC',
};

export const Header: FC<HeaderPropsType> = ({ routes }) => {
  const pathname = usePathname();

  return (
    <HeaderContainer>
      <Logo
        width={69}
        height={26}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.759 4.094l-.03-.002.037.001h-.007zM17.195 3.966z"
          fill="#fff"
        />
        <path
          d="M2.138 15.445s2.836-2.482 5.444-2.482c0 0-.34-.555-.907-.815l.064-.027.092-.012c1.505-.172 2.909.782 3.283 2.22.218.841.199 1.82-.566 2.634 0 0-1.021 1.37-3.025 0 0 0-1.588 4.481 2.911 8.037 0 0 4.321-2.813 7.823-7.118a7.776 7.776 0 001.742-4.912V3.815l-.018.005.018-.023V3.2L19 2.677c0-.238-.075-.472-.227-.657-.131-.16-.301-.287-.495-.37a.745.745 0 00-.313-.058h-.04c-.183.003-.383.01-.596.023-1.754.105-4.521.614-7.667 2.46 0 0 .87-2.482.642-4.075 0 0-3.138 4.185-4.725 4.593 0 0 .189-1.334-.34-2.037 0 0-1.362 4.333-3.479 6.296l.454.445s-.946 1.74-1.4 1.926l-.756-.815s-.605 3.036 2.08 5.037zm15.59-11.353h.037-.037zm-1.088-.623zm-.183-.652v0zM33.288 18.112c-1.61 0-2.965-.539-4.064-1.616-1.099-1.077-1.648-2.443-1.648-4.096 0-1.664.55-3.035 1.648-4.112 1.11-1.077 2.464-1.616 4.064-1.616 1.61 0 2.965.539 4.064 1.616C38.451 9.365 39 10.731 39 12.384c0 .981-.208 1.877-.624 2.688a5.274 5.274 0 01-1.696 1.984l2.48 2.88h-2.784l-1.648-2c-.49.117-.97.176-1.44.176zm0-9.376c-1.013 0-1.84.336-2.48 1.008-.63.661-.944 1.547-.944 2.656 0 1.099.315 1.984.944 2.656.64.661 1.467.992 2.48.992s1.835-.33 2.464-.992c.63-.672.944-1.563.944-2.672 0-1.11-.315-1.995-.944-2.656-.63-.661-1.45-.992-2.464-.992zM40.841 18V6.832h2.256V18H40.84zm4.656-11.168h2.256v9.456h3.584V18h-5.84V6.832zM52.857 18V6.832h2.255V18h-2.256zM64.824 6.8h2.255V18h-2.255l-5.056-7.744V18h-2.256V6.8h2.256l5.056 7.744V6.8z"
          fill="#fff"
        />
      </Logo>
      <RoutesContainer>
        {routes?.map(route => (
          <Route
            key={route.path}
            href={route.path}
            data-active={pathname === route.path}
          >
            {route.name}
          </Route>
        ))}
      </RoutesContainer>
      <div />
      <AccountInfo />
      <More
        href="https://whobroketheheart2020s-organizati.gitbook.io/qiqi/"
        target="_blank"
      />
    </HeaderContainer>
  );
};
