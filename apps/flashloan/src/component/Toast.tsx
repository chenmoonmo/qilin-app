import styled from '@emotion/styled';
import { Icon } from '@qilin/component';
import * as RadixAlertDialog from '@radix-ui/react-alert-dialog';
import type { PropsWithChildren } from 'react';
import { createContext, type FC, useContext, useState } from 'react';

type ToastPropsType = {
  message: string;
  type?: 'loading' | 'success' | 'error' | 'warning';
  onEnd?: () => void;
};

const Content = styled(RadixAlertDialog.Content)`
  position: fixed;
  top: 21px;
  left: 50%;
  display: flex;
  align-items: center;
  width: 211px;
  height: 44px;
  background: #5e6169;
  border-radius: 6px;
  transform: translate(-50%, 0);
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 44px;
  background: #2e71ff;
  border-radius: 6px;
  svg {
    width: 12px;
    height: 12px;
  }
`;

const Message = styled.div`
  padding: 12px 0 12px 10px;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;
`;

const Icons = {
  loading: <Icon.LoadingIcon fill="#fff" />,
  success: <Icon.SuccessIcon fill="#fff" />,
  error: <Icon.ErrorIcon fill="#fff" />,
  warning: <Icon.WarningIcon fill="#fff" />,
};

export const Toast: FC<ToastPropsType> = ({ message, type = 'loading' }) => {
  return (
    <RadixAlertDialog.Root open={true}>
      <RadixAlertDialog.Portal>
        <Content>
          <Status>{Icons[type]}</Status>
          <Message>{message}</Message>
        </Content>
      </RadixAlertDialog.Portal>
    </RadixAlertDialog.Root>
  );
};

const ToastContext = createContext({
  showToast: (props: ToastPropsType) => {
    console.log(props);
  },
  closeToast: () => {},
});

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider: FC<PropsWithChildren> = ({ children }) => {
  const [toast, setToast] = useState<ToastPropsType | null>(null);
  const showToast = (props: ToastPropsType) => {
    setToast(props);
  };
  const closeToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider
      value={{
        showToast,
        closeToast,
      }}
    >
      {toast && <Toast {...toast} />}
      {children}
    </ToastContext.Provider>
  );
};
