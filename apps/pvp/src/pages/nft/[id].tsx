import styled from '@emotion/styled';

const PairMiniCard = styled.div`
  display: none;
  flex-direction: column;
  height: 100%;
`;

const PairInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  color: #9699a3;

  > div:nth-of-type(1) {
    display: flex;
    align-items: center;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 12px;
    color: #ffffff;
    &::after {
      content: 'own';
      display: block;
      padding: 1px 2px;
      margin-left: 8px;
      border-radius: 2px;
      font-weight: 400;
      font-size: 8px;
      line-height: 10px;
      background: #2e71ff;
    }
  }
`;

const Profit = styled.div`
  margin-top: 6px;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  &[data-type='long'] {
    color: #44c27f;
  }
  &[data-type='short'] {
    color: #e15c48;
  }
`;

const MainCard = styled.div`
  flex: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 12px;
  color: #44c27f;
`;

const RoomID = styled.div`
  align-self: flex-end;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  color: #9699a3;
`;

const EndTime = styled.div`
  height: 12px;
  align-self: flex-end;
  margin-top: 6px;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  color: #ffffff;
`;

const NFTMain = styled.main`
  @media screen and (max-width: 400px) {
    height: 100vh;
    box-sizing: border-box;
    padding: 22px;
    ${PairMiniCard} {
      display: flex;
    }
  }
`;

export default function Detail() {
  return (
    <NFTMain>
      {/* mini nft card */}
      <PairMiniCard>
        <PairInfo>
          <div>BTC / USDC</div>
          <div>Chainlink</div>
        </PairInfo>
        <Profit data-type="long">long</Profit>
        <MainCard>+ 20.4%</MainCard>
        <RoomID>Room ID：12345</RoomID>
        <EndTime>2023-05-02 18:21:00 UTC</EndTime>
      </PairMiniCard>
    </NFTMain>
  );
}
