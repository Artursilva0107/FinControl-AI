# FinControl AI

Base de produção para gestão financeira empresarial de dois usuários. O projeto é um monorepo TypeScript com aplicação web em Next.js e API REST em Fastify/Prisma.

## Início rápido

1. Copie `.env.example` para `apps/api/.env` e ajuste as chaves.
2. Execute `docker compose up -d`.
3. Execute `pnpm install`, `pnpm db:generate` e `pnpm db:migrate`.
4. Execute `pnpm dev` e abra `http://localhost:3000`.

## Estrutura

```
apps/
  api/     API REST, autenticação e Prisma
  web/     painel financeiro responsivo
docs/      arquitetura e API
```

## Segurança

Senhas são armazenadas com Argon2. O JWT deve usar uma chave forte e expirar em oito horas. A API valida payloads com Zod, usa consultas parametrizadas pelo Prisma e define CORS somente para a origem configurada. Antes de produção, configure HTTPS, rotação de segredo, backup do PostgreSQL e observabilidade.

## Próximos módulos

- páginas de produtos, lançamentos e despesas recorrentes;
- relatórios PDF/XLSX/CSV;
- notificações por vencimento;
- serviço de IA com acesso somente a resumos autorizados;
- aplicativo Expo usando os mesmos endpoints.
