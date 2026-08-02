import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { authRoutes } from "./routes/auth.js";
import { dashboardRoutes } from "./routes/dashboard.js";
import { transactionRoutes } from "./routes/transactions.js";
import { productRoutes } from "./routes/products.js";
import "./types.js";

const required = ["DATABASE_URL", "JWT_SECRET"] as const;
for (const key of required) if (!process.env[key]) throw new Error(`Missing environment variable: ${key}`);

const app = Fastify({ logger: true });
app.decorate("authenticate", async (request: import("fastify").FastifyRequest) => request.jwtVerify());
await app.register(cors, { origin: process.env.CORS_ORIGIN?.split(",") ?? false, credentials: true });
await app.register(jwt, { secret: process.env.JWT_SECRET!, sign: { expiresIn: "8h" } });
app.get("/health", async () => ({ status: "ok" }));
await app.register(authRoutes, { prefix: "/auth" });
await app.register(dashboardRoutes, { prefix: "/dashboard" });
await app.register(transactionRoutes, { prefix: "/transactions" });
await app.register(productRoutes, { prefix: "/products" });
await app.listen({ port: Number(process.env.PORT ?? 3333), host: "0.0.0.0" });
