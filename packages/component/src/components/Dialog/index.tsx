import { Dialog as BaseDialog } from '../../base';

export const Dialog = () => {
  return (
    <BaseDialog.Root>
      <BaseDialog.Trigger asChild>
        <button>1111</button>
      </BaseDialog.Trigger>
      <BaseDialog.Portal>
        <BaseDialog.Overlay />
        <BaseDialog.Content>
          <BaseDialog.Title>1111</BaseDialog.Title>
          <BaseDialog.Description>1111</BaseDialog.Description>
        </BaseDialog.Content>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
};
