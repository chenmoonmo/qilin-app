import styled from '@emotion/styled';

type TextWithDirectionPropsType = {
  children: React.ReactNode;
  direction?: 'long' | 'short';
};

export const TextWithDirection = styled.span<TextWithDirectionPropsType>`
  --long: rgba(68, 194, 127, 1);
  --short: rgba(225, 92, 72, 1);
  color: ${props => {
    if (
      props.direction === 'long' ||
      parseFloat(props.children?.toString() ?? '') > 0
    ) {
      return 'var(--long)';
    }
    if (
      props.direction === 'short' ||
      parseFloat(props.children?.toString() ?? '') < 0
    ) {
      return 'var(--short)';
    }
  }};
  &::before {
    content: '${props => {
      if (
        !props.direction &&
        parseFloat(props.children?.toString() ?? '') > 0
      ) {
        return '+';
      }
    }}';
  }
`;
