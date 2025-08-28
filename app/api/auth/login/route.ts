import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, signJWT } from "@/lib/auth";
import { z } from "zod";
import { cookies } from "next/headers";

const Login = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = Login.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user || !verifyPassword(parsed.data.password, user.passwordHash)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signJWT({ sub: user.id, email: user.email });

  // ✅ set cookie using next/headers
  cookies().set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });
}
