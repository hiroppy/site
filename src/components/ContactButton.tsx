"use client";

import { type FormEvent, type ReactNode, useId, useRef, useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { cn } from "../utils/cn";
import { ContactForm, type ContactFormStatus } from "./ContactForm";
import { Dialog, type DialogHandle } from "./Dialog";

type Props = {
  variant?: "default" | "full";
  className?: string;
  children?: ReactNode;
};

const contactFormEndpoint =
  process.env.NODE_ENV === "production"
    ? "https://coder-penguin.com/form"
    : "http://localhost:8787";

export function ContactButton({
  variant = "default",
  className,
  children,
}: Props) {
  const dialogRef = useRef<DialogHandle>(null);
  const dialogId = useId();
  const [status, setStatus] = useState<ContactFormStatus>("idle");
  const [selectedContent, setSelectedContent] = useState("");

  const openDialog = () => {
    setStatus("idle");
    dialogRef.current?.showModal();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    setStatus("submitting");

    try {
      const response = await fetch(contactFormEndpoint, {
        method: "POST",
        mode: "no-cors",
        body: new FormData(form),
      });

      if (response.type !== "opaque" && !response.ok) {
        setStatus(response.status === 400 ? "sales" : "error");
        return;
      }

      form.reset();
      setSelectedContent("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <button
        type="button"
        className={cn(
          "border-line text-text-main inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium no-underline transition-colors hover:bg-gray-100",
          "focus-ring text-accent border-accent font-semibold",
          variant === "full" &&
            "inline-flex w-full items-center justify-center",
          className,
        )}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        onClick={openDialog}
      >
        <MdOutlineEmail size={16} aria-hidden="true" focusable="false" />
        {children ?? "お問い合わせ"}
      </button>
      <Dialog
        id={dialogId}
        ref={dialogRef}
        title="お問い合わせ"
        maxWidth="max-w-xl"
        contentClass="p-5 sm:p-6"
        backdrop="blur"
      >
        <ContactForm
          idPrefix={dialogId}
          status={status}
          selectedContent={selectedContent}
          onContentChange={setSelectedContent}
          onSubmit={handleSubmit}
        />
      </Dialog>
    </>
  );
}
