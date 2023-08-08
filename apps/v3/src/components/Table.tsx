import styled from '@emotion/styled';
import { type FC, forwardRef } from 'react';

import { NoData } from './NoData';

type ColumnType = {
  title: string | JSX.Element;
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
  noData?: string;
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
  font-weight: 500;
  &:first-of-type {
    padding-left: 0px;
  }
`;

const Td = styled.td`
  padding: 16px;
  text-align: left;
  font-weight: 500;
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
  ({ columns, dataSource, noData }, ref) => {
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
                <NoData text={noData} />
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
  color: #888e9d;
  &:first-of-type {
    padding-left: 23px;
  }
`;

const PoolTd = styled.td`
  padding: 12px 23px;
  color: #e0e0e0;
`;

export const PoolTable: FC<TableType> = ({ columns, dataSource, noData }) => {
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
              <NoData text={noData} />
            </td>
          </tr>
        )}
      </tbody>
    </PoolTableLayout>
  );
};
