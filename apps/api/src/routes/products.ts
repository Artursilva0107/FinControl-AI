import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { prisma } from "../db.js";

const schema = z.object({ name: z.string().min(2).max(120), sku: z.string().max(60).optional(), category: z.string().max(80).optional(), cost: z.coerce.number().nonnegative(), price: z.coerce.number().nonnegative(), quantity: z.coerce.number().int().nonnegative().optional(), description: z.string().max(1000).optional(), imageUrl: z.string().url().optional() });
export const productRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", { onRequest: [app.authenticate] }, async () => prisma.product.findMany({ orderBy: { createdAt: "desc" } }));
  app.post("/", { onRequest: [app.authenticate] }, async (request, reply) => {
    const parsed = schema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ message: "Dados do produto inválidos." });
    return reply.code(201).send(await prisma.product.create({ data: parsed.data }));
  });
};
