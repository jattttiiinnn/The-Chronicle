import React from 'react';
import { Modal } from './Modal.jsx';
import { Button } from './Button.jsx';
import { IconAlert, IconTrash } from './Icons.jsx';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
  icon: CustomIcon
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
    >
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className={`p-2.5 rounded-[2px] shrink-0 ${
            isDestructive ? 'bg-destructive/10 text-destructive' : 'bg-paper-2 text-ink'
          }`}>
            {CustomIcon ? (
              <CustomIcon className="w-5 h-5" />
            ) : isDestructive ? (
              <IconTrash className="w-5 h-5" />
            ) : (
              <IconAlert className="w-5 h-5" />
            )}
          </div>
          <div className="text-sm text-ink-soft leading-relaxed pt-0.5">
            {message}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-rule">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={isDestructive ? 'destructive' : 'primary'}
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isDestructive && <IconTrash className="w-4 h-4" />}
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
