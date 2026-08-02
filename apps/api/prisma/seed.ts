import "dotenv/config";
import argon2 from "argon2";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) throw new Error("Defina ADMIN_EMAIL e ADMIN_PASSWORD antes de executar o seed.");

await prisma.user.upsert({
  where: { email: email.toLowerCase() },
  update: {},
  create: { name: process.env.ADMIN_NAME ?? "Administrador", email: email.toLowerCase(), passwordHash: await argon2.hash(password), role: Role.ADMIN }
});
await prisma.category.createMany({ data: ["Vendas", "Fornecedores", "Software", "Operacional", "Impostos"].map((name) => ({ name })), skipDuplicates: true });
await prisma.$disconnect();
