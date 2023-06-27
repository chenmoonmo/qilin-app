import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Icon } from '@qilin/component';
import * as Popover from '@radix-ui/react-popover';
import { useEffect, useRef, useState } from 'react';

const InputContainer = styled(Popover.Trigger)`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  padding: 14px 18px;
  border-radius: 6px;
  border: 1px solid #323640;
  cursor: pointer;
  transition: background 0.1s ease-out;

  svg {
    transition: all 0.1s ease-out;
  }

  &[diabled] {
    cursor: not-allowed;
  }

  &[data-state='open'] {
    border-bottom: none;
    background: #1f2127;
    border-radius: 6px 6px 0 0;
    svg {
      transform: rotate(180deg);
    }
  }
`;

const Content = styled(Popover.Content)`
  height: 172px;
  display: flex;
  flex-direction: column;
  background: #1f2127;
  border: 1px solid #323640;
  border-top: none;
  border-radius: 0 0 6px 6px;
  z-index: 10;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  margin: 0 12px 10px;
  border-radius: 6px;
  border: 1px solid #323640;
  color: #737884;
  font-size: 12px;
  line-height: 12px;
  svg {
    margin-right: 12px;
  }
  input {
    flex: 1;
  }
`;

const SelectContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const SelectItem = styled.div`
  padding: 16px 14px;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  line-height: 12px;
  cursor: pointer;
  &:hover {
    background: #323640;
  }
`;

export const PoolSelector = () => {
  const inputRef = useRef<HTMLButtonElement>(null);
  const [inputWidth, setInputWidth] = useState(0);

  useEffect(() => {
    if (inputRef.current) {
      setInputWidth(inputRef.current.offsetWidth);
    }
  }, [inputRef]);

  return (
    <Popover.Root>
      <InputContainer ref={inputRef}>
        <span></span>
        <svg
          width="11"
          height="7"
          viewBox="0 0 11 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-2.63045e-07 0.982238L0.926074 3.58847e-07L5.56457 5.00333L10.0609 0.00681267L11 0.974403L5.5789 7L-2.63045e-07 0.982238Z"
            fill="#737884"
          />
        </svg>
      </InputContainer>
      <Popover.Portal>
        <Content
          sideOffset={-1}
          css={css`
            width: ${inputWidth}px;
          `}
        >
          <SearchContainer>
            <Icon.SearchIcon />
            <input type="text" placeholder="Search name or paste address" />
          </SearchContainer>
          <SelectContainer>
            <SelectItem>1111</SelectItem>
            <SelectItem>1111</SelectItem>
            <SelectItem>1111</SelectItem>
            <SelectItem>1111</SelectItem>
          </SelectContainer>
        </Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
