import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import * as RadixDialog from '@radix-ui/react-dialog';

const overlayShow = keyframes`
   from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const contentShow = keyframes`
from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  `;

const Root = RadixDialog.Root;
const Trigger = RadixDialog.Trigger;
const Portal = RadixDialog.Portal;
const Close = RadixDialog.Close;
const Overlay = styled(RadixDialog.Overlay)`
  background-color: var(--dialog-overlay-color);
  position: fixed;
  inset: 0;
  animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
`;

const Content = styled(RadixDialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--dialog-background-color);
  border-radius: var(--dialog-radius);
  border: 2px solid var(--dialog-border-color);
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
    hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  width: 90vw;
  max-width: 500px;
  max-height: 85vh;
  padding: 20px;
  animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
`;

const Title = styled(RadixDialog.Title)`
  margin: 0;
  color: var(--dialog-title-color);
  font-size: var(--dialog-title-font-size);
  font-weight: 500;
`;

const Description = styled(RadixDialog.Description)`
  margin-bottom: 20px;
  color: var(--mauve11);
  font-size: 15px;
  line-height: 1.5;
`;

export const Dialog = {
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Title,
  Description,
  Close,
};
