// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyJWT } from "@/lib/auth";
import { advise } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("cookie")
      ?.split("; ")
      .find(c => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const payload = await verifyJWT(token);
    if (!payload?.sub) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { message } = await req.json();
    if (!message) return NextResponse.json({ error: "No message provided" }, { status: 400 });

    const aiResp = await advise(message, (payload.email as string) || "User");

    await prisma.chatMessage.create({ data: { userId: payload.sub as string, role: "user", content: message } });
    await prisma.chatMessage.create({ data: { userId: payload.sub as string, role: "assistant", content: aiResp.reply } });

    return NextResponse.json(aiResp);
  } catch (err) {
    console.error("chat error:", err);
    return NextResponse.json({ intent: "general", reply: "⚠️ AI service is unavailable right now." });
  }
}
