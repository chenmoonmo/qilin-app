import 'rsuite/dist/rsuite-no-reset.min.css';
import './index.css';

import styled from '@emotion/styled';
import type { FC } from 'react';
import RsuiteDatePicker from 'rsuite/DatePicker';
import Icon from '../Icons';

export const DatePicker = styled(RsuiteDatePicker)`
  --rs-input-bg: var(--background-color);
  --dialog-border-color: var(--border-color);
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
`;

DatePicker.defaultProps = {
  format: 'yyyy-MM-dd HH:mm',
  caretAs: Icon.ArrowIcon
};