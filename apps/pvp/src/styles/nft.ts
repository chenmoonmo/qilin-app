import styled from '@emotion/styled';

export const PairMiniCard = styled.div`
  display: none;
  flex-direction: column;
  height: 100%;
`;

export const PairInfo = styled.div`
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

export const Profit = styled.div`
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

export const MainCard = styled.div`
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

export const RoomID = styled.div`
  align-self: flex-end;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  color: #9699a3;
`;

export const EndTime = styled.div`
  height: 12px;
  align-self: flex-end;
  margin-top: 6px;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  color: #ffffff;
`;

export const RoomCard = styled.div`
  display: grid;
  grid-template-columns: 840px 353px;
  grid-template-rows: 552px auto;
`;

export const RoomSeats = styled.div`
  align-self: stretch;
  padding: 30px 19px 59px 24px;
  border-right: 1px solid #363a45;
`;

export const RoomHeader = styled.div`
  display: flex;
  justify-content: space-between;
  > div > span {
    margin-left: 12px;
  }
  ${EndTime} {
    margin-top: 7px;
    font-style: normal;
    font-weight: 400;
    font-size: 10px;
    line-height: 12px;
    color: #9699a3;
  }
`;

export const Positioninfo = styled.div`
  position: absolute;
  top: -9px;
  left: 50%;
  transform: translate(-50%, -100%);
  > div:nth-of-type(1) {
    margin-bottom: 2px;
    color: #e15c48;
  }
`;

export const SytledSeatItem = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #444444;
  border: 2px solid #000000;
  border-radius: 8px;
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  cursor: pointer;
  &[data-id='1'] {
    bottom: 0;
    left: 20%;
    transform: translate(-50%, 50%);
  }
  &[data-id='2'] {
    bottom: 0;
    left: 40%;
    transform: translate(-50%, 50%);
  }
  &[data-id='3'] {
    bottom: 0;
    left: 60%;
    transform: translate(-50%, 50%);
  }
  &[data-id='4'] {
    bottom: 0;
    left: 80%;
    transform: translate(-50%, 50%);
  }
  &[data-id='5'] {
    top: 50%;
    left: 0;
    transform: translate(-50%, -50%);
  }
  &[data-id='6'] {
    top: 50%;
    right: 0;
    transform: translate(50%, -50%);
  }

  &[data-position='short'] {
    border-color: #44c27f;
    ${Positioninfo} >div:nth-of-type(1) {
      color: #44c27f;
    }
  }
  &[data-position='long'] {
    border-color: #e15c48;
  }
`;

export const UserName = styled.div`
  margin-top: 4px;
`;

export const RoomSeatsMap = styled.div`
  position: relative;
  width: 699px;
  height: 216px;
  margin: 65px auto 0;
  padding-top: 52px;
  border: 2px solid #363a45;
  border-radius: 100px;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 12px;
  > div {
    text-align: center;
    &:nth-of-type(2) {
      margin-top: 9px;
      font-weight: 400;
      font-size: 10px;
      line-height: 12px;
      color: #9699a3;
    }
  }
`;

export const NFTMain = styled.main`
  background: #242730;
  @media screen and (max-width: 400px) {
    height: 100vh;
    box-sizing: border-box;
    padding: 22px;
    ${PairMiniCard} {
      display: flex;
    }
    ${RoomCard} {
      display: none;
    }
  }
`;

export const FormContainer = styled.div`
  padding: 72px 18px 17px;
`;

export const StakePrice = styled.div`
  display: flex;
  width: max-content;
  margin: auto;
  padding: 4px 12px;
  background: #464a56;
  border-radius: 100px;
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 15px;
`;

export const PostionRate = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 74px;
  height: 74px;
  border: 3px solid #44c27f;
  border-radius: 50%;
  background: #1f2127;
  transform: translate(-50%, -50%);
`;

export const OpponentItem = styled.div`
  position: relative;
  flex: 1;
  padding: 5px 0 5px 50px;
  background-color: rgba(68, 194, 127, 0.4);
  border-radius: 100px;

  &:nth-of-type(2) {
    background: rgba(225, 92, 72, 0.4);
    text-align: right;
    padding: 5px 50px 5px 0;
    ${PostionRate} {
      left: unset;
      right: 0;
      transform: translate(50%, -50%);
    }
  }
  > div:nth-of-type(1) {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 12px;
    color: #ffffff;
  }
  > div:nth-of-type(2) {
    margin-top: 2px;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 12px;
    color: #9d9d9d;
    zoom: 0.66;
  }
`;

export const OpponentContainer = styled.div`
  display: flex;
  padding: 0 30px;
  margin-top: 6px;
`;

export const PositionInfo = styled.div``;

export const PositionNote = styled.div`
  margin-top: 14px;
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 14px;
  color: #9699a3;
  zoom: 0.85;
`;
