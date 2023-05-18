import styled from '@emotion/styled';
import * as Popover from '@radix-ui/react-popover';
import * as RadixSelect from '@radix-ui/react-select';
import { ButtonHTMLAttributes, FC, ReactNode, useMemo, useState } from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';

type SelectPropsType = {
  selections: { text: string; value: string }[];
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Trigger = styled(RadixSelect.Trigger)`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #363a45;
  border-radius: 6px;
  cursor: pointer;
  &:disabled {
    background-color: #2f313a;
    cursor: not-allowed;
  }
`;

// const Value = styled(RadixSelect.Value)`
//   &[data-placeholder] {
//     color: var(--violet9);
//   }
// `;

const Content = styled(RadixSelect.Content)`
  overflow: hidden;
  /* padding: 12px 0; */
  background-color: #1f2127;
  border: 0.5px solid #363a45;
  border-radius: 9px;
  font-size: 12px;
  min-width: 200px;
`;

const Item = styled(RadixSelect.Item)`
  padding: 8px 12px;
  cursor: pointer;
  &:hover,
  &[data-state='checked'] {
    background-color: #363a45;
  }
`;

export const Select: FC<SelectPropsType> = ({
  selections,
  value,
  // TODO: value 和 placeholder 显示还有问题
  // placeholder,
  onChange,
  ...props
}) => {
  return (
    <RadixSelect.Root value={value} onValueChange={onChange}>
      <Trigger {...props}>
        {value}
        {/* <Value placeholder={placeholder} /> */}
        <RadixSelect.Icon>
          <svg
            width="11"
            height="7"
            viewBox="0 0 11 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.44734 6.98399C5.40343 6.97717 5.35967 6.97035 5.31576 6.9567C5.20284 6.92942 5.10262 6.86139 5.02123 6.77954L4.98359 6.73862L0.214484 1.34905C0.0639293 1.17871 -0.0111951 0.987907 0.0013511 0.749362C0.0138974 0.33382 0.35234 -0.00686462 0.715722 0.0272371C0.891217 0.0408778 1.04162 0.129376 1.16693 0.265783L5.45361 5.11721C5.46616 5.13085 5.47243 5.14449 5.49753 5.17177C5.51007 5.14449 5.51635 5.12403 5.52889 5.11039C6.95779 3.48881 8.39295 1.87389 9.82185 0.252308C9.94089 0.122888 10.0789 0.0274034 10.2417 0.00694241C10.248 0.00694241 10.248 0.00012207 10.2542 0.00012207H10.3984C10.4046 0.00012207 10.4109 0.00694241 10.4235 0.00694241C10.6929 0.0545185 10.9059 0.265616 10.9749 0.565545L11 0.681325V0.844846C10.9937 0.844846 10.9937 0.851667 10.9937 0.858487C10.9749 1.04929 10.8935 1.20599 10.768 1.33541C10.4547 1.68292 10.1476 2.03724 9.83424 2.39157C8.56202 3.82933 7.28353 5.26692 6.01131 6.7115C5.94246 6.79318 5.86091 6.86139 5.76696 6.89549C5.67929 6.92959 5.59147 6.95687 5.5038 6.98399H5.44734Z"
              fill="white"
            />
          </svg>
        </RadixSelect.Icon>
      </Trigger>
      <RadixSelect.Portal>
        <Content position="popper" sideOffset={-4}>
          <RadixSelect.Viewport>
            {selections?.map(item => {
              return (
                <Item key={item.value} value={item.value}>
                  {item.text}
                </Item>
              );
            })}
          </RadixSelect.Viewport>
        </Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
};

const SelectTokenTriger = styled(Trigger.withComponent(Popover.Trigger))`
  > span {
    height: 12px;
  }
  &[data-state='open'] {
    border-color: var(--active-border-color);
  }
`;

const SelectTokenValue = styled(RadixSelect.Value)``;

const SelectTokenContent = styled(Popover.Content)`
  display: flex;
  flex-direction: column;
  width: 259px;
  height: 213px;
  padding: 10px 0;
  border: 0.5px solid #363a45;
  background: #1f2127;
  border-radius: 9px;
  font-size: 12px;
  input {
    width: 100%;
    margin-left: 12px;
  }
`;

const TokenSearch = styled.div`
  display: flex;
  align-items: center;
  margin: 0 10px 10px;
  padding: 4px 11px;
  border: 0.5px solid #363943;
  background: #2c2f38;
  border-radius: 8px;
  /* &:focus-within {
      border-color: var(--active-border-color);
    } */
`;

const TokenContainer = styled(ScrollArea.Root)`
  /* height: 100px; */
  position: relative;
  flex: 1;
  overflow: hidden;
  --scrollbar-size: 5px;
`;

const TokenContainerViewport = styled(ScrollArea.Viewport)`
  width: 100%;
  height: 100%;
`;

const TokenContainerScrollbar = styled(ScrollArea.Scrollbar)`
  display: flex;
  /* ensures no selection */
  user-select: none;
  /* disable browser handling of all panning and zooming gestures on touch devices */
  touch-action: none;
  padding: 2px;
  background: #373737;
  transition: background 160ms ease-out;
  &:hover {
    background: #373737;
  }
  &[data-orientation='vertical'] {
    width: var(--scrollbar-size);
  }
`;

const ScrollAreaThumb = styled(ScrollArea.Thumb)`
  flex: 1;
  background: #a3a3a3;
  border-radius: var(--scrollbar-size);
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    min-width: 44px;
    min-height: 44px;
  }
`;

const TokenSelectionItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  cursor: pointer;
  &:hover,
  &[data-active='true'] {
    background-color: #363a45;
  }
`;

const NoSelection = styled.div`
  padding-top: 40px;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: #9699a3;
  text-align: center;
`;

NoSelection.defaultProps = {
  children: 'No results found.',
};

type SelectTokenWithTokenPropsType<T extends {} = any> = {
  selections: T[];
  value: string | undefined;
  onChange?: (selection: T) => void;
  search?: string;
  onSearchChange?: (search: string) => void;
  renderItem?: (selection: T) => ReactNode;
  valueKey?: keyof T;
  textKey?: keyof T;
  filter?: (selection: T) => boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const SelectToken: FC<SelectTokenWithTokenPropsType> = ({
  renderItem = selection => <div> {selection[textKey]}</div>,
  selections,
  value,
  onChange,
  search,
  onSearchChange,
  valueKey = 'value',
  textKey = 'text',
  filter = () => true,
  ...props
}) => {
  const activeSelection = selections.find(
    selection => selection[valueKey] === value
  )?.[textKey];

  const filtedSelection = useMemo(() => {
    return selections.filter(filter);
  }, [selections, filter]);

  return (
    <Popover.Root>
      <SelectTokenTriger {...props}>
        <span>{activeSelection}</span>
        <svg
          width="11"
          height="7"
          viewBox="0 0 11 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.44734 6.98399C5.40343 6.97717 5.35967 6.97035 5.31576 6.9567C5.20284 6.92942 5.10262 6.86139 5.02123 6.77954L4.98359 6.73862L0.214484 1.34905C0.0639293 1.17871 -0.0111951 0.987907 0.0013511 0.749362C0.0138974 0.33382 0.35234 -0.00686462 0.715722 0.0272371C0.891217 0.0408778 1.04162 0.129376 1.16693 0.265783L5.45361 5.11721C5.46616 5.13085 5.47243 5.14449 5.49753 5.17177C5.51007 5.14449 5.51635 5.12403 5.52889 5.11039C6.95779 3.48881 8.39295 1.87389 9.82185 0.252308C9.94089 0.122888 10.0789 0.0274034 10.2417 0.00694241C10.248 0.00694241 10.248 0.00012207 10.2542 0.00012207H10.3984C10.4046 0.00012207 10.4109 0.00694241 10.4235 0.00694241C10.6929 0.0545185 10.9059 0.265616 10.9749 0.565545L11 0.681325V0.844846C10.9937 0.844846 10.9937 0.851667 10.9937 0.858487C10.9749 1.04929 10.8935 1.20599 10.768 1.33541C10.4547 1.68292 10.1476 2.03724 9.83424 2.39157C8.56202 3.82933 7.28353 5.26692 6.01131 6.7115C5.94246 6.79318 5.86091 6.86139 5.76696 6.89549C5.67929 6.92959 5.59147 6.95687 5.5038 6.98399H5.44734Z"
            fill="white"
          />
        </svg>
        <Popover.Portal>
          <SelectTokenContent sideOffset={0}>
            <>
              <TokenSearch>
                <svg
                  width="14"
                  height="15"
                  viewBox="0 0 14 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_351_951"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="14"
                    height="15"
                  >
                    <path d="M14 0H0V15H14V0Z" fill="white" />
                  </mask>
                  <g mask="url(#mask0_351_951)">
                    <path
                      d="M13.7311 13.481L10.6553 10.2883C11.5594 9.16497 12.0524 7.76468 12.0524 6.28185C12.0524 4.61199 11.4247 3.04167 10.2873 1.85859C9.14999 0.675226 7.63749 0.0263672 6.02619 0.0263672C4.41489 0.0263672 2.90478 0.677969 1.76506 1.85859C0.625075 3.0392 0 4.60952 0 6.28185C0 7.95419 0.627717 9.52203 1.76506 10.7051C2.9024 11.8885 4.41991 12.5373 6.02857 12.5373C7.25019 12.5373 8.41659 12.163 9.40731 11.4639L12.5406 14.7165C12.7041 14.8862 12.9205 14.9737 13.1345 14.9737C13.3485 14.9737 13.5649 14.8887 13.7284 14.7165C14.0605 14.3745 14.0605 13.8205 13.7311 13.481ZM8.97668 9.58676C8.94075 9.61418 8.90693 9.64407 8.87575 9.67671L8.84934 9.70413C8.08952 10.3807 7.10356 10.7874 6.02857 10.7874C3.63342 10.7874 1.68554 8.7654 1.68554 6.27911C1.68554 3.79282 3.63342 1.77083 6.02857 1.77083C8.42373 1.77083 10.3716 3.79282 10.3716 6.27911C10.3716 7.58752 9.83292 8.7632 8.97668 9.58676Z"
                      fill="#9699A3"
                    />
                  </g>
                </svg>
                <input
                  placeholder="Search name or paste address"
                  type="text"
                  value={search}
                  onChange={e => onSearchChange?.(e.target.value)}
                />
              </TokenSearch>
              <TokenContainer>
                {filtedSelection.length > 0 ? (
                  <TokenContainerViewport>
                    <div>
                      {filtedSelection.map(selection => (
                        <TokenSelectionItem
                          key={selection[valueKey]}
                          data-active={value === selection[valueKey]}
                          onClick={() => onChange?.(selection)}
                        >
                          {renderItem(selection)}
                        </TokenSelectionItem>
                      ))}
                    </div>
                  </TokenContainerViewport>
                ) : (
                  <NoSelection />
                )}
                <TokenContainerScrollbar orientation="vertical">
                  <ScrollAreaThumb />
                </TokenContainerScrollbar>
              </TokenContainer>
            </>
          </SelectTokenContent>
        </Popover.Portal>
      </SelectTokenTriger>
    </Popover.Root>
  );
};
