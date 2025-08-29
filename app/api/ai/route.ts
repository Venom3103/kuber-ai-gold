// app/api/ai/route.ts
import { NextResponse } from "next/server";
import { advise } from "@/lib/ai"; // 👈 use shared AI logic

export async function POST(req: Request) {
  try {
    const { message, userName } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // Use the advise() function from lib/ai.ts
    const result = await advise(message, userName);

    return NextResponse.json(result);
  } catch (err) {
    console.error("❌ API /ai error:", err);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
