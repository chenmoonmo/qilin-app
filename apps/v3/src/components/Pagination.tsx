import styled from '@emotion/styled';
import type { Dispatch, SetStateAction } from 'react';
import { type FC, useMemo } from 'react';

type PaginationProps = {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  total: number;
};

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 32px 0;
  font-size: 12px;
  font-weight: 500;
  color: #e0e0e0;
  button {
    all: unset;
    padding: 0 15px;
    cursor: pointer;
    svg {
      fill: #4182f8;
    }
    &:disabled {
      cursor: not-allowed;
      svg {
        fill: #2a416e;
      }
    }
  }
`;

export const Pagination: FC<PaginationProps> = ({ page, setPage, total }) => {
  const isPrevDisabled = useMemo(() => page === 1, [page]);
  const isNextDisabled = useMemo(() => page === total, [page, total]);

  return (
    <Container>
      <button
        disabled={isPrevDisabled}
        onClick={() => setPage(prePage => prePage - 1)}
      >
        <svg
          width="18"
          height="10"
          viewBox="0 0 28 19"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.1465 18.5604C9.56069 19.1462 8.61094 19.1462 8.02516 18.5604L0.732262 11.2675C-0.24405 10.2912 -0.244046 8.7083 0.732263 7.73199L8.02516 0.439096C8.61094 -0.146691 9.56069 -0.14669 10.1465 0.439096C10.7323 1.02488 10.7323 1.97463 10.1465 2.56042L3.20714 9.49976L10.1465 16.4391C10.7323 17.0249 10.7323 17.9746 10.1465 18.5604Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M27.5 9.50049C27.5 10.3289 26.8284 11.0005 26 11.0005L1 11.0005L1 8.00049L26 8.00049C26.8284 8.00049 27.5 8.67206 27.5 9.50049Z"
          />
        </svg>
      </button>

      <div>
        Page {page} of {total}
      </div>
      <button
        disabled={isNextDisabled}
        onClick={() => setPage(prePage => prePage + 1)}
      >
        <svg
          width="18"
          height="10"
          viewBox="0 0 29 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.9393 0.93934C18.5251 0.353553 19.4749 0.353553 20.0607 0.93934L27.3536 8.23223C28.3299 9.20855 28.3299 10.7915 27.3536 11.7678L20.0607 19.0607C19.4749 19.6464 18.5251 19.6464 17.9393 19.0607C17.3536 18.4749 17.3536 17.5251 17.9393 16.9393L24.8787 10L17.9393 3.06066C17.3536 2.47487 17.3536 1.52513 17.9393 0.93934Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.5 10C0.5 9.17157 1.17157 8.5 2 8.5L27 8.5V11.5L2 11.5C1.17157 11.5 0.5 10.8284 0.5 10Z"
          />
        </svg>
      </button>
    </Container>
  );
};
