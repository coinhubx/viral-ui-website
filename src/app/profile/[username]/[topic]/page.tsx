import Post from "@/components/Post";
import db from "@/db";
import { Component, components } from "@/db/schemas/components";
import { DBUser, users } from "@/db/schemas/users";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

async function ProfilePage({
  params,
}: {
  params: { username: string; topic: string };
}) {
  const { username, topic } = params;

  let componentsInfo: { component: Component; user: DBUser }[];

  if (topic === "hot") {
    componentsInfo = await db
      .select({ component: components, user: users })
      .from(components)
      .innerJoin(users, eq(components.userId, users.id))
      .where(eq(users.username, username));
  } else if (topic === "latest") {
    componentsInfo = await db
      .select({ component: components, user: users })
      .from(components)
      .innerJoin(users, eq(components.userId, users.id))
      .where(eq(users.username, username))
      .orderBy(desc(components.createdAt));
  } else if (topic === "all-time") {
    componentsInfo = await db
      .select({ component: components, user: users })
      .from(components)
      .innerJoin(users, eq(components.userId, users.id))
      .where(eq(users.username, username))
      .orderBy(desc(components.score));
  } else {
    redirect(`/${username}/latest`);
  }

  return (
    <main className="mt-10 flex flex-col items-center px-4">
      <div className="mb-5 flex items-center gap-x-8">
        <Link
          href={`/profile/${username}/hot`}
          className={`${topic === "hot" && "text-primary"}`}
        >
          Hot
        </Link>
        <Link
          href={`/profile/${username}/latest`}
          className={`${topic === "latest" && "text-primary"}`}
        >
          Latest
        </Link>
        <Link
          href={`/profile/${username}/all-time`}
          className={`${topic === "all-time" && "text-primary"}`}
        >
          All Time
        </Link>
      </div>

      <div className="flex w-full flex-col items-center gap-y-6">
        {componentsInfo.map(({ component, user }) => (
          <Post component={component} user={user} key={component.id} />
        ))}
      </div>
    </main>
  );
}

export default ProfilePage;
