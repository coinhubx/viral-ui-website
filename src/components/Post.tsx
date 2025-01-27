import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { GitHubIcon, XIcon, YouTubeIcon } from "./SocialIcons";
import Link from "next/link";
import {
  ComponentContent,
  CopyCodeButton,
  CopyCommandButton,
  DeleteComponentButton,
  Score,
} from "./PostClientComponents";
import db from "@/db";
import { and, eq } from "drizzle-orm";
import { getUser } from "@/lib/auth";
import { Component, DBUser, votes } from "@/db/schema";

type Props = {
  component: Component;
  user: DBUser;
};

async function Post({ component, user }: Props) {
  const loggedInUser = await getUser();

  let currentVote = 0;

  if (loggedInUser) {
    const _votes = await db
      .select()
      .from(votes)
      .where(
        and(
          eq(votes.componentId, component.id),
          eq(votes.userId, loggedInUser.id),
        ),
      );

    if (_votes.length) {
      currentVote = _votes[0].vote;
    }
  }

  return (
    <div
      key={component.id}
      className="flex w-full max-w-3xl flex-col rounded-md bg-popover p-4"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href={`/profile/${user.username}/hot`}
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
        <p className="mr-[70px] w-full font-medium">{component.fileName}</p>

        <div className="absolute right-2 flex">
          {loggedInUser?.id === component.userId && (
            <DeleteComponentButton
              componentId={component.id}
              componentFileName={component.fileName}
            />
          )}

          <CopyCommandButton
            componentFileName={component.fileName}
            user={user}
            loggedInUser={loggedInUser}
          />
        </div>
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
