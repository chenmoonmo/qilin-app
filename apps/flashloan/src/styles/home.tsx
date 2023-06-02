import styled from '@emotion/styled';

export const Main = styled.main`
  max-width: 1440px;
  margin: 24px auto 0;
  padding: 0 100px;
`;

export const InfoLayout = styled.div`
  display: flex;
  margin-top: 20px;
`;

export const HomeTitle = styled.h1`
  all: unset;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 20px;
`;

export const NFTCard = styled.iframe`
  all: unset;
  width: 462px;
  height: 520px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
`;

export const NFTInfo = styled.div`
  flex: auto;
  margin-left: 26px;
`;

export const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2px;
  &:first-of-type {
    margin-top: 7px;
  }
  > div:first-of-type {
    font-style: normal;
    font-weight: 500;
    font-size: 10px;
    line-height: 20px;
  }
  > div:last-of-type {
    font-style: normal;
    font-weight: 500;
    font-size: 10px;
    line-height: 20px;
    color: #deddeb;
    opacity: 0.8;
  }
`;

export const Card = styled.div`
  padding: 12px;
  margin-top: 24px;
  border: 1px solid #363a45;
  border-radius: 6px;
  h1 {
    all: unset;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
  }
  p {
    font-weight: 400;
    font-size: 10px;
    line-height: 18px;
    color: #737884;
    margin-top: 12px;
  }
`;
