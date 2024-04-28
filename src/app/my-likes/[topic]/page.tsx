import Post from "@/components/Post";
import db from "@/db";
import { Component, components } from "@/db/schemas/components";
import { DBUser, users } from "@/db/schemas/users";
import { getUser } from "@/lib/auth";
import { desc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

async function MyLikesPage({ params }: { params: { topic: string } }) {
  const { topic } = params;

  const user = await getUser();
  const username = user!.username;

  let componentsInfo: {
    component: Component;
    user: DBUser;
  }[];

  if (topic === "hot") {
    componentsInfo = await db
      .select({ component: components, user: users })
      .from(components)
      .innerJoin(users, eq(components.userId, users.id))
      .where(eq(users.username, username))
      .orderBy(
        desc(
          sql`(${components.score} * 20) - (EXTRACT(EPOCH FROM (NOW() - ${components.createdAt})) / 1000)`,
        ),
      )
      .limit(50);
  } else if (topic === "latest") {
    componentsInfo = await db
      .select({ component: components, user: users })
      .from(components)
      .innerJoin(users, eq(components.userId, users.id))
      .where(eq(users.username, username))
      .orderBy(desc(components.createdAt))
      .limit(50);
  } else if (topic === "all-time") {
    componentsInfo = await db
      .select({ component: components, user: users })
      .from(components)
      .innerJoin(users, eq(components.userId, users.id))
      .where(eq(users.username, username))
      .orderBy(desc(components.score))
      .limit(50);
  } else {
    redirect(`/${username}/hot`);
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

export default MyLikesPage;
