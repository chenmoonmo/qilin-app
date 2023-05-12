import styled from '@emotion/styled';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

const Root = AlertDialog.Root;
const Trigger = AlertDialog.Trigger;
const Portal = AlertDialog.Portal;
const Overlay = styled(AlertDialog.Overlay)`
  background-color: var(--dialog-overlay-color);
  position: fixed;
  inset: 0;
  animation: overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
`;

const Content = styled(AlertDialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--dialog-overlay-color);
  border-radius: var(--dialog-radius);
  border: 2px solid var(--dialog-border-color);
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
    hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  width: 90vw;
  max-width: 500px;
  max-height: 85vh;
  padding: 25px;
  animation: contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
`;

const Title = styled(AlertDialog.Title)`
  margin: 0;
  color: var(--dialog-title-color);
  font-size: var(--dialog-title-font-size);
  font-weight: 500;
`;

const Description = styled(AlertDialog.Description)`
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
};
