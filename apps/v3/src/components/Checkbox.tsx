import styled from '@emotion/styled';
import * as RadixCheckbox from '@radix-ui/react-checkbox';

const Root = styled(RadixCheckbox.Root)`
  width: 12px;
  height: 12px;
  border: 2px solid #9699a3;
  border-radius: 4px;
  &[data-state='checked'] {
    background: #2e71ff;
    border-color: #2e71ff;
    background-image: url('/images/public.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 8px;
  }
`;

export const Checkbox = Root;
