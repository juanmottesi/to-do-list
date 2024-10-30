import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    const loginBody = {
      email: formData.email?.toString(),
      password: formData.password?.toString(),
    };
    if (loginBody.email && loginBody.password) {
      const { rows } = await sql`SELECT * FROM users WHERE email = ${loginBody.email} AND password = ${loginBody.password};`;
      if (rows.length == 1) {
        const { password, ...user } = rows[0];
        return Response.json(user, { status: 200 });
      }
      return Response.json({ message: "Not Found" }, { status: 404 });
    }
  } catch (e) {
    console.error(e)
    return Response.json({ message: "Error" }, { status: 500 });
  }
}
