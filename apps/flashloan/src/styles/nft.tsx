import styled from '@emotion/styled';
import { Button } from '@qilin/component';

import { ArrowIcon } from '@/component';

export const Main = styled.main`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  padding: 10px 12px 20px;
  border: 5px solid #2e71ff;
  border-radius: 6px;
  &::after {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    content: '';
    width: 100%;
    height: 100%;
    background: url('/nft.png') no-repeat center center;
    background-size: 105% 105%;
    filter: brightness(0.5);
  }
`;

export const Address = styled.div`
  display: inline-block;
  align-self: flex-end;
  padding: 5px 15px;
  opacity: 0.5;
  border: 1px solid #ffffff;
  border-radius: 6px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
`;

export const NFTContain = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  width: 100%;
  padding: 0 20px;
`;

export const NFTName = styled.h1`
  all: unset;
  margin-top: 32px;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 20px;
`;

// 路线图
export const Roadmap = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 13px 0;
  padding: 8px 12px;
  margin-top: 16px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 6px;
  width: 100%;
  height: 69px;

  align-items: center;
  justify-content: space-between;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  > svg {
    place-self: center;
  }
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    > svg {
      margin-right: 3px;
    }
  }
  strong {
    font-weight: 600;
  }
`;

export const LeftArow = styled(ArrowIcon)`
  transform: rotateY(180deg);
`;

export const AbsoluteArrow = styled(ArrowIcon)`
  position: absolute;
  top: 35px;
  right: 64px;
  transform: rotate(155deg);
`;

export const BottomArea = styled.div`
  flex: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;

export const Balacne = styled.div`
  display: flex;
  align-content: center;
  justify-content: space-between;
  width: 100%;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  color: rgba(255, 255, 255, 0.8);

  div:first-of-type {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: #ffffff;
  }
`;

export const ActionButton = styled(Button)`
  width: 100%;
  height: 54px;
  margin-top: 28px;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  &[disabled] {
    background-color: #282a2c;
    opacity: 1;
    color: rgba(255, 255, 255, 0.6);
  }
`;
