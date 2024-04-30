import db from "@/db";
import { Component, components, users } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";

export async function POST(req: Request) {
  const { username, fileNames } = await req.json();

  const res = await db
    .select()
    .from(components)
    .leftJoin(users, eq(users.id, components.userId))
    .where(
      and(
        eq(users.username, username),
        inArray(components.fileName, fileNames),
      ),
    );

  let output: Component[] = [];
  if (res.length) {
    output = res.map((r) => r.components);
  }

  return Response.json(output);
}
