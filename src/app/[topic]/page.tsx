import Post from "@/components/Post";
import db from "@/db";
import { Component, components, DBUser, users } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

async function HomePage({ params }: { params: { topic: string } }) {
  const { topic } = params;

  let componentsInfo: {
    component: Component;
    user: DBUser;
  }[];

  if (topic === "hot") {
    componentsInfo = await db
      .select({ component: components, user: users })
      .from(components)
      .innerJoin(users, eq(components.userId, users.id))
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
      .orderBy(desc(components.createdAt))
      .limit(50);
  } else if (topic === "all-time") {
    componentsInfo = await db
      .select({ component: components, user: users })
      .from(components)
      .innerJoin(users, eq(components.userId, users.id))
      .orderBy(desc(components.score))
      .limit(50);
  } else {
    redirect("/hot");
  }

  return (
    <main className="mt-10 flex flex-col items-center px-4 pb-24">
      <div className="mb-5 flex items-center gap-x-8">
        <Link href="/hot" className={`${topic === "hot" && "text-primary"}`}>
          Hot
        </Link>
        <Link
          href="/latest"
          className={`${topic === "latest" && "text-primary"}`}
        >
          Latest
        </Link>
        <Link
          href="/all-time"
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

export default HomePage;
