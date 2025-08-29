import { PrismaClient, Prisma } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { emit: "event", level: "query" },
      { emit: "event", level: "warn" },
      { emit: "event", level: "error" },
    ],
  });

if (process.env.NODE_ENV === "development") {
  // @ts-ignore
  prisma.$on("query", (e: Prisma.QueryEvent) => {
    console.log("\n🟡 Prisma Query");
    console.log(`   SQL:    ${e.query}`);
    console.log(`   Params: ${e.params}`);
    console.log(`   Time:   ${e.duration}ms\n`);
  });

  // @ts-ignore
  prisma.$on("warn", (e: Prisma.LogEvent) => {
    console.warn("⚠️ Prisma Warning:", e.message);
  });

  // @ts-ignore
  prisma.$on("error", (e: Prisma.LogEvent) => {
    console.error("❌ Prisma Error:", e.message);
  });
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
