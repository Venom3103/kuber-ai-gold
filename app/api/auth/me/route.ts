// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyJWT } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const token = req.headers
      .get("cookie")
      ?.split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const payload = await verifyJWT(token).catch(() => null);
    if (!payload?.sub) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub as string },
      select: { id: true, email: true, createdAt: true },
    });

    return NextResponse.json({ user: user || null }, { status: 200 });
  } catch (err) {
    console.error("auth/me error:", err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
