import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyJWT } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    // ✅ Extract token from cookies
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

    // ✅ Return full profile info (id, email, name)
    const user = await prisma.user.findUnique({
      where: { id: payload.sub as string },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: user || null }, { status: 200 });
  } catch (err) {
    console.error("auth/me error:", err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
