import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // pulled from env
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // Call OpenAI Chat API
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // you can also use gpt-4o or gpt-3.5-turbo
      messages: [{ role: "user", content: message }],
    });

    return NextResponse.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("❌ AI error:", err);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
