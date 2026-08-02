"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

const chartData = [
  { label: "Jan", value: 18800 }, { label: "Fev", value: 22100 }, { label: "Mar", value: 19600 },
  { label: "Abr", value: 25400 }, { label: "Mai", value: 27200 }, { label: "Jun", value: 31420 }
];
const transactions = [
  ["Venda — Pedido #1042", "Vendas", 4850, "Hoje, 10:32"],
  ["Fornecedor Atlas", "Fornecedores", -1920, "Ontem, 15:45"],
  ["Assinatura SaaS", "Software", -249, "30 jun, 08:00"],
  ["Venda — Pedido #1041", "Vendas", 2600, "29 jun, 16:12"]
];
const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function Metric({ label, value, delta, negative }: { label: string; value: number; delta: string; negative?: boolean }) {
  return <article className="metric"><span>{label}</span><strong>{brl.format(value)}</strong><small className={negative ? "down" : "up"}>{delta} <i>vs. mês anterior</i></small></article>;
}

export default function Home() {
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState("");
  const visibleTransactions = useMemo(() => transactions.filter(([description, category]) => `${description} ${category}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <main className={dark ? "app dark" : "app"}>
    <aside className="sidebar"><div className="brand"><b>F</b><span>FinControl</span></div><nav><a className="active">Visão geral</a><a>Movimentações</a><a>Produtos</a><a>Planejamento</a><a>Relatórios</a><a>Assistente IA</a></nav><div className="user"><span>AS</span><div><b>Artur Silva</b><small>Administrador</small></div></div></aside>
    <section className="content">
      <header><div><p>Domingo, 2 de agosto</p><h1>Bom dia, Artur.</h1></div><div className="actions"><button className="icon" onClick={() => setDark(!dark)} aria-label="Alternar tema">◐</button><button className="new">+ Novo lançamento</button></div></header>
      <div className="metrics"><Metric label="Saldo disponível" value={31420} delta="12,4%" /><Metric label="Entradas do mês" value={18390} delta="8,2%" /><Metric label="Saídas do mês" value={7240} delta="3,1%" negative /><Metric label="Lucro líquido" value={11150} delta="16,7%" /></div>
      <section className="grid-main"><article className="chart-card"><div className="card-head"><div><span>Visão financeira</span><h2>Fluxo de caixa</h2></div><button>Últimos 6 meses⌄</button></div><div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id="balance" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#2362ec" stopOpacity={.28}/><stop offset="100%" stopColor="#2362ec" stopOpacity={0}/></linearGradient></defs><Tooltip formatter={(value) => brl.format(Number(value))}/><Area dataKey="value" stroke="#2362ec" strokeWidth={3} fill="url(#balance)" /></AreaChart></ResponsiveContainer></div><div className="months">{chartData.map((item) => <span key={item.label}>{item.label}</span>)}</div></article>
        <article className="insight"><div className="spark">✦</div><span>Insight da IA</span><h2>Seu caixa está saudável.</h2><p>As receitas cresceram 12% e você já atingiu 68% da meta mensal.</p><button>Ver análise completa →</button></article></section>
      <section className="bottom"><article className="list-card"><div className="card-head"><div><h2>Últimas movimentações</h2><p>Registros mais recentes</p></div><a>Ver todas →</a></div><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar movimentações" />{visibleTransactions.map(([description, category, amount, date]) => <div className="transaction" key={String(description)}><div className={Number(amount) > 0 ? "avatar income" : "avatar expense"}>{Number(amount) > 0 ? "↗" : "↙"}</div><div><b>{description}</b><small>{category} · {date}</small></div><strong className={Number(amount) > 0 ? "income-text" : "expense-text"}>{Number(amount) > 0 ? "+" : "−"}{brl.format(Math.abs(Number(amount)))}</strong></div>)}</article>
        <article className="due"><div className="card-head"><div><h2>Próximos vencimentos</h2><p>Nos próximos 7 dias</p></div></div><div className="due-row"><div><b>Aluguel</b><small>Vence em 3 dias</small></div><strong>{brl.format(3200)}</strong></div><div className="due-row"><div><b>Internet e telefonia</b><small>Vence em 5 dias</small></div><strong>{brl.format(420)}</strong></div><button className="outline">Ver contas a pagar</button></article></section>
    </section>
  </main>;
}
