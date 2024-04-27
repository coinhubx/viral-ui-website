"use client";

import { DBUser } from "@/db/schemas/users";
import {
  ArrowBigDown,
  ArrowBigUp,
  Check,
  Clipboard,
  ClipboardCheck,
  SquareTerminal,
} from "lucide-react";
import { useOptimistic, useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { downVoteAction, upVoteAction } from "@/actions/components";
import { formatScore } from "@/lib/utils";

type CopyCommandButtonProps = {
  componentFileName: string;
  user: DBUser;
};

export function CopyCommandButton({
  componentFileName,
  user,
}: CopyCommandButtonProps) {
  const [justCopiedCommand, setJustCopiedCommand] = useState(false);

  const handleClickCopyCommandButton = () => {
    setJustCopiedCommand(true);

    const command = `pnpm dlx viral-ui add ${user.username} ${componentFileName}`;

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
  componentContent: string;
};

export function CopyCodeButton({ componentContent }: CopyCodeButtonProps) {
  const [justCopiedCode, setJustCopiedCode] = useState(false);

  const handleClickCopyCodeButton = () => {
    setJustCopiedCode(true);
    navigator.clipboard.writeText(componentContent);
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

export function ComponentContent({ componentContent }: CopyCodeButtonProps) {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <pre
        className="cursor-text overflow-hidden text-wrap rounded-md bg-muted p-2 text-sm"
        style={{ maxHeight: showMore ? "100%" : "500px" }}
      >
        {componentContent}
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
  componentId: number;
  currentVote: number;
  score: number;
};

export function Score({ componentId, currentVote, score }: ScoreProps) {
  const { toast } = useToast();

  const [optimisticVoteAndScore, updateOptimisticVoteAndScore] = useOptimistic<
    { currentVote: number; score: number },
    "up" | "down"
  >({ currentVote, score }, (state, direction) => {
    const newCurrentVote = direction === "up" ? 1 : -1;

    let change = 0;

    // Haven't voted yet
    if (currentVote === 0) {
      if (direction === "up") {
        change = 1;
      } else if (direction === "down") {
        change = -1;
      }
    }
    // Already up-voted
    else if (currentVote === 1) {
      if (direction === "up") {
        change = -1;
      } else if (direction === "down") {
        change = -2;
      }
    }
    // Already down-voted
    else if (currentVote === -1) {
      if (direction === "up") {
        change = 2;
      } else if (direction === "down") {
        change = 1;
      }
    }
    return {
      currentVote: newCurrentVote,
      score: state.score + change,
    };
  });
  //

  const opVote = optimisticVoteAndScore.currentVote;
  const opScore = optimisticVoteAndScore.score;

  const handleClickUpVoteButton = async () => {
    const direction = "up";

    updateOptimisticVoteAndScore(direction);

    const { errorMessage } = await upVoteAction(componentId, opVote);
    if (errorMessage) {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleClickDownVoteButton = async () => {
    const direction = "down";

    updateOptimisticVoteAndScore(direction);

    const { errorMessage } = await downVoteAction(componentId, opVote);
    if (errorMessage) {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <form action={handleClickUpVoteButton} className="flex justify-center">
        <button
          data-is-active={opVote === 1}
          className="hover:text-success data-[is-active=true]:text-success transition-colors duration-200 ease-in-out"
        >
          <ArrowBigUp />
        </button>
      </form>

      <p className="mx-auto text-sm">{formatScore(opScore)}</p>

      <form action={handleClickDownVoteButton} className="flex justify-center">
        <button
          data-is-active={opVote === -1}
          className="transition-colors duration-200 ease-in-out hover:text-destructive data-[is-active=true]:text-destructive"
        >
          <ArrowBigDown />
        </button>
      </form>
    </>
  );
}
