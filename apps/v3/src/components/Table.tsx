import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { type FC, forwardRef } from 'react';

import { NoData } from './NoData';

type ColumnType = {
  title: string;
  key?: string;
  render?: (
    value: any,
    data: any,
    index: number
  ) => JSX.Element | string | number;
};

type TableType = {
  columns: ColumnType[];
  dataSource?: any[];
};

const TableLayout = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
`;

const Tr = styled.tr`
  border-top: 1px solid #363a45;
  &:last-of-type {
    border-bottom: 1px solid #363a45;
  }
  &:hover td,
  &:has([data-active='true']) {
    background-color: rgba(54, 58, 69, 0.3);
  }
`;

const Th = styled.th`
  padding: 16px;
  text-align: left;
`;

const Td = styled(Th.withComponent('td'))`
  :has([data-direction='long']) {
    font-weight: 600;
    color: #44c27f;
    border-left: 3px solid #44c27f;
  }
  :has([data-direction='short']) {
    font-weight: 600;
    color: #e15c48;
    border-left: 3px solid #e15c48;
  }
`;

export const Table = forwardRef<any, TableType>(
  ({ columns, dataSource }, ref) => {
    return (
      <TableLayout ref={ref}>
        <thead>
          <Tr>
            {columns?.map(column => {
              return <Th key={column.key}>{column.title}</Th>;
            })}
          </Tr>
        </thead>
        <tbody>
          {dataSource?.map((data, index) => {
            return (
              <Tr key={index}>
                {columns?.map(column => {
                  const value = column.key ? data?.[column.key] : undefined;
                  return (
                    <Td key={column.key}>
                      {column.render
                        ? column.render(
                            value ? data?.[column.key!] : undefined,
                            data,
                            index
                          )
                        : value}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
          {dataSource?.length === 0 && (
            <tr>
              <td colSpan={columns.length}>
                <NoData />
              </td>
            </tr>
          )}
        </tbody>
      </TableLayout>
    );
  }
);

Table.displayName = 'Table';

const PoolTableLayout = styled(TableLayout)`
  background: #262930;
  border-radius: 8px;
`;

const PoolTr = styled(Tr)`
  border-top: none;
  border-bottom: 1px solid #323640;
`;

const PoolTh = styled(Th)`
  padding: 12px 23px;
  color: #737884;
`;

const PoolTd = styled(PoolTh.withComponent('td'))`
  color: #ffffff;
`;

export const PoolTable: FC<TableType> = ({ columns, dataSource }) => {
  return (
    <PoolTableLayout>
      <thead>
        <PoolTr>
          {columns?.map(column => {
            return <PoolTh key={column.key}>{column.title}</PoolTh>;
          })}
        </PoolTr>
      </thead>
      <tbody>
        {dataSource?.map((data, index) => {
          return (
            <PoolTr key={index}>
              {columns?.map(column => {
                const value = column.key ? data?.[column.key] : undefined;
                return (
                  <PoolTd key={column.key}>
                    {column.render
                      ? column.render(
                          value ? data[column.key!] : undefined,
                          data,
                          index
                        )
                      : value}
                  </PoolTd>
                );
              })}
            </PoolTr>
          );
        })}
        {dataSource?.length === 0 && (
          <tr>
            <td colSpan={columns.length}>
              <NoData />
            </td>
          </tr>
        )}
        <tr
          css={css`
            height: 93px;
          `}
        />
      </tbody>
    </PoolTableLayout>
  );
};
