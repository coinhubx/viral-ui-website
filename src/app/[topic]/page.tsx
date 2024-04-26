import Post from "@/components/Post";
import db from "@/db";
import { Component, components } from "@/db/schemas/components";
import { DBUser, users } from "@/db/schemas/users";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

async function HomePage({ params }: { params: { topic: string } }) {
  const { topic } = params;

  let componentsInfo: { component: Component; user: DBUser }[];

  if (topic === "hot") {
    componentsInfo = await db
      .select({ component: components, user: users })
      .from(components)
      .innerJoin(users, eq(components.userId, users.id));
  } else if (topic === "latest") {
    componentsInfo = await db
      .select({ component: components, user: users })
      .from(components)
      .innerJoin(users, eq(components.userId, users.id))
      .orderBy(desc(components.createdAt));
  } else if (topic === "all-time") {
    componentsInfo = await db
      .select({ component: components, user: users })
      .from(components)
      .innerJoin(users, eq(components.userId, users.id))
      .orderBy(desc(components.score));
  } else {
    redirect("/hot");
  }

  return (
    <main className="mt-10 flex flex-col items-center px-4">
      <div className="mb-5 flex items-center gap-x-8">
        <Link href="/hot" className={`${topic === "hot" && "text-red-500"}`}>
          Hot
        </Link>
        <Link
          href="/latest"
          className={`${topic === "latest" && "text-red-500"}`}
        >
          Latest
        </Link>
        <Link
          href="/all-time"
          className={`${topic === "all-time" && "text-red-500"}`}
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
