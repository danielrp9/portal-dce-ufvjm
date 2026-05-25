import React from 'react';
import api from '@/services/api';
import { Transacao } from '@/types';
import Link from 'next/link';

// Força a página a compilar de forma totalmente estática condizente com a exportação
export const dynamic = 'force-static';

// Interface estendida localmente para refletir o retorno real da API de Resumo Financeiro com auditoria
interface ResumoFinanceiroCompleto {
  ano: number;
  aberto: boolean;
  relatorio_pdf: string | null;
  saldo_anterior: number;
  total_entrada: number;
  total_saida: number;
  saldo_exercicio: number;
  saldo_final: number;
  status: 'AZUL' | 'VERMELHO';
}

interface PaginatedResponse {
  count: number;
  results: Transacao[];
}

async function getFinanceiroData(ano: string) {
  try {
    const [listaRes, resumoRes] = await Promise.all([
      api.get<PaginatedResponse>(`financeiro/?ano=${ano}`),
      api.get<ResumoFinanceiroCompleto>(`financeiro/resumo/?ano=${ano}`)
    ]);
    
    const movimentacoes = Array.isArray(listaRes.data) 
      ? listaRes.data 
      : (listaRes.data as any).results || [];

    return { 
      movimentacoes, 
      resumo: resumoRes.data 
    };
  } catch (error) {
    console.error("Erro ao carregar dados financeiros:", error);
    return { 
      movimentacoes: [], 
      resumo: { 
        ano: Number(ano), 
        aberto: true, 
        relatorio_pdf: null, 
        saldo_anterior: 0, 
        total_entrada: 0, 
        total_saida: 0, 
        saldo_exercicio: 0, 
        saldo_final: 0, 
        status: 'AZUL' as const 
      } 
    };
  }
}

export default async function TransparenciaPage() {
  // Em builds com output: export, fixamos o ano do exercício corrente no build estático.
  const currentYear = '2026';
  const { movimentacoes, resumo } = await getFinanceiroData(currentYear);
  
  const isNegative = resumo.status === 'VERMELHO';
  const anosDisponiveis = [2024, 2025, 2026];

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <main className="min-h-screen bg-[#FDFDFB] pb-32 selection:bg-black selection:text-white font-serif">
      
      {/* 1. BREADCRUMB EDITORIAL SUTIL */}
      <div className="w-full border-b border-black/5 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <nav className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 font-sans">
            <Link href="/" className="hover:text-black transition-colors">Início</Link>
            <span>/</span>
            <span className="text-black font-bold">Portal da Transparência</span>
          </nav>

          {/* SELETOR DE EXERCÍCIO */}
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest font-sans">Exercício:</span>
            <div className="flex border border-black/10">
              {anosDisponiveis.map((ano) => (
                <Link 
                  key={ano} 
                  href={`/transparencia?ano=${ano}`}
                  className={`text-[10px] font-bold px-4 py-1.5 transition-all font-sans ${
                    currentYear === String(ano) 
                    ? 'bg-black text-white' 
                    : 'bg-white text-slate-400 hover:text-black hover:bg-slate-50'
                  }`}
                >
                  {ano}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* TÍTULO DA SEÇÃO - REDUZIDO E SUTIL */}
        <div className="mb-12 border-b border-black pb-4">
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black leading-none">
            Relatório de <span className="text-[#0073B7]">Transparência</span>
          </h1>
          <p className="mt-1 text-[10px] font-sans uppercase tracking-[0.3em] text-slate-400 font-bold">
            Prestação de Contas Consolidada • Exercício {currentYear}
          </p>
        </div>

        {/* 2. HEADER DE SALDO (BALANÇO PATRIMONIAL) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-black/10 border border-black/10 mb-16">
          <div className="lg:col-span-7 bg-[#FDFDFB] p-10">
            <div className="flex items-center gap-3 mb-6">
              <span className={`w-2 h-2 rounded-full ${resumo.aberto ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 font-sans">
                {resumo.aberto ? 'Exercício em Aberto' : 'Contas Auditadas'}
              </span>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-tight mb-6 italic">
              Disponibilidade <br/> Financeira <span className="text-[#0073B7] not-italic">Líquida</span>
            </h2>
            {!resumo.aberto && resumo.relatorio_pdf && (
              <a 
                href={resumo.relatorio_pdf} 
                target="_blank" 
                className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-black border-b border-black pb-1 hover:text-[#0073B7] transition-all font-sans"
              >
                Relatório PDF <span>↓</span>
              </a>
            )}
          </div>
          
          <div className="lg:col-span-5 bg-[#F9F9F7] p-10 flex flex-col justify-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2 font-sans italic">Saldo Final</p>
            <p className={`text-4xl md:text-5xl font-black tracking-tighter ${isNegative ? 'text-red-600' : 'text-black'}`}>
              {formatCurrency(Number(resumo.saldo_final || 0))}
            </p>
          </div>
        </div>

        {/* 3. RESUMO GESTÃO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="border-l-2 border-slate-200 pl-6 py-2">
            <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1 font-sans italic">Aporte Anterior</h3>
            <p className="text-3xl font-black tracking-tighter text-slate-950">
              {formatCurrency(Number(resumo.saldo_anterior || 0))}
            </p>
          </div>
          <div className="border-l-2 border-[#0073B7] pl-6 py-2">
            <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1 font-sans italic">Fluxo {resumo.ano}</h3>
            <p className={`text-3xl font-black tracking-tighter ${Number(resumo.saldo_exercicio) < 0 ? 'text-red-600' : 'text-[#0073B7]'}`}>
              {formatCurrency(Number(resumo.saldo_exercicio || 0))}
            </p>
          </div>
        </div>

        {/* 4. LIVRO CAIXA */}
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black font-sans italic">
              Lançamentos Detalhados
            </h3>
            <div className="flex-1 h-px bg-black/10"></div>
          </div>

          <div className="border-t border-black">
            <div className="hidden md:grid grid-cols-12 bg-[#F9F9F7] border-b border-black/10 py-3 px-8 text-[9px] font-black uppercase tracking-widest text-slate-400 font-sans">
              <div className="col-span-2">Data</div>
              <div className="col-span-6">Descrição</div>
              <div className="col-span-2 text-center">Tipo</div>
              <div className="col-span-2 text-right">Valor</div>
            </div>

            <div className="divide-y divide-black/5">
              {movimentacoes && movimentacoes.length > 0 ? (
                movimentacoes.map((item: Transacao) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 items-center py-8 px-4 md:px-8 hover:bg-[#F9F9F7] transition-all group">
                    <div className="col-span-2 text-[10px] font-bold text-slate-400 font-sans mb-1 md:mb-0">
                      {new Date(item.data).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="col-span-6 font-bold text-xl tracking-tight text-slate-900 group-hover:text-[#0073B7] transition-colors mb-3 md:mb-0 leading-tight">
                      {item.descricao}
                    </div>
                    <div className="col-span-2 flex md:justify-center mb-4 md:mb-0">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 border ${
                        item.tipo === 'SAIDA' ? 'border-red-100 text-red-600 bg-red-50' : 'border-blue-100 text-[#0073B7] bg-blue-50'
                      } font-sans`}>
                        {item.tipo}
                      </span>
                    </div>
                    <div className={`col-span-2 text-left md:text-right text-2xl font-black tracking-tighter ${item.tipo === 'SAIDA' ? 'text-red-600' : 'text-slate-950'}`}>
                      {item.tipo === 'SAIDA' ? '−' : '+'} {formatCurrency(Number(item.valor))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-24 text-center">
                  <p className="text-slate-300 font-bold text-sm uppercase tracking-widest font-sans italic opacity-50">Sem registros.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 5. TOTAIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t-2 border-black pt-12">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#0073B7] italic font-sans">Receitas</h3>
            <p className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">
               {formatCurrency(Number(resumo.total_entrada || 0))}
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-red-600 italic font-sans">Despesas</h3>
            <p className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">
               {formatCurrency(Number(resumo.total_saida || 0))}
            </p>
          </div>
        </div>
      </div>

      <footer className="mt-40 text-center py-20 border-t border-black/5 mx-6">
         <p className="text-[10px] font-bold uppercase tracking-[1em] text-slate-200 select-none font-sans italic">DCE UFVJM • Governança</p>
      </footer>
    </main>
  );
}