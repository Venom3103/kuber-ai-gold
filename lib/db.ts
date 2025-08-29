import { PrismaClient, Prisma } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { emit: "event", level: "query" },
      { emit: "event", level: "error" },
      { emit: "event", level: "warn" },
    ],
  }) as PrismaClient; // 👈 cast to PrismaClient so TS understands

// Pretty print Prisma queries in development
if (process.env.NODE_ENV === "development") {
  (prisma as PrismaClient).$on("query", (e: Prisma.QueryEvent) => {
    console.log("\n🟡 Prisma Query");
    console.log(`   SQL:    ${e.query}`);
    console.log(`   Params: ${e.params}`);
    console.log(`   Time:   ${e.duration}ms\n`);
  });

  (prisma as PrismaClient).$on("warn", (e: Prisma.LogEvent) => {
    console.warn("⚠️ Prisma Warning:", e.message);
  });

  (prisma as PrismaClient).$on("error", (e: Prisma.LogEvent) => {
    console.error("❌ Prisma Error:", e.message);
  });
}

// Ensure we don’t create multiple clients in dev (Next.js hot reload)
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
