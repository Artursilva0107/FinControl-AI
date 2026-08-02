import "@fastify/jwt";
import "fastify";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: string; role: "ADMIN" | "PARTNER" };
    user: { sub: string; role: "ADMIN" | "PARTNER" };
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: import("fastify").FastifyRequest) => Promise<void>;
  }
}
