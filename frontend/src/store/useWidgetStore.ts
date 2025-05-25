import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  icon?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  openModal: (config: {
    title: string;
    message?: string;
    icon?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }) => void;
  closeModal: () => void;
}

interface WidgetState {
  expanded: boolean;
  toggleExpanded: () => void;
}

type AppState = ModalState & WidgetState;

export const useWidgetStore = create<AppState>((set) => ({
  // WidgetState
  expanded: true,
  toggleExpanded: () => set((state) => ({ expanded: !state.expanded })),

  // ModalState
  isOpen: false,
  title: "",
  message: "",
  icon: undefined,
  confirmText: undefined,
  cancelText: undefined,
  onConfirm: () => {},
  onCancel: undefined,
  openModal: (config) =>
    set((state) => ({
      ...state,
      isOpen: true,
      title: config.title,
      message: config.message,
      icon: config.icon,
      confirmText: config.confirmText,
      cancelText: config.cancelText,
      onConfirm: config.onConfirm,
      onCancel: config.onCancel,
    })),
  closeModal: () => set({ isOpen: false }),
}));
