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

  const [localCurrentVote, setLocalCurrentVote] = useState(currentVote);
  const [localScore, setLocalScore] = useState(score);

  const handleClickUpVoteButton = async () => {
    // haven't voted yet
    if (localCurrentVote === 0) {
      setLocalScore((prevScore) => prevScore + 1);
      setLocalCurrentVote(1);
    }
    // already up-voted
    else if (localCurrentVote === 1) {
      setLocalScore((prevScore) => prevScore - 1);
      setLocalCurrentVote(0);
    }
    // already down-voted
    else if (localCurrentVote === -1) {
      setLocalScore((prevScore) => prevScore + 2);
      setLocalCurrentVote(1);
    }

    const { errorMessage } = await upVoteAction(componentId);
    if (errorMessage) {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleClickDownVoteButton = async () => {
    // haven't voted yet
    if (localCurrentVote === 0) {
      setLocalScore((prevScore) => prevScore - 1);
      setLocalCurrentVote(-1);
    }
    // already up-voted
    else if (localCurrentVote === 1) {
      setLocalScore((prevScore) => prevScore - 2);
      setLocalCurrentVote(-1);
    }
    // already down-voted
    else if (localCurrentVote === -1) {
      setLocalScore((prevScore) => prevScore + 1);
      setLocalCurrentVote(0);
    }

    const { errorMessage } = await downVoteAction(componentId);
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
      <button
        data-is-active={localCurrentVote === 1}
        className="mx-auto transition-colors duration-200 ease-in-out hover:text-success data-[is-active=true]:text-success"
        onClick={handleClickUpVoteButton}
      >
        <ArrowBigUp />
      </button>

      <p className="mx-auto text-sm">{formatScore(localScore)}</p>

      <button
        data-is-active={localCurrentVote === -1}
        className="mx-auto transition-colors duration-200 ease-in-out hover:text-destructive data-[is-active=true]:text-destructive"
        onClick={handleClickDownVoteButton}
      >
        <ArrowBigDown />
      </button>
    </>
  );
}
