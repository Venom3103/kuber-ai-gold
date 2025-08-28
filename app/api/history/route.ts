import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyJWT } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("cookie")
      ?.split("; ")
      .find(c => c.startsWith("token="))
      ?.split("=")[1];
    if (!token) return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload?.sub) return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });

    const rows = await prisma.purchase.findMany({
      where: { userId: payload.sub as string },
      orderBy: { createdAt: "desc" }
    });

    const totals = await prisma.purchase.aggregate({
      where: { userId: payload.sub as string },
      _sum: { grams: true, amountINR: true }
    });

    return NextResponse.json({
      ok: true,
      rows,
      totals: {
        grams: totals._sum.grams || 0,
        amountINR: totals._sum.amountINR || 0
      }
    });
  } catch (err) {
    console.error("history error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
