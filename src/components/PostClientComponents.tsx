"use client";

import { Component } from "@/db/schemas/components";
import { DBUser } from "@/db/schemas/users";
import {
  ArrowBigDown,
  ArrowBigUp,
  Check,
  Clipboard,
  ClipboardCheck,
  SquareTerminal,
} from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { voteAction } from "@/actions/components";
import { formatScore } from "@/lib/utils";

type CopyCommandButtonProps = {
  component: Component;
  user: DBUser;
};

export function CopyCommandButton({ component, user }: CopyCommandButtonProps) {
  const [justCopiedCommand, setJustCopiedCommand] = useState(false);

  const handleClickCopyCommandButton = () => {
    setJustCopiedCommand(true);

    const command = `pnpm dlx viral-ui add ${user.username} ${component.fileName}`;

    navigator.clipboard.writeText(command);
    setTimeout(() => setJustCopiedCommand(false), 2000);
  };

  return (
    <button
      className="absolute right-2 rounded-md p-2 transition-colors duration-200 ease-in-out hover:bg-muted"
      onClick={handleClickCopyCommandButton}
    >
      {justCopiedCommand ? (
        <Check className="size-4" />
      ) : (
        <SquareTerminal className="size-4" />
      )}
    </button>
  );
}

type CopyCodeButtonProps = {
  component: Component;
};

export function CopyCodeButton({ component }: CopyCodeButtonProps) {
  const [justCopiedCode, setJustCopiedCode] = useState(false);

  const handleClickCopyCodeButton = () => {
    setJustCopiedCode(true);
    navigator.clipboard.writeText(component.content);
    setTimeout(() => setJustCopiedCode(false), 2000);
  };

  return (
    <button
      className="absolute right-2 top-2 rounded-md p-2 transition-colors duration-200 ease-in-out hover:bg-popover"
      onClick={handleClickCopyCodeButton}
    >
      {justCopiedCode ? (
        <ClipboardCheck className="size-4" />
      ) : (
        <Clipboard className="size-4" />
      )}
    </button>
  );
}

export function ComponentContent({ component }: CopyCodeButtonProps) {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <pre
        className="cursor-text overflow-hidden text-wrap rounded-md bg-muted p-2 text-sm"
        style={{ maxHeight: showMore ? "100%" : "500px" }}
      >
        {component.content}
      </pre>

      {!showMore && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-popover" />
      )}

      <Button
        data-show-more={showMore}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 data-[show-more=true]:-bottom-[50px] data-[show-more=true]:text-primary data-[show-more=true]:hover:text-primary/80"
        variant={showMore ? "ghost" : "outline"}
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? "Show Less" : "Show More"}
      </Button>
    </>
  );
}

type ScoreProps = {
  component: Component;
  currentVote: number;
};

export function Score({ component, currentVote }: ScoreProps) {
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const handleClickVoteButton = (formData: FormData) => {
    const direction = formData.get("direction") as "up" | "down";

    startTransition(async () => {
      const { errorMessage } = await voteAction(
        direction,
        component.id,
        currentVote,
      );
      if (errorMessage) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <>
      <form action={handleClickVoteButton} className="flex justify-center">
        <button
          data-is-active={currentVote === 1}
          className="hover:text-success data-[is-active=true]:text-success transition-colors duration-200 ease-in-out"
          disabled={isPending}
        >
          <ArrowBigUp />
        </button>
        <input type="hidden" name="direction" value="up" />
      </form>

      <p className="mx-auto text-sm">{formatScore(component.score)}</p>

      <form action={handleClickVoteButton} className="flex justify-center">
        <button
          data-is-active={currentVote === -1}
          className="transition-colors duration-200 ease-in-out hover:text-destructive data-[is-active=true]:text-destructive"
          disabled={isPending}
        >
          <ArrowBigDown />
        </button>
        <input type="hidden" name="direction" value="down" />
      </form>
    </>
  );
}
