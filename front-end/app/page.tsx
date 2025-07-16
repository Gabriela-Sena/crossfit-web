'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserIcon, ClipboardDocumentListIcon, PencilSquareIcon, CheckBadgeIcon, PlusIcon, ChartBarIcon, ChartPieIcon } from '@heroicons/react/24/outline';

const quickActions = [
  { href: '/alunos', icon: <UserIcon className="w-5 h-5" />, label: 'Novo Aluno' },
  { href: '/treinos', icon: <ClipboardDocumentListIcon className="w-5 h-5" />, label: 'Novo Treino' },
  { href: '/matriculas', icon: <PencilSquareIcon className="w-5 h-5" />, label: 'Nova Matrícula' },
  { href: '/frequencias', icon: <CheckBadgeIcon className="w-5 h-5" />, label: 'Nova Frequência' },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [alunos, setAlunos] = useState([]);
  const [treinos, setTreinos] = useState([]);
  const [matriculas, setMatriculas] = useState([]);
  const [frequencias, setFrequencias] = useState([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:3000/alunos').then(r => r.json()),
      fetch('http://localhost:3000/treinos').then(r => r.json()),
      fetch('http://localhost:3000/matriculas-treino').then(r => r.json()),
      fetch('http://localhost:3000/frequencias').then(r => r.json()),
    ]).then(([alunos, treinos, matriculas, frequencias]) => {
      setAlunos(alunos);
      setTreinos(treinos);
      setMatriculas(matriculas);
      setFrequencias(frequencias);
    }).finally(() => setLoading(false));
  }, []);

  // Gráficos e relatórios baseados nos dados reais
  // Alunos por mês (contagem por mês de dataNascimento)
  const alunosPorMes = Array(12).fill(0);
  alunos.forEach((a: any) => {
    const mes = new Date(a.dataNascimento).getMonth();
    alunosPorMes[mes]++;
  });

  // Treinos por tipo (simulação: usar campo titulo para agrupar)
  const tipos = ['Funcional', 'HIIT', 'WOD', 'Mobilidade'];
  const treinosPorTipo = tipos.map(tipo => ({
    label: tipo,
    value: treinos.filter((t: any) => t.titulo?.toLowerCase().includes(tipo.toLowerCase())).length
  }));

  // Frequência mensal (contagem de presenças por mês)
  const frequenciaMensal = Array(12).fill(0);
  frequencias.forEach((f: any) => {
    const mes = new Date(f.dataPresenca).getMonth();
    frequenciaMensal[mes]++;
  });

  // Matrículas por treino
  const matriculasPorTreino = tipos.map((tipo, i) => ({
    treino: tipo,
    qtd: matriculas.filter((m: any) => {
      const treino = treinos.find((t: any) => t.id === m.treinoId);
      return treino && treino.titulo?.toLowerCase().includes(tipo.toLowerCase());
    }).length
  }));

  // Alunos mais frequentes (top 5 por número de presenças)
  const alunoPresencas: Record<string, number> = {};
  frequencias.forEach((f: any) => {
    if (!f.aluno?.nome) return;
    alunoPresencas[f.aluno.nome] = (alunoPresencas[f.aluno.nome] || 0) + 1;
  });
  const alunosMaisFrequentes = Object.entries(alunoPresencas)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nome, presencas]) => ({ nome, presencas }));

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <h1 className="text-4xl font-extrabold text-zinc-100 tracking-tight">Dashboard</h1>
        <div className="flex gap-3 flex-wrap">
          {quickActions.map(action => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-200 px-4 py-2 rounded-lg font-medium hover:border-blue-500 hover:text-blue-400 transition group shadow-sm"
            >
              <PlusIcon className="w-4 h-4 text-blue-400 group-hover:scale-110 transition" />
              {action.icon}
              <span className="text-sm">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Gráfico de barras: Alunos por mês */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-lg flex flex-col">
          <div className="flex items-center gap-2 mb-2 text-zinc-400 text-sm font-semibold">
            <ChartBarIcon className="w-5 h-5" /> Novos alunos por mês
          </div>
          <div className="flex items-end gap-2 h-32 w-full">
            {alunosPorMes.map((v, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div
                  className="w-4 rounded-t bg-blue-500 transition-all duration-700"
                  style={{ height: `${(v / Math.max(...alunosPorMes, 1)) * 100}%`, opacity: loading ? 0.5 : 1 }}
                />
                <span className="text-xs text-zinc-500 mt-1">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Gráfico de pizza: Treinos por tipo */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-lg flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-2 text-zinc-400 text-sm font-semibold self-start">
            <ChartPieIcon className="w-5 h-5" /> Treinos por tipo
          </div>
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Pizza fake SVG */}
            <svg viewBox="0 0 32 32" className="w-32 h-32">
              <circle r="16" cx="16" cy="16" fill="#18181b" />
              {treinosPorTipo.reduce((acc, t, i) => {
                const total = treinosPorTipo.reduce((s, x) => s + x.value, 0);
                const prev = acc.offset;
                const val = total ? (t.value / total) * 100 : 0;
                acc.offset -= val;
                acc.slices.push(
                  <circle
                    key={t.label}
                    r="16" cx="16" cy="16"
                    fill="none"
                    stroke={['#3b82f6', '#06b6d4', '#a78bfa', '#f59e42'][i]}
                    strokeWidth="8"
                    strokeDasharray={`${val} ${100 - val}`}
                    strokeDashoffset={prev}
                  />
                );
                return acc;
              }, { offset: 0, slices: [] as any[] }).slices}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-zinc-100">{loading ? '--' : treinos.length}</span>
              <span className="text-xs text-zinc-400">Treinos</span>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            {treinosPorTipo.map((t, i) => (
              <div key={t.label} className="flex items-center gap-1 text-xs text-zinc-400">
                <span className={`inline-block w-3 h-3 rounded-full ${[
                  'bg-blue-500', 'bg-cyan-400', 'bg-purple-400', 'bg-orange-400'][i]
                  }`} />
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Cards de resumo minimalistas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {['Alunos', 'Treinos', 'Matrículas', 'Frequências'].map((label, i) => (
          <div
            key={label}
            className={
              `group relative bg-zinc-900 rounded-xl shadow-lg p-8 flex flex-col items-center justify-center min-h-[140px] transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl cursor-pointer border border-zinc-800`
            }
          >
            <div className="z-10 flex flex-col items-center">
              {i === 0 && <UserIcon className="w-8 h-8 text-zinc-200" />}
              {i === 1 && <ClipboardDocumentListIcon className="w-8 h-8 text-zinc-200" />}
              {i === 2 && <PencilSquareIcon className="w-8 h-8 text-zinc-200" />}
              {i === 3 && <CheckBadgeIcon className="w-8 h-8 text-zinc-200" />}
              <span className="mt-4 text-lg font-semibold text-zinc-100 tracking-wide">{label}</span>
              <span className="mt-2 text-2xl font-bold text-zinc-400">
                {loading ? (
                  <span className="inline-block animate-pulse w-8 h-6 rounded bg-zinc-700/40" />
                ) : (
                  i === 0 ? alunos.length :
                    i === 1 ? treinos.length :
                      i === 2 ? matriculas.length :
                        i === 3 ? frequencias.length : '--'
                )}
              </span>
            </div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-200 bg-zinc-100 pointer-events-none" />
          </div>
        ))}
      </div>
      {/* Gráfico de linha: Frequência mensal */}
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-lg mb-10">
        <div className="flex items-center gap-2 mb-2 text-zinc-400 text-sm font-semibold">
          <ChartBarIcon className="w-5 h-5" /> Frequência mensal (presenças)
        </div>
        <div className="relative h-40 w-full flex items-end">
          {/* SVG linha */}
          <svg viewBox="0 0 300 120" className="absolute left-0 top-0 w-full h-full">
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              points={frequenciaMensal.map((v, i) => `${i * 27},${120 - v * 2}`).join(' ')}
            />
            {/* Pontos */}
            {frequenciaMensal.map((v, i) => (
              <circle key={i} cx={i * 27} cy={120 - v * 2} r="3" fill="#3b82f6" />
            ))}
          </svg>
          <div className="flex w-full h-full z-10">
            {frequenciaMensal.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end">
                <span className="text-xs text-zinc-500 mt-2">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Gráfico de barras: Matrículas por treino */}
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-lg mb-10">
        <div className="flex items-center gap-2 mb-2 text-zinc-400 text-sm font-semibold">
          <ChartBarIcon className="w-5 h-5" /> Matrículas por treino
        </div>
        <div className="flex items-end gap-6 h-32 w-full">
          {matriculasPorTreino.map((t, i) => (
            <div key={t.treino} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 rounded-t ${['bg-blue-500', 'bg-cyan-400', 'bg-purple-400', 'bg-orange-400'][i]} transition-all duration-700`}
                style={{ height: `${(t.qtd / Math.max(...matriculasPorTreino.map(x => x.qtd), 1)) * 100}%`, opacity: loading ? 0.5 : 1 }}
              />
              <span className="text-xs text-zinc-400 mt-2">{t.treino}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Tabela: Alunos mais frequentes */}
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 shadow-lg mb-10">
        <div className="flex items-center gap-2 mb-4 text-zinc-400 text-sm font-semibold">
          <UserIcon className="w-5 h-5" /> Alunos mais frequentes
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-zinc-800 text-zinc-400">
                <th className="px-4 py-2 text-left font-medium">Nome</th>
                <th className="px-4 py-2 text-left font-medium">Presenças</th>
              </tr>
            </thead>
            <tbody>
              {alunosMaisFrequentes.map((a, i) => (
                <tr key={a.nome} className="border-b border-zinc-800 hover:bg-zinc-800/60 transition">
                  <td className="px-4 py-2 font-medium text-zinc-100">{a.nome}</td>
                  <td className="px-4 py-2 text-zinc-300">{a.presencas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 