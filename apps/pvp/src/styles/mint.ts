import styled from '@emotion/styled';

export const Main = styled.main`
  padding-top: 40px;
`;

export const MintContainer = styled.div`
  display: flex;
  width: 750px;
  margin: auto;
  border: 2px solid #363a45;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  border-radius: 6px;
  overflow: hidden;
`;

export const NFTCard = styled.div`
  width: 292px;
  height: 292px;
`;

export const MintInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding: 34px;
  h1 {
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
  }
`;

export const MintInfoBottom = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex: auto;
`;
