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

    // fetch rows
    const rows = await prisma.purchase.findMany({
      where: { userId: payload.sub as string },
      orderBy: { createdAt: "desc" }
    });

    // manually compute totals since amountINR is not a column
    const totals = rows.reduce(
      (acc, p) => {
        acc.grams += p.grams || 0;
        acc.amountINR += (p.grams || 0) * (p.pricePerGram || 0);
        return acc;
      },
      { grams: 0, amountINR: 0 }
    );

    return NextResponse.json({
      ok: true,
      rows,
      totals
    });
  } catch (err) {
    console.error("history error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
