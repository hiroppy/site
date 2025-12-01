import {
  type ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { MdClose } from "react-icons/md";
import { cn } from "../utils/cn";

export type DialogHandle = {
  showModal: () => void;
  close: () => void;
};

type BackdropVariant = "default" | "blur" | "strong";
type PositionVariant = "center" | "auto";

type Props = {
  id: string;
  title: string;
  maxWidth?: string;
  closeButtonId?: string;
  showHeader?: boolean;
  headerClass?: string;
  contentClass?: string;
  dialogClass?: string;
  titleId?: string;
  dynamicTitle?: boolean;
  backdrop?: BackdropVariant;
  position?: PositionVariant;
  onClose?: () => void;
  children: ReactNode;
};

const backdropClasses: Record<BackdropVariant, string> = {
  default: "backdrop:bg-black/50",
  blur: "backdrop:bg-black/20 backdrop:backdrop-blur-sm",
  strong: "backdrop:bg-black/70",
};

const positionClasses: Record<PositionVariant, string> = {
  center: "mx-auto my-auto max-sm:my-4",
  auto: "m-auto",
};

export const Dialog = forwardRef<DialogHandle, Props>(function Dialog(
  {
    id,
    title,
    maxWidth = "max-w-2xl",
    closeButtonId,
    showHeader = true,
    headerClass = "",
    contentClass = "",
    dialogClass = "",
    titleId,
    dynamicTitle = false,
    backdrop = "default",
    position = "center",
    onClose,
    children,
  },
  ref,
) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      showModal: () => dialogRef.current?.showModal(),
      close: () => dialogRef.current?.close(),
    }),
    [],
  );

  const finalCloseButtonId = closeButtonId ?? `${id}-close-btn`;
  const finalTitleId = titleId ?? `${id}-title`;

  const finalDialogClass = cn(
    positionClasses[position],
    "w-[calc(100%-2rem)] rounded-lg border border-gray-200 bg-white p-0 shadow-xl sm:w-full",
    maxWidth,
    backdropClasses[backdrop],
    dialogClass,
  );

  const closeDialog = () => {
    if (!dialogRef.current) return;
    try {
      dialogRef.current.close();
    } catch (error) {
      console.warn("Failed to close dialog", error);
    }
    onClose?.();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target === dialog) {
        closeDialog();
      }
    };

    dialog.addEventListener("click", handleBackdropClick);

    const handleClose = () => {
      onClose?.();
    };

    dialog.addEventListener("close", handleClose);

    return () => {
      dialog.removeEventListener("click", handleBackdropClick);
      dialog.removeEventListener("close", handleClose);
    };
  }, [onClose]);

  return (
    <dialog
      id={id}
      ref={dialogRef}
      className={finalDialogClass}
      aria-labelledby={finalTitleId}
    >
      {showHeader && (
        <div
          className={cn(
            "flex items-center justify-between border-b border-gray-200 p-4",
            headerClass,
          )}
        >
          <h2 className="text-lg font-semibold text-gray-900" id={finalTitleId}>
            {!dynamicTitle && title}
          </h2>
          <button
            id={finalCloseButtonId}
            type="button"
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title="Close dialog"
            onClick={closeDialog}
          >
            <MdClose className="h-5 w-5" />
          </button>
        </div>
      )}
      <div className={contentClass}>{children}</div>
    </dialog>
  );
});
