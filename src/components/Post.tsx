"use client";

import { Component } from "@/db/schemas/components";
import { DBUser } from "@/db/schemas/users";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetTheme from "@/hooks/useGetTheme";
import { GitHubIcon, XIcon, YouTubeIcon } from "./SocialIcons";

type Props = {
  component: Component;
  user: DBUser;
};

function Post({ component, user }: Props) {
  const theme = useGetTheme();

  return (
    <div
      key={component.id}
      className="min-h-96 w-full max-w-3xl rounded-md bg-popover p-4"
    >
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback>{user.username[0]}</AvatarFallback>
            </Avatar>
            <p>{user.username}</p>
          </div>

          <p>{component.createdAt.toISOString()}</p>
        </div>

        <div className="flex gap-2">
          {user.githubUrl && (
            <a target="_blank" href={user.githubUrl}>
              <GitHubIcon />
            </a>
          )}
          {user.xUrl && (
            <a target="_blank" href={user.xUrl}>
              <XIcon />
            </a>
          )}
          {user.youtubeUrl && (
            <a target="_blank" href={user.youtubeUrl}>
              <YouTubeIcon />
            </a>
          )}
        </div>
      </div>

      {component.fileName}
      {component.score}

      {/* {component.content} */}
    </div>
  );
}

export default Post;
