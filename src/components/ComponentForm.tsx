"use client";

import { submitComponentAction } from "@/actions/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useTransition } from "react";
import toast from "react-hot-toast";

function ComponentForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const [isPending, startTransition] = useTransition();

  const handleSubmitComponentForm = (formData: FormData) => {
    startTransition(async () => {
      const { errorMessage } = await submitComponentAction(formData);
      if (!errorMessage) {
        toast.success("Component successfully added");
        formRef.current?.reset();
      } else {
        toast.error(errorMessage);
      }
    });
  };

  return (
    <form
      action={handleSubmitComponentForm}
      className="flex w-full max-w-4xl flex-col gap-4"
      ref={formRef}
    >
      <Textarea className="min-h-96" name="content" disabled={isPending} />

      <div className="flex w-full flex-col gap-2 sm:ml-auto sm:flex-row sm:justify-end">
        <Input
          className="w-full sm:w-56"
          placeholder="Enter file name"
          name="fileName"
          disabled={isPending}
        />

        <Button className="w-full sm:w-40" disabled={isPending}>
          Add Component
        </Button>
      </div>
    </form>
  );
}

export default ComponentForm;
