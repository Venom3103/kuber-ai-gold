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
  });

// Pretty print Prisma queries in development
if (process.env.NODE_ENV === "development") {
  prisma.$on("query" as Prisma.LogLevel, (e: Prisma.QueryEvent) => {
    console.log("\n🟡 Prisma Query");
    console.log(`   SQL:    ${e.query}`);
    console.log(`   Params: ${e.params}`);
    console.log(`   Time:   ${e.duration}ms\n`);
  });

  prisma.$on("warn" as Prisma.LogLevel, (e: Prisma.LogEvent) => {
    console.warn("⚠️ Prisma Warning:", e.message);
  });

  prisma.$on("error" as Prisma.LogLevel, (e: Prisma.LogEvent) => {
    console.error("❌ Prisma Error:", e.message);
  });
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
