import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { prisma } from "../db.js";

const schema = z.object({ kind: z.enum(["INCOME", "EXPENSE"]), amount: z.coerce.number().positive().max(99_999_999), date: z.coerce.date(), description: z.string().min(2).max(180), categoryId: z.string().cuid(), status: z.enum(["PENDING", "PAID", "CANCELLED"]).default("PAID"), paymentMethod: z.string().max(60).optional(), note: z.string().max(1000).optional(), productId: z.string().cuid().optional() });

export const transactionRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", { onRequest: [app.authenticate] }, async () => prisma.transaction.findMany({ orderBy: { date: "desc" }, take: 100, include: { category: true, responsible: { select: { name: true } } } }));
  app.post("/", { onRequest: [app.authenticate] }, async (request, reply) => {
    const parsed = schema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ message: "Dados do lançamento inválidos." });
    const transaction = await prisma.transaction.create({ data: { ...parsed.data, responsibleId: request.user.sub } });
    await prisma.auditLog.create({ data: { action: "CREATE", entity: "Transaction", entityId: transaction.id, userId: request.user.sub } });
    return reply.code(201).send(transaction);
  });
  app.patch("/:id", { onRequest: [app.authenticate] }, async (request, reply) => {
    const parsed = schema.partial().safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ message: "Dados do lançamento inválidos." });
    const transaction = await prisma.transaction.update({ where: { id: (request.params as { id: string }).id }, data: parsed.data });
    await prisma.auditLog.create({ data: { action: "UPDATE", entity: "Transaction", entityId: transaction.id, userId: request.user.sub } });
    return transaction;
  });
  app.delete("/:id", { onRequest: [app.authenticate] }, async (request, reply) => {
    const id = (request.params as { id: string }).id;
    await prisma.transaction.delete({ where: { id } });
    await prisma.auditLog.create({ data: { action: "DELETE", entity: "Transaction", entityId: id, userId: request.user.sub } });
    return reply.code(204).send();
  });
};
