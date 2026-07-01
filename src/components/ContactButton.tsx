"use client";

import {
  type FormEvent,
  type FormEventHandler,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { MdOutlineEmail } from "react-icons/md";
import { cn } from "../utils/cn";
import { ContactForm, type ContactFormStatus } from "./ContactForm";
import { Dialog, type DialogHandle } from "./Dialog";
import {
  type ContactFormFieldErrors,
  getContactFormData,
  getContactFormFieldErrors,
} from "./contactFormSchema";

type Props = {
  variant?: "default" | "full";
  className?: string;
};

const contactFormSubmitPath = "/form";
const contactHash = "#contact";
const contactTriggerSelector = "[data-contact-trigger='true']";

function isElementVisible(element: HTMLElement) {
  const style = window.getComputedStyle(element);

  return (
    element.getClientRects().length > 0 &&
    style.display !== "none" &&
    style.visibility !== "hidden"
  );
}

export function ContactButton({ variant = "default", className }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<DialogHandle>(null);
  const isDialogOpenRef = useRef(false);
  const shouldCloseWhenTriggerHiddenRef = useRef(false);
  const dialogId = useId();
  const [status, setStatus] = useState<ContactFormStatus>("idle");
  const [selectedContent, setSelectedContent] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ContactFormFieldErrors>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const closeDialog = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const handleDialogClose = useCallback(() => {
    isDialogOpenRef.current = false;
    shouldCloseWhenTriggerHiddenRef.current = false;
    setIsDialogOpen(false);

    if (window.location.hash === contactHash) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }
  }, []);

  const openDialog = useCallback(() => {
    if (isDialogOpenRef.current) return;

    setStatus("idle");
    setFieldErrors({});
    dialogRef.current?.showModal();
    isDialogOpenRef.current = true;
    setIsDialogOpen(true);
  }, []);

  const openContactAnchor = () => {
    const button = buttonRef.current;

    shouldCloseWhenTriggerHiddenRef.current = button
      ? isElementVisible(button)
      : false;

    if (window.location.hash === contactHash) {
      openDialog();
      return;
    }

    window.location.hash = contactHash;
  };

  const handleFieldChange: FormEventHandler<HTMLFormElement> = (event) => {
    setFieldErrors({});
    setCanSubmit(getContactFormData(new FormData(event.currentTarget)).success);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const result = getContactFormData(new FormData(form));

    if (!result.success) {
      setFieldErrors(getContactFormFieldErrors(result.error));
      return;
    }

    setFieldErrors({});
    setStatus("submitting");

    try {
      const formData = new FormData();

      formData.append("email", result.data.email);
      formData.append("company", result.data.company);
      formData.append("content", result.data.content);
      formData.append("comment", result.data.comment);

      const response = await fetch(contactFormSubmitPath, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setStatus(response.status === 400 ? "sales" : "error");
        return;
      }

      form.reset();
      setSelectedContent("");
      setCanSubmit(false);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => {
    const syncDialogWithHash = () => {
      if (window.location.hash !== contactHash) {
        closeDialog();
        return;
      }

      const contactTriggers = Array.from(
        document.querySelectorAll<HTMLButtonElement>(contactTriggerSelector),
      );
      const targetContactTrigger =
        contactTriggers.find(isElementVisible) ?? contactTriggers[0];

      if (targetContactTrigger === buttonRef.current) {
        shouldCloseWhenTriggerHiddenRef.current =
          isElementVisible(targetContactTrigger);
        openDialog();
      }
    };

    syncDialogWithHash();
    window.addEventListener("hashchange", syncDialogWithHash);

    return () => {
      window.removeEventListener("hashchange", syncDialogWithHash);
    };
  }, [closeDialog, openDialog]);

  useEffect(() => {
    if (status !== "success" || !isDialogOpen) return;

    const timeoutId = window.setTimeout(() => {
      closeDialog();
    }, 3_000);

    return () => window.clearTimeout(timeoutId);
  }, [closeDialog, isDialogOpen, status]);

  useEffect(() => {
    if (!isDialogOpen) return;

    const closeIfTriggerHidden = () => {
      if (
        window.location.hash === contactHash &&
        !shouldCloseWhenTriggerHiddenRef.current
      ) {
        return;
      }

      const button = buttonRef.current;
      if (!button) return;

      const style = window.getComputedStyle(button);
      const isTriggerHidden =
        button.getClientRects().length === 0 || style.visibility === "hidden";

      if (isTriggerHidden) {
        closeDialog();
      }
    };

    const handleResize = () => {
      window.requestAnimationFrame(closeIfTriggerHidden);
    };

    closeIfTriggerHidden();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [closeDialog, isDialogOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={cn(
          "border-line text-text-main inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium no-underline transition-colors hover:bg-gray-100",
          "focus-ring text-accent border-accent cursor-pointer font-semibold",
          variant === "full" &&
            "inline-flex w-full items-center justify-center",
          className,
        )}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        title="お問い合わせフォームを開く"
        data-contact-trigger="true"
        onClick={openContactAnchor}
      >
        <MdOutlineEmail size={16} aria-hidden="true" focusable="false" />
        お問い合わせ
      </button>
      <Dialog
        id={dialogId}
        ref={dialogRef}
        title="お問い合わせ"
        maxWidth="max-w-xl"
        contentClass="p-5 sm:p-6"
        backdrop="blur"
        closeOnBackdrop={false}
        onClose={handleDialogClose}
      >
        <ContactForm
          idPrefix={dialogId}
          status={status}
          fieldErrors={fieldErrors}
          selectedContent={selectedContent}
          canSubmit={canSubmit}
          onContentChange={setSelectedContent}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
        />
      </Dialog>
    </>
  );
}
