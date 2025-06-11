import { TriangleAlert } from "lucide-react";
import { useWidgetStore } from "../../store/useWidgetStore";
import GradientHeading from "../widgets/GradientComponent";
import { ReusableIconButton } from "../widgets/Widgets";

const ConfirmModal = () => {
  const {
    isOpen,
    title,
    message,
    icon,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    closeModal,
  } = useWidgetStore();

  if (!isOpen) return null;

  const handleCancel = () => {
    onCancel?.();
    closeModal();
  };

  const handleConfirm = () => {
    onConfirm();
    closeModal();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={handleCancel}
    >
      <div
        className="modal-box rounded-xl max-w-md bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-5 items-center justify-center">
          <TriangleAlert size={50} className="text-error" />
          <div className="leading-tight items-center text-center">
            <GradientHeading className="text-3xl">{title}</GradientHeading>
            {message ? <p className="text-md">{message}</p> : null}
          </div>
        </div>
        <div className="modal-action items-center justify-center mt-8">
          <ReusableIconButton label={cancelText} onClick={handleCancel} />

          <ReusableIconButton
            icon={icon}
            label={confirmText}
            onClick={handleConfirm}
            className="max-w-lg min-w-28 bg-red-700 text-white hover:bg-red-900 border-none"
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
