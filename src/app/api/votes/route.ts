import db from "@/db";
import { components } from "@/db/schemas/components";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { componentId } = await req.json();

  const [{ score }] = await db
    .select()
    .from(components)
    .where(eq(components.id, componentId));

  return Response.json(score);
}
