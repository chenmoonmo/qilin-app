import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Icon } from '@qilin/component';
import * as Popover from '@radix-ui/react-popover';
import useSize from '@react-hook/size';
import type React from 'react';
import { useMemo, useRef, useState } from 'react';

type PoolSelectorPropsType = {
  value?: string;
  onValueChange?: (value: { text: string; value: any }) => void;
  placeholder?: string;
  disabled?: boolean;
  // hasSearch?: boolean;
  searchInfo?: string;
  onSearchInfoChange?: (searchInfo: string) => void;
  selections?: { text: string; value: any }[];
  renderSelection?: (value: { text: string; value: any }) => React.ReactNode;
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
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 12px;
  cursor: pointer;
  transition: background 0.1s ease-out;

  &[disabled] {
    color: #737884 !important;
  }

  &[data-state='open'] {
    border-bottom: none;
    background: #1f2127;
    border-radius: 6px 6px 0 0;
    svg {
      transform: rotate(180deg);
    }
  }

  svg {
    transition: all 0.1s ease-out;
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
  color: #e0e0e0;
  font-size: 12px;
  font-weight: 500;
  line-height: 12px;
  cursor: pointer;
  background: ${props => (props.active ? '#323640' : 'transparent')};
  transition: background 0.1s ease-out;
  &:hover {
    background: #323640;
  }
`;

export const PoolSelector: React.FC<PoolSelectorPropsType> = ({
  value,
  onValueChange,
  placeholder,
  // hasSearch = true,
  disabled,
  searchInfo,
  onSearchInfoChange,
  selections,
  renderSelection = item => {
    return item.text;
  },
}) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [inputWidth] = useSize(triggerRef);

  const [open, setOpen] = useState(false);

  const currentItem = useMemo(() => {
    return selections?.find(item => item.value === value);
  }, [selections, value]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <TriggerContainer ref={triggerRef} disabled={disabled}>
        {/* TODO:  placeholder*/}
        <span>{currentItem?.text ?? placeholder}</span>
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
              onChange={e => {
                onSearchInfoChange?.(e.target.value);
              }}
            />
          </SearchContainer>
          <SelectContainer>
            {/* TODO: no data */}
            {selections?.map((item, index) => {
              return (
                <SelectItem
                  key={index}
                  active={item.value === value}
                  onClick={() => {
                    setOpen(false);
                    onValueChange?.(item);
                  }}
                >
                  {renderSelection ? renderSelection(item) : item.text}
                </SelectItem>
              );
            })}
          </SelectContainer>
        </Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
