import styled from '@emotion/styled';


export const FormContainer = styled.div`
  padding: 22px 0 0;
`;

export const FromItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  margin-top: 10px;
  &:first-of-type {
    margin-top: 0;
  }
  &:last-of-type {
    align-items: flex-start;
  }
  label {
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 12px;
  }
`;

export const SeatItem = styled.input`
  all: unset;
  box-sizing: border-box;
  display: block;
  width: 340px;
  height: 44px;
  padding: 16px 12px;
  border-radius: 2px;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
  color: #d0d0d0;
  cursor: not-allowed;
  &:disabled {
    background: #536193;
  }
`;

export const WhielistContainer = styled.div`
  width: 340px;
`;

export const WhielistItem = styled.div`
  display: block;
  border: 1px solid #546293;

  border-radius: 2px;

  margin-top: 10px;
  &:first-of-type {
    margin-top: 0;
  }
  &:focus-within {
    border-color: var(--border-active-color);
  }
  input {
    all: unset;
    box-sizing: border-box;
    width: 100%;
    height: 44px;
    padding: 16px 12px;
    font-weight: 600;
    font-size: 12px;
    line-height: 12px;
    color: #d0d0d0;
    &:disabled {
      background: #536193;
    }
  }
`;

export const InfoContainer = styled.div`
  padding: 20px;
  margin-top: 28px;
  /* margin-bottom: 40px; */
  border: 1px solid rgba(139, 162, 212, 0.5);
  border-radius: 6px;
  h1 {
    all: unset;
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 40px;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
  margin-top: 14px;
  > div:first-of-type {
    color: #d0d0d0;
  }
`;

export const TraddingEndTitle = styled.h1`
  all: unset;
  display: block;
  width: 100%;
  margin-top: 87px;
  margin-bottom: 30px;
  font-weight: 600;
  font-size: 18px;
  line-height: 20px;
  text-align: center;
`;

TraddingEndTitle.defaultProps = {
  children: 'Trading Ends in',
};
