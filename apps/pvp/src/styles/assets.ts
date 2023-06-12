import styled from '@emotion/styled';

export const Main = styled.main`
  display: grid;
  grid-template-columns: 516px 1fr;
  grid-template-rows: repeat(4, max-content);
  gap: 25px 24px;
  max-width: 1250px;
  margin: 40px auto 0;

  h1 {
    all: unset;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 20px;
  }
`;

export const MediaContainer = styled.div`
  grid-row: 1 / 5;
  width: 516px;
  height: 516px;
  border: 5px solid #2e71ff;
  border-radius: 6px;
  iframe {
    all: unset;
    width: 100%;
    height: 100%;
  }
`;

export const InfoCard = styled.div`
  padding: 12px 12px;
  border: 1px solid #363a45;
  border-radius: 6px;
  height: max-content;
  > h1 {
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
  }
  > p {
    margin-top: 12px;
    font-style: normal;
    font-weight: 400;
    font-size: 10px;
    line-height: 18px;
    color: #737884;
  }
  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 2px;
    font-style: normal;
    font-weight: 500;
    font-size: 10px;
    line-height: 20px;
    &:first-of-type {
      margin-top: 7px;
    }
    > div:last-of-type {
      color: rgba(222, 221, 235, 0.8);
    }
  }
`;
