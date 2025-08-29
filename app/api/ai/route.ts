import { NextResponse } from "next/server";
import { advise } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { message, userName } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const result = await advise(message, userName);

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("❌ API route error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
