import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyJWT } from "@/lib/auth";

const GOLD_PRICE = 6500; // per gram

export async function POST(req: Request) {
  try {
    const token = req.headers.get("cookie")
      ?.split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload?.sub) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { grams } = await req.json();
    if (!grams || grams <= 0) {
      return NextResponse.json({ error: "Invalid grams amount" }, { status: 400 });
    }

    const amountINR = grams * GOLD_PRICE;

    const purchase = await prisma.purchase.create({
      data: {
        userId: payload.sub,
        grams,
        pricePerGram: GOLD_PRICE,
        channel: "AI-Suggested"
      }
    });

    return NextResponse.json({ message: `✅ Bought ${grams}g (≈₹${amountINR})`, purchase });
  } catch (err) {
    console.error("buy-gold error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
