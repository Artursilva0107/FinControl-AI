# API REST

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/auth/login` | Cria sessão JWT |
| GET | `/auth/me` | Usuário da sessão |
| GET | `/dashboard` | Indicadores e série mensal |
| GET/POST | `/transactions` | Lista ou cria lançamentos |
| PATCH/DELETE | `/transactions/:id` | Atualiza ou remove lançamento |
| GET/POST | `/products` | Lista ou cadastra produtos |

Rotas autenticadas usam `Authorization: Bearer <token>`. Valores monetários são enviados como string decimal (ex.: `"199.90"`) para não introduzir imprecisão de ponto flutuante.
