import db from "@/db";
import { components } from "@/db/schemas/components";
import { users } from "@/db/schemas/users";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { username, fileName } = await req.json();

  const res = await db
    .select()
    .from(components)
    .leftJoin(users, eq(users.id, components.userId))
    .where(
      and(eq(users.username, username), eq(components.fileName, fileName)),
    );

  let component = null;
  if (res.length) {
    component = res[0].components;
  }

  return Response.json(component);
}
