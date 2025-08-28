// app/api/signup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, signJWT } from "@/lib/auth";
import { z } from "zod";

const SignUp = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = SignUp.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // check if user exists
  const exists = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (exists) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  // create new user with hashed password
  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      passwordHash: hashPassword(parsed.data.password),
    },
  });

  // issue JWT
  const token = await signJWT({ sub: user.id, email: user.email });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return res;
}
