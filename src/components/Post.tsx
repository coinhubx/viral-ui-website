import { Component } from "@/db/schemas/components";
import { DBUser } from "@/db/schemas/users";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { GitHubIcon, XIcon, YouTubeIcon } from "./SocialIcons";
import Link from "next/link";
import {
  ComponentContent,
  CopyCodeButton,
  CopyCommandButton,
  Score,
} from "./PostClientComponents";
import db from "@/db";
import { votes } from "@/db/schemas/votes";
import { and, eq } from "drizzle-orm";

type Props = {
  component: Component;
  user: DBUser;
};

async function Post({ component, user }: Props) {
  const _votes = await db
    .select()
    .from(votes)
    .where(and(eq(votes.componentId, component.id), eq(votes.userId, user.id)));

  let currentVote = 0;
  if (_votes.length) {
    currentVote = _votes[0].vote;
  }

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

        <CopyCommandButton componentFileName={component.fileName} user={user} />
      </div>

      <div className="relative">
        <CopyCodeButton componentContent={component.content} />

        <ComponentContent componentContent={component.content} />
      </div>

      <div className="ml-auto mt-6 grid w-24 grid-cols-3 items-center">
        <Score
          componentId={component.id}
          currentVote={currentVote}
          score={component.score}
        />
      </div>
    </div>
  );
}

export default Post;
