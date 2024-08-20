import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
});

console.log("NEW PRISMA CLIENT ON DATABASE!");

export const dbConnection = prisma;