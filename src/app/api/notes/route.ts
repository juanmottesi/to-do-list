import { headers } from 'next/headers'
import { sql } from "@vercel/postgres";

export async function GET() {
  const headersList = await headers()
  const token = headersList.get('token')
  try {
    const { rows } = await sql`SELECT * FROM notes WHERE user_id = ${token}`;
    return Response.json(rows, { status: 200 });
  } catch (e) {
    console.error(e)
    return Response.json({ message: "Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const token = headersList.get('token')
    const formData = await request.json()
    const noteBody = {
      title: formData.title?.toString(),
      content: formData.content?.toString(),
    };
    if (noteBody.title && noteBody.content) {
      const { rows } = await sql`INSERT INTO notes (title, content, user_id) VALUES (${noteBody.title}, ${noteBody.content}, ${token}) RETURNING *;`;
      if (rows.length == 1) {
        return Response.json(rows[0], { status: 200 });
      }
      return Response.json({ message: "Not Found" }, { status: 404 });
    }
  } catch (e) {
    console.error(e)
    return Response.json({ message: "Error" }, { status: 500 });
  }
}