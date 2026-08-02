# Implantação

## Produção

1. Crie um PostgreSQL gerenciado e uma instância Redis (quando o cache for adicionado).
2. Configure `DATABASE_URL`, `JWT_SECRET` e `CORS_ORIGIN` como segredos do provedor.
3. Execute `pnpm db:generate` e `pnpm db:migrate` no pipeline de deploy da API.
4. Publique `apps/api` em Railway, Render ou VPS com HTTPS atrás de um proxy reverso.
5. Publique `apps/web` na Vercel e defina a URL da API em uma variável pública do Next.js.

## Operação

- Faça backup diário do banco e teste a restauração mensalmente.
- Mantenha logs de auditoria por pelo menos 12 meses.
- Use um segredo JWT exclusivo por ambiente e faça rotação periódica.
- Limite a origem CORS ao domínio do painel; não use `*` com credenciais.
