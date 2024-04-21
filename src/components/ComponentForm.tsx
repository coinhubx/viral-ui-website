"use client";

import { submitComponentAction } from "@/actions/components";
import { Button } from "@/registry/ui/button";
import { Input } from "@/registry/ui/input";
import { Textarea } from "@/registry/ui/textarea";
import { useTransition } from "react";
import toast from "react-hot-toast";

function ComponentForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmitComponentForm = (formData: FormData) => {
    startTransition(async () => {
      const { errorMessage } = await submitComponentAction(formData);
      if (!errorMessage) {
        toast.success("Component successfully added");
      } else {
        toast.error(errorMessage);
      }
    });
  };

  return (
    <form
      action={handleSubmitComponentForm}
      className="flex w-full max-w-4xl flex-col gap-4"
    >
      <Textarea
        className="min-h-96"
        name="componentText"
        disabled={isPending}
      />

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
