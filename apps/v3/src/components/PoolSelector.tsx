import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Icon } from '@qilin/component';
import { useMutationObserver } from '@qilin/hooks';
import * as Popover from '@radix-ui/react-popover';
import type React from 'react';
import { useRef, useState } from 'react';

type PoolSelectorPropsType = {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  hasSearch?: boolean;
  searchInfo?: string;
  onSearchInfoChange?: (value: string) => void;
  selections?: string[];
  renderSelection?: (value: string) => React.ReactNode;
};

const TriggerContainer = styled(Popover.Trigger)`
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
  z-index: 100;
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
  overscroll-behavior: contain;
`;

const SelectItem = styled.div<{ active: boolean }>`
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

export const PoolSelector: React.FC<PoolSelectorPropsType> = ({
  value,
  onValueChange,
  placeholder,
  hasSearch,
  disabled,
  searchInfo,
  onSearchInfoChange,
  selections,
  renderSelection,
}) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [inputWidth, setInputWidth] = useState(0);

  useMutationObserver(triggerRef, () => {
    if (triggerRef.current) {
      setInputWidth(triggerRef.current.offsetWidth);
    }
  });

  return (
    <Popover.Root>
      <TriggerContainer ref={triggerRef} disabled={disabled}>
        {/* TODO:  placeholder*/}
        <span>{value ?? placeholder}</span>
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
      </TriggerContainer>
      <Popover.Portal>
        <Content
          sideOffset={-1}
          alignOffset={0}
          side="bottom"
          align="start"
          css={css`
            width: ${inputWidth}px;
          `}
        >
          <SearchContainer>
            <Icon.SearchIcon />
            <input
              type="text"
              value={searchInfo}
              placeholder="Search name or paste address"
              onChange={e => onSearchInfoChange?.(e.target.value)}
            />
          </SearchContainer>
          <SelectContainer>
            {/* TODO: no data */}
            {selections?.map(item => {
              return (
                <SelectItem
                  key={item}
                  active={item === value}
                  onClick={() => onValueChange?.(item)}
                >
                  {renderSelection ? renderSelection(item) : item}
                </SelectItem>
              );
            })}
          </SelectContainer>
        </Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
