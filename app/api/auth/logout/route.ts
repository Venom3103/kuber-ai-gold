import { NextResponse } from "next/server";

export async function POST() {
  // ✅ Clear cookie
  const res = NextResponse.json({ message: "Logged out" });

  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // secure in prod
    sameSite: "lax",
    path: "/", // clear across whole app
    maxAge: 0, // instantly expire
  });

  return res;
}
