import type { FastifyPluginAsync } from "fastify";
import { Prisma } from "@prisma/client";
import { prisma } from "../db.js";

const money = (value: Prisma.Decimal | number | null) => Number(value ?? 0);

export const dashboardRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", { onRequest: [app.authenticate] }, async () => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const [income, expense, allIncome, allExpense, openExpenses, recent] = await Promise.all([
      prisma.transaction.aggregate({ _sum: { amount: true }, where: { kind: "INCOME", status: "PAID", date: { gte: monthStart } } }),
      prisma.transaction.aggregate({ _sum: { amount: true }, where: { kind: "EXPENSE", status: "PAID", date: { gte: monthStart } } }),
      prisma.transaction.aggregate({ _sum: { amount: true }, where: { kind: "INCOME", status: "PAID" } }),
      prisma.transaction.aggregate({ _sum: { amount: true }, where: { kind: "EXPENSE", status: "PAID" } }),
      prisma.futureExpense.aggregate({ _sum: { amount: true }, where: { status: "OPEN" } }),
      prisma.transaction.findMany({ take: 8, orderBy: { date: "desc" }, include: { category: true } })
    ]);
    const monthIncome = money(income._sum.amount);
    const monthExpense = money(expense._sum.amount);
    return {
      metrics: { balance: money(allIncome._sum.amount) - money(allExpense._sum.amount), income: monthIncome, expense: monthExpense, profit: monthIncome - monthExpense, payable: money(openExpenses._sum.amount) },
      recent: recent.map((t) => ({ id: t.id, description: t.description, amount: money(t.amount), date: t.date, kind: t.kind, category: t.category.name }))
    };
  });
};
