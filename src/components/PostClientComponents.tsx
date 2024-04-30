"use client";

import { DBUser } from "@/db/schemas/users";
import {
  ArrowBigDown,
  ArrowBigUp,
  Check,
  Clipboard,
  ClipboardCheck,
  SquareTerminal,
  Trash2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import {
  deleteComponentAction,
  downVoteAction,
  upVoteAction,
} from "@/actions/components";
import { formatScore } from "@/lib/utils";
import { codeToHtml } from "shiki";
import { User } from "@/lib/types";

type DeleteComponentButtonProps = {
  componentId: number;
  componentFileName: string;
};

export function DeleteComponentButton({
  componentId,
  componentFileName,
}: DeleteComponentButtonProps) {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const handleClickDeleteComponentButton = () => {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const { errorMessage } = await deleteComponentAction(
        componentId,
        componentFileName,
      );
      if (!errorMessage) {
        toast({
          title: "Success!",
          description: "Component successfully deleted",
          variant: "success",
        });
        setOpen(false);
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
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        <button
          className="rounded-md p-2 transition-colors duration-200 ease-in-out hover:bg-destructive"
          onClick={() => setOpen(true)}
        >
          <Trash2 className="size-4" />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            component.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isPending}
            onClick={() => setOpen(false)}
          >
            Cancel
          </AlertDialogCancel>

          <form action={handleClickDeleteComponentButton}>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/80"
              disabled={isPending}
              type="submit"
            >
              Delete
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type CopyCommandButtonProps = {
  componentFileName: string;
  user: DBUser;
  loggedInUser: User | null;
};

export function CopyCommandButton({
  componentFileName,
  user,
  loggedInUser,
}: CopyCommandButtonProps) {
  const [justCopiedCommand, setJustCopiedCommand] = useState(false);

  const handleClickCopyCommandButton = () => {
    setJustCopiedCommand(true);

    let packageManagerScript = "pnpm dlx";

    if (loggedInUser?.packageManager === "npm") {
      packageManagerScript = "npx";
    } else if (loggedInUser?.packageManager === "yarn") {
      packageManagerScript = "npx";
    } else if (loggedInUser?.packageManager === "bun") {
      packageManagerScript = "bunx --bun";
    }

    const command = `${packageManagerScript} viral-ui@latest add ${user.username} ${componentFileName}`;

    navigator.clipboard.writeText(command);
    setTimeout(() => setJustCopiedCommand(false), 2000);
  };

  return (
    <button
      className="rounded-md p-2 transition-colors duration-200 ease-in-out hover:bg-muted"
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
  const [code, setCode] = useState("");

  useEffect(() => {
    const colorizeCode = async () => {
      const code = await codeToHtml(componentContent, {
        lang: "typescript",
        theme: "one-dark-pro",
      });
      setCode(code);
    };
    colorizeCode();
  }, []);

  return (
    <>
      <div
        className="w-full cursor-text overflow-x-auto overflow-y-hidden rounded-md p-4 text-sm"
        style={{
          maxHeight: showMore ? "100%" : "450px",
          background: "#282c34",
        }}
      >
        {code && (
          <div
            dangerouslySetInnerHTML={{ __html: code }}
            style={{
              width: "max-content",
              minWidth: "100%",
            }}
          />
        )}
      </div>

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
