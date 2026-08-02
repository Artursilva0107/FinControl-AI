import type { FastifyPluginAsync } from "fastify";
import argon2 from "argon2";
import { z } from "zod";
import { prisma } from "../db.js";

const credentials = z.object({ email: z.string().email(), password: z.string().min(8).max(128) });

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post("/login", async (request, reply) => {
    const parsed = credentials.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ message: "Credenciais inválidas." });
    const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
    if (!user || !(await argon2.verify(user.passwordHash, parsed.data.password))) {
      return reply.code(401).send({ message: "E-mail ou senha inválidos." });
    }
    const token = await reply.jwtSign({ sub: user.id, role: user.role });
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  });

  app.get("/me", { onRequest: [app.authenticate] }, async (request) => {
    return prisma.user.findUniqueOrThrow({ where: { id: request.user.sub }, select: { id: true, name: true, email: true, role: true } });
  });
};
