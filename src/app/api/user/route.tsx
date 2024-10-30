import { headers } from "next/headers";
import { sql } from "@vercel/postgres";

export async function GET() {
  const headersList = await headers();
  const token = headersList.get("token");
  try {
    const { rows } = await sql`SELECT * FROM users WHERE user_id = ${token}`;
    return Response.json(rows, { status: 200 });
  } catch (e) {
    console.error(e);
    return Response.json({ message: "Error" }, { status: 500 });
  }
}
