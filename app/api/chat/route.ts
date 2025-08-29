// app/api/chat/route.ts
"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyJWT } from "@/lib/auth";
import { advise } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    // 1. Get JWT token
    const token = req.headers.get("cookie")
      ?.split("; ")
      .find(c => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload?.sub) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 2. Get message from request body
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

// 3. Ask AI
const email = typeof payload.email === "string" ? payload.email : "User";
const aiResp = await advise(message, email);

    // 4. Save to DB (safe guard against DB errors)
    try {
      await prisma.chatMessage.create({
        data: { userId: payload.sub as string, role: "user", content: message },
      });
      await prisma.chatMessage.create({
        data: { userId: payload.sub as string, role: "assistant", content: aiResp.reply },
      });
    } catch (dbErr) {
      console.error("DB error:", dbErr);
      // Don’t block response if DB fails
    }

    return NextResponse.json(aiResp);

  } catch (err) {
    console.error("chat error:", err);
    return NextResponse.json(
      { intent: "general", reply: "⚠️ AI service is unavailable right now." },
      { status: 500 }
    );
  }
}
