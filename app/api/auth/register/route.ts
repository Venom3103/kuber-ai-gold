// app/api/signup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, signJWT } from "@/lib/auth";
import { z } from "zod";

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = SignUpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // ✅ check if user exists
    const exists = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });
    if (exists) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    // ✅ create new user with hashed password
    const hashed = await hashPassword(parsed.data.password);
    const user = await prisma.user.create({
      data: {
        email: parsed.data.email,
        passwordHash: hashed,
      },
    });

    // ✅ issue JWT
    const token = await signJWT({ sub: user.id, email: user.email });

    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email },
    });

    // ✅ set cookie
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err) {
    console.error("❌ Signup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
