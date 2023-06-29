import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { type FC, forwardRef } from 'react';

type ColumnType = {
  title: string;
  key?: string;
  render?: (value: any, data: any) => JSX.Element;
};

type TableType = {
  columns: ColumnType[];
  dataSource: any[];
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
`;

const Th = styled.th`
  padding: 16px 0;
  text-align: left;
`;

const Td = Th.withComponent('td');

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
                  const vlaue = column.key ? data[column.key] : undefined;

                  return (
                    <Td key={column.key}>
                      {column.render
                        ? column.render(
                            vlaue ? data[column.key!] : undefined,
                            data
                          )
                        : vlaue}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
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

const PoolTd = PoolTh.withComponent('td');

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
                const vlaue = column.key ? data[column.key] : undefined;
                return (
                  <PoolTd key={column.key}>
                    {column.render
                      ? column.render(
                          vlaue ? data[column.key!] : undefined,
                          data
                        )
                      : vlaue}
                  </PoolTd>
                );
              })}
            </PoolTr>
          );
        })}
        <tr
          css={css`
            height: 93px;
          `}
        />
      </tbody>
    </PoolTableLayout>
  );
};
