import styled from '@emotion/styled';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import type { FC } from 'react';
import { useMemo } from 'react';
dayjs.extend(duration);

type TimeInputPropsType = {
  value: number;
  disabled?: boolean;
  onChange?: (value: number) => void;
};

const TimeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 26px;
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;
`;

const InputContainer = styled.div`
  position: relative;
  border: 2px solid #2e71ff;
  border-radius: 2px;
  background: #121212;
  margin: 0 10px;

  input {
    all: unset;
    box-sizing: border-box;
    display: block;
    width: 34px;
    height: 40px;
    padding: 12px 0 8px 0;
    font-weight: 600;
    font-size: 18px;
    line-height: 20px;
    text-align: center;
    color: #fff;
  }

  &::after {
    content: 'D';
    position: absolute;
    bottom: -6px;
    right: 50%;
    transform: translate(50%, 100%);
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    color: #fff;
  }
  &:nth-of-type(2)::after {
    content: 'H';
  }
  &:nth-of-type(3)::after {
    content: 'M';
  }
`;

export const TimeInput: FC<TimeInputPropsType> = ({
  value = 0,
  disabled = false,
  onChange,
}) => {
  const [mins, hours, days] = useMemo(() => {
    const duration = dayjs.duration(value * 1000);
    return [
      duration.minutes(),
      duration.hours(),
      Math.floor(duration.asDays()),
    ];
  }, [value]);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'days' | 'hours' | 'mins'
  ) => {
    const params = {
      minutes: mins ?? 0,
      hours: hours ?? 0,
      days: days ?? 0,
    };

    const value = +e.target.value;
    if (type === 'days') {
      params.days = value;
    }
    if (type === 'hours') {
      params.hours = value;
    }
    if (type === 'mins') {
      params.minutes = value;
    }
    const duration = dayjs.duration(params);
    onChange?.(duration.asSeconds());
  };

  return (
    <TimeContainer>
      <InputContainer>
        <input
          type="text"
          value={days}
          placeholder="00"
          disabled={disabled}
          onChange={e => handleInput(e, 'days')}
        />
      </InputContainer>
      :
      <InputContainer>
        <input
          type="text"
          value={hours}
          placeholder="00"
          disabled={disabled}
          onChange={e => handleInput(e, 'hours')}
        />
      </InputContainer>
      :
      <InputContainer>
        <input
          type="text"
          value={mins}
          placeholder="00"
          disabled={disabled}
          onChange={e => handleInput(e, 'mins')}
        />
      </InputContainer>
    </TimeContainer>
  );
};
