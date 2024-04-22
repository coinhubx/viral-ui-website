"use client";

import { submitComponentAction } from "@/actions/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useTransition } from "react";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";

function ComponentForm() {
  const { toast } = useToast();

  const formRef = useRef<HTMLFormElement>(null);

  const [isPending, startTransition] = useTransition();

  const fileNameSchema = z
    .string()
    .min(5, "Invalid file name.")
    .regex(/^(?!\/).*/, "File name should not start with a slash.")
    .regex(/.*\.(tsx|jsx)$/, "File name should end with .tsx or .jsx.")
    .refine((fileName) => {
      return !/[<>:"\\`|?*']/.test(fileName);
    }, "File name contains invalid characters.");

  const handleSubmitComponentForm = (formData: FormData) => {
    const content = formData.get("content") as string;
    const fileName = formData.get("fileName") as string;
    if (content.trim() === "") {
      toast({
        title: "Error!",
        description: "Component content cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    const fileNameResult = fileNameSchema.safeParse(fileName);
    if (!fileNameResult.success) {
      const message = JSON.parse(fileNameResult.error.message)[0].message;
      toast({
        title: "Error!",
        description: message,
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      const { errorMessage } = await submitComponentAction(content, fileName);
      if (!errorMessage) {
        toast({
          title: "Success!",
          description: "Your component has been added to the library.",
          variant: "success",
        });
        formRef.current?.reset();
      } else {
        toast({
          title: "Error!",
          description: errorMessage,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="mt-10 flex w-full flex-col items-center px-4">
      <form
        action={handleSubmitComponentForm}
        className="flex w-full max-w-6xl flex-col gap-4"
        ref={formRef}
      >
        <Textarea
          className="min-h-[450px]"
          placeholder="Enter component content"
          name="content"
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
    </div>
  );
}

export default ComponentForm;
