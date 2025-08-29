import * as jose from "jose";
const bcrypt = require("bcryptjs");


const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function signJWT(payload: object) {
  return new jose.SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyJWT(token: string): Promise<{ sub: string; email?: string } | null>


export function hashPassword(pw: string) {
  return bcrypt.hashSync(pw, 10);
}

export function verifyPassword(pw: string, hash: string) {
  return bcrypt.compareSync(pw, hash);
}

/**
 * Reads the JWT from cookies in a Next.js API Request
 * and returns the decoded session payload, or null if invalid.
 */
export async function getSession(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)token=([^;]+)/);
  if (!match) return null;

  try {
    const { payload } = await jose.jwtVerify(match[1], secret);
    return payload; // e.g. { sub: userId, email, iat, exp }
  } catch {
    return null;
  }
}
