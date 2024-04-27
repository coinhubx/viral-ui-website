"use client";

import { Component } from "@/db/schemas/components";
import { DBUser } from "@/db/schemas/users";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { GitHubIcon, XIcon, YouTubeIcon } from "./SocialIcons";
import {
  ArrowBigDown,
  ArrowBigUp,
  Check,
  Clipboard,
  ClipboardCheck,
  SquareTerminal,
} from "lucide-react";
import { formatScore } from "@/lib/utils";
import { Button } from "./ui/button";
import { useState, useTransition } from "react";
import { voteAction } from "@/actions/components";
import { useToast } from "./ui/use-toast";
import Link from "next/link";

type Props = {
  component: Component & { score: number };
  user: DBUser;
};

function Post({ component, user }: Props) {
  const { toast } = useToast();

  const [showMore, setShowMore] = useState(false);
  const [justCopiedCode, setJustCopiedCode] = useState(false);
  const [justCopiedCommand, setJustCopiedCommand] = useState(false);

  const handleClickCopyCodeButton = () => {
    setJustCopiedCode(true);
    navigator.clipboard.writeText(component.content);
    setTimeout(() => setJustCopiedCode(false), 2000);
  };

  const handleClickCopyCommandButton = () => {
    setJustCopiedCommand(true);

    const packageManager = "pnpm";
    let packageManagerCode = "pnpm dlx";

    // if (packageManager === "npm") {
    //   packageManagerCode = "npx";
    // } else if (packageManager === "yarn") {
    //   packageManagerCode = "yarn create";
    // }

    const command = `${packageManagerCode} viral-ui add ${user.username} ${component.fileName}`;

    navigator.clipboard.writeText(command);
    setTimeout(() => setJustCopiedCommand(false), 2000);
  };

  const [isPending, startTransition] = useTransition();

  const handleClickVoteButton = (formData: FormData) => {
    const vote = formData.get("vote") as string;
    if (vote !== "up" && vote !== "down") return;

    startTransition(async () => {
      const { errorMessage } = await voteAction(vote, component.id);
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
    <div
      key={component.id}
      className="flex w-full max-w-3xl flex-col rounded-md bg-popover p-4"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href={`/profile/${user.username}/latest`}
            className="flex items-center gap-2"
          >
            <Avatar>
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback>{user.username[0]}</AvatarFallback>
            </Avatar>

            <p>{user.username}</p>
          </Link>

          <div className="flex gap-2">
            {user.githubUrl && (
              <a
                target="_blank"
                href={user.githubUrl}
                className="duration-200 ease-in-out hover:scale-[105%]"
              >
                <GitHubIcon />
              </a>
            )}
            {user.xUrl && (
              <a
                target="_blank"
                href={user.xUrl}
                className="duration-200 ease-in-out hover:scale-[105%]"
              >
                <XIcon />
              </a>
            )}
            {user.youtubeUrl && (
              <a
                target="_blank"
                href={user.youtubeUrl}
                className="duration-200 ease-in-out hover:scale-[105%]"
              >
                <YouTubeIcon />
              </a>
            )}
          </div>
        </div>

        <p className="text-xs">
          {component.createdAt.toISOString().slice(0, 10)}
        </p>
      </div>

      <div className="relative mb-2 flex items-center">
        <p className="mr-10 font-medium">{component.fileName}</p>

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
      </div>

      <div className="relative">
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
          data-showMore={showMore}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 data-[showMore=true]:-bottom-[50px] data-[showMore=true]:text-primary data-[showMore=true]:hover:text-primary/80"
          variant={showMore ? "ghost" : "outline"}
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "Show Less" : "Show More"}
        </Button>
      </div>

      <div className="ml-auto mt-6 grid w-24 grid-cols-3 items-center">
        <form action={handleClickVoteButton} className="flex justify-center">
          <button
            className="hover:text-success transition-colors duration-200 ease-in-out"
            disabled={isPending}
          >
            <ArrowBigUp />
          </button>
          <input type="hidden" name="vote" value="up" />
        </form>

        <p className="mx-auto text-sm">{formatScore(component.score)}</p>

        <form action={handleClickVoteButton} className="flex justify-center">
          <button
            className="transition-colors duration-200 ease-in-out hover:text-destructive"
            disabled={isPending}
          >
            <ArrowBigDown />
          </button>
          <input type="hidden" name="vote" value="down" />
        </form>
      </div>
    </div>
  );
}

export default Post;
