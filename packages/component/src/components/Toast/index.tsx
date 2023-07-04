import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import * as RadixAlertDialog from '@radix-ui/react-alert-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import * as RadixToast from '@radix-ui/react-toast';
import {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useState,
} from 'react';

import Icon from '../Icons';

type ToastPropsType = {
  title: string;
  message: string;
  duration?: number;
  type?: 'loading' | 'success' | 'error' | 'warning';
  withOverlay?: boolean;
  onEnd?: () => void;
};

const hide = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(50%);
  }
`;

const Root = styled(RadixToast.Root)`
  position: fixed;
  top: 10%;
  left: 50%;
  display: flex;
  align-items: stretch;
  width: 426px;
  height: 64px;
  background: #5e6169;
  border-radius: 12px;
  overflow: hidden;
  transform: translate(-50%, 0);
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.5);
  z-index: 1000;
  &[data-state='open'] {
    animation: ${slideIn} 150ms ease-in;
  }
  &[data-state='closed'] {
    animation: ${hide} 100ms ease-in;
  }
  &[data-swipe='move'] {
    transform: translateX(50%);
  }
  &[data-swipe='cancel'] {
    transform: translateX(100%);
    transition: transform 200ms ease-out;
  }
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 66px;
  height: 64px;
  background: #2781ff;
  svg {
    width: 22px;
    height: 22px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  padding: 0 30px;
`;

const Title = styled(RadixToast.Title)`
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
`;

const Description = styled(RadixToast.Description)`
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  color: #bcc3d6;
`;

const Close = styled(RadixToast.Close)`
  position: absolute;
  top: 25px;
  right: 20px;
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const Viewport = styled(RadixToast.Viewport)`
  all: unset;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
`;

const Icons = {
  loading: <Icon.LoadingIcon fill="#fff" />,
  success: <Icon.SuccessIcon fill="#fff" />,
  error: <Icon.ErrorIcon fill="#fff" />,
  warning: <Icon.WarningIcon fill="#fff" />,
};

export const Toast: FC<ToastPropsType> = ({
  title,
  message,
  duration = 1500,
  type = 'warning',
  withOverlay = false,
  onEnd,
}) => {
  const [open, setOpen] = useState(true);

  const hanldeOpenChange = (open: boolean) => {
    if (!open) {
      onEnd && onEnd();
    }
    setOpen(open);
  };
  return (
    <>
      <Root open={open} onOpenChange={hanldeOpenChange} duration={duration}>
        <Status>{Icons[type]}</Status>
        <Content>
          <Close>
            <Cross2Icon width={18} height={18} />
          </Close>
          <Title>{title}</Title>
          <Description>{message}</Description>
        </Content>
      </Root>
      {withOverlay && open && <Overlay />}
      <Viewport />
    </>
  );
};

const ToastWithOverlayContent = Root.withComponent(RadixAlertDialog.Content);

export const ToastWithOverlay: FC<ToastPropsType> = ({
  title,
  message,
  type = 'loading',
}) => {
  return (
    <RadixAlertDialog.Root open={true}>
      <RadixAlertDialog.Portal>
        <ToastWithOverlayContent>
          <Status>{Icons[type]}</Status>
          <Content>
            <Title>{title}</Title>
            <Description>{message}</Description>
          </Content>
        </ToastWithOverlayContent>
        <Overlay />
      </RadixAlertDialog.Portal>
    </RadixAlertDialog.Root>
  );
};

const ToastContext = createContext({
  showWalletToast: (props: ToastPropsType) => {
    console.log(props);
  },
  closeWalletToast: () => {},
  showToast: (props: ToastPropsType) => {
    console.log(props);
  },
});

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [walletToast, setWalletToast] = useState<ToastPropsType | null>(null);

  const [toasts, setToasts] = useState<ToastPropsType[]>([]);

  const showToast = (props: ToastPropsType) => {
    const toastItem = {
      ...props,
      onEnd: () => {
        setToasts(pre => {
          return pre.filter(item => item !== toastItem);
        });
      },
    };
    setToasts(pre => {
      return [...pre, toastItem];
    });
  };
  const showWalletToast = (props: ToastPropsType) => {
    setWalletToast(props);
  };

  const closeWalletToast = () => {
    setWalletToast(null);
  };

  return (
    <ToastContext.Provider
      value={{ showToast, showWalletToast, closeWalletToast }}
    >
      <RadixToast.ToastProvider>
        {toasts.map((toast, index) => {
          return <Toast key={index} {...toast} />;
        })}
        {walletToast && <ToastWithOverlay {...walletToast} />}

        {children}
      </RadixToast.ToastProvider>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};
