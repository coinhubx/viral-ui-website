"use client";

import { Component } from "@/db/schemas/components";
import { DBUser } from "@/db/schemas/users";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Props = {
  component: Component;
  user: DBUser;
};

function Post({ component, user }: Props) {
  return (
    <div
      key={component.id}
      className="min-h-96 w-full max-w-3xl rounded-md bg-background p-4"
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
              GitHub
            </a>
          )}
          {user.xUrl && (
            <a target="_blank" href={user.xUrl}>
              X
            </a>
          )}
          {user.youtubeUrl && (
            <a target="_blank" href={user.youtubeUrl}>
              YouTube
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
