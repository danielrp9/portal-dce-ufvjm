"use client";

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { Transacao } from '@/types';
import Link from 'next/link';

interface ResumoFinanceiroCompleto {
  ano: number;
  aberto: boolean;
  saldo_anterior: number;
  total_entrada: number;
  total_saida: number;
  saldo_exercicio: number;
  saldo_final: number;
  status: 'AZUL' | 'VERMELHO';
}

interface AnoResponse {
  ano: number;
}

interface PaginatedResponse {
  count: number;
  results: Transacao[];
}

export default function TransparenciaPage() {
  const [anoExercicio, setAnoExercicio] = useState<string | null>(null);
  const [anosDisponiveis, setAnosDisponiveis] = useState<number[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<Transacao[]>([]);
  const [resumo, setResumo] = useState<ResumoFinanceiroCompleto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorZeroAnos, setErrorZeroAnos] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  useEffect(() => {
    async function fetchAnosIniciais() {
      try {
        const anosRes = await api.get<AnoResponse[]>('financeiro/anos/');
        const listaAnos = (anosRes.data || []).map(item => item.ano).sort((a, b) => b - a);

        if (listaAnos.length === 0) {
          setErrorZeroAnos(true);
          setLoading(false);
          return;
        }

        setAnosDisponiveis(listaAnos);

        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const urlAno = params.get('ano');
          
          if (urlAno && listaAnos.includes(Number(urlAno))) {
            setAnoExercicio(urlAno);
          } else {
            setAnoExercicio(listaAnos[0].toString());
          }
        }
      } catch (err) {
        console.error("Erro ao carregar anos do exercício contábil:", err);
        setErrorZeroAnos(true);
        setLoading(false);
      }
    }

    fetchAnosIniciais();
  }, []);

  useEffect(() => {
    if (!anoExercicio) return;

    async function fetchFinanceiroData() {
      setLoading(true);
      try {
        const [listaRes, resumoRes] = await Promise.all([
          api.get<PaginatedResponse>(`financeiro/?ano=${anoExercicio}`),
          api.get<ResumoFinanceiroCompleto>(`financeiro/resumo/?ano=${anoExercicio}`)
        ]);

        setMovimentacoes(Array.isArray(listaRes.data) ? listaRes.data : (listaRes.data as any).results || []);
        setResumo(resumoRes.data);
      } catch (error) {
        console.error("Erro ao carregar dados consolidados:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFinanceiroData();
  }, [anoExercicio]);

  useEffect(() => {
    const handleOutsideClick = () => setShowDropdown(false);
    if (showDropdown) {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [showDropdown]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F4F2] flex items-center justify-center font-sans text-xs font-bold uppercase tracking-widest text-neutral-400">
        Carregando Balanços e Auditoria Bancária...
      </div>
    );
  }

  if (errorZeroAnos || !resumo || !anoExercicio) {
    return (
      <div className="min-h-screen bg-[#F4F4F2] flex flex-col items-center justify-center font-sans gap-4 p-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Nenhum Balanço Cadastrado no Sistema</p>
        <Link href="/" className="px-6 py-3 bg-neutral-950 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all hover:bg-neutral-800">
          Voltar ao início
        </Link>
      </div>
    );
  }

  const isNegative = resumo.status === 'VERMELHO';
  
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const anosExpostos = anosDisponiveis.slice(0, 2);
  const anosOcultos = anosDisponiveis.slice(2);
  const isAnoAtivoOcultado = !anosExpostos.includes(Number(anoExercicio));

  return (
    <main className="min-h-screen bg-[#F4F4F2] pb-32 text-neutral-900 selection:bg-neutral-950 selection:text-white font-sans antialiased print:pb-0 print:bg-white">
      
      {/* 1. BREADCRUMB EDITORIAL SUTIL */}
      <div className="w-full border-b border-neutral-200/60 mb-8 print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <nav className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400">
            <Link href="/" className="hover:text-neutral-950 transition-colors">Início</Link>
            <span>/</span>
            <span className="text-neutral-950 font-bold">Transparência</span>
          </nav>

          <div className="flex items-center gap-3 relative">
            <span className="text-[9px] font-bold uppercase text-neutral-400 tracking-[0.15em]">Exercício Fiscal:</span>
            <div className="flex bg-white border border-neutral-200/60 shadow-2xs rounded-xl overflow-hidden">
              {anosExpostos.map((ano) => (
                <button 
                  key={ano} 
                  onClick={() => { window.location.search = `?ano=${ano}`; }}
                  className={`text-[9px] font-bold px-4 py-2 uppercase tracking-widest transition-all border-r border-neutral-100 last:border-r-0 focus:outline-none ${
                    anoExercicio === String(ano) ? 'bg-neutral-950 text-white border-neutral-950' : 'text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50'
                  }`}
                >
                  {ano}
                </button>
              ))}

              {anosOcultos.length > 0 && (
                <div className="relative flex items-center">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
                    className={`text-[9px] font-bold px-4 py-2 uppercase tracking-widest focus:outline-none flex items-center gap-1.5 h-full transition-colors ${
                      isAnoAtivoOcultado ? 'bg-[#0073B7] text-white' : 'text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50'
                    }`}
                  >
                    {isAnoAtivoOcultado ? `Ano: ${anoExercicio}` : "Outros"}
                    <svg className={`w-3 h-3 transition-transform duration-200 ${showDropdown ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-neutral-200 shadow-md rounded-xl py-2 z-50 flex flex-col animate-in fade-in slide-in-from-top-1 duration-150">
                      {anosOcultos.map((ano) => (
                        <button
                          key={ano}
                          onClick={() => { window.location.search = `?ano=${ano}`; }}
                          className={`text-left text-[9px] font-bold px-4 py-2.5 uppercase tracking-widest transition-colors ${
                            anoExercicio === String(ano) ? 'bg-neutral-950 text-white' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-950'
                          }`}
                        >
                          Exercício {ano}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER DA SEÇÃO */}
        <header className="mb-10 border-b border-neutral-300 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#0073B7] mb-1">
              Portal de Transparência DCE
            </h3>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-950 uppercase">
              Demonstrativo de Contas
            </h1>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
              Auditoria de Fluxo de Caixa • Exercício Fiscal {resumo.ano}
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="print:hidden inline-flex items-center gap-2 bg-white border border-neutral-200/60 hover:border-neutral-400 text-neutral-950 px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-2xs group"
          >
            <svg className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-950 transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.82l2.12-2.12m0 0l2.12 2.12m-2.12-2.12V19.5M18 12a3 3 0 100-6M5.433 13.184l1.32-.44a1.205 1.205 0 011.53.642l.147.441a1.205 1.205 0 001.53.641l1.319-.44" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-4.5m4.5 0a3 3 0 01-3 3h-3M1.5 12a3 3 0 013-3h3m-3 3a3 3 0 003 3h3M9 1.5v3M15 1.5v3" />
            </svg>
            Imprimir Extrato (PDF)
          </button>
        </header>

        {/* CARD DE DISPONIBILIDADE LÍQUIDA */}
        <div className="grid grid-cols-1 md:grid-cols-12 bg-white border border-neutral-200/60 mb-10 shadow-2xs rounded-3xl overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-between items-start gap-6 border-b md:border-b-0 md:border-r border-neutral-100 bg-white">
            <div>
              <div className="flex items-center gap-2.5 mb-4 select-none">
                <span className={`w-2.5 h-2.5 rounded-full ${resumo.aberto ? 'bg-[#8CC63F] animate-pulse' : 'bg-neutral-300'}`}></span>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                  {resumo.aberto ? 'Livro Caixa Aberto' : 'Contas Auditadas (Encerrado)'}
                </span>
              </div>
              <h2 className="text-2xl font-bold uppercase tracking-tight text-neutral-950 leading-tight mb-2">
                Disponibilidade Financeira Líquida
              </h2>
              <p className="text-xs text-neutral-500 max-w-md leading-relaxed font-light">
                Recursos totais líquidos sob custódia e responsabilidade legal da gestão corrente do diretório central no exercício de {resumo.ano}.
              </p>
            </div>
          </div>
          
          <div className="md:col-span-5 p-8 md:p-10 flex flex-col justify-center bg-neutral-50/40">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-2">Saldo Final Consolidado</p>
            <p className={`text-3xl md:text-4xl font-bold tracking-tight ${isNegative ? 'text-red-600' : 'text-neutral-950'}`}>
              {formatCurrency(Number(resumo.saldo_final || 0))}
            </p>
            <div className="mt-4">
              <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border transition-colors ${isNegative ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                {isNegative ? 'BALANÇO EM DÉFICIT' : 'BALANÇO EM SUPERÁVIT'}
              </span>
            </div>
          </div>
        </div>

        {/* TEXTO DE PARECER / ATA CASO O ANO ESTEJA FECHADO */}
        {!resumo.aberto && (
          <div className="w-full bg-neutral-950 text-white p-8 md:p-10 mb-10 rounded-3xl shadow-2xs border border-neutral-950">
            <div className="max-w-3xl border-b border-white/10 pb-4 mb-5">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Ata de Encerramento e Homologação</h3>
              <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">Demonstrativo Imutável Gerado pelo Sistema de Integridade</p>
            </div>
            <p className="text-sm text-neutral-300 font-light leading-relaxed max-w-4xl">
              {isNegative 
                ? `O Diretório Central dos Estudantes encerrou as atividades financeiras de ${resumo.ano} em DÉFICIT. O prejuízo acumulado de ${formatCurrency(Math.abs(resumo.saldo_final))} foi computado em definitivo e transportado compulsoriamente como dívida ativa (passivo) para abertura do balanço inicial do próximo exercício.`
                : `O Diretório Central dos Estudantes encerrou as atividades financeiras de ${resumo.ano} em SUPERÁVIT. O lucro remanescente líquido de ${formatCurrency(resumo.saldo_final)} foi auditado e transportado de forma automática como aporte inicial em caixa para aplicação no próximo ano.`
              }
            </p>
          </div>
        )}

        {/* RESUMO DE TRANSPORTE CONTÁBIL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white border border-neutral-200/60 p-6 rounded-3xl shadow-2xs group hover:shadow-md transition-all duration-300">
            <h3 className="text-[10px] font-bold uppercase text-neutral-400 tracking-[0.2em] mb-3">
              {resumo.saldo_anterior >= 0 ? "Aporte Inicial (Herança)" : "Passivo Inicial (Dívida)"}
            </h3>
            <p className={`text-2xl font-bold tracking-tight ${resumo.saldo_anterior < 0 ? 'text-red-600' : 'text-neutral-950'}`}>
              {formatCurrency(Number(resumo.saldo_anterior || 0))}
            </p>
            <p className="text-[10px] text-neutral-400 mt-4 leading-relaxed font-medium">Valor líquido herdado diretamente da virada de lote do exercício passado.</p>
          </div>

          <div className="bg-white border border-neutral-200/60 p-6 rounded-3xl shadow-2xs group hover:shadow-md transition-all duration-300">
            <h3 className="text-[10px] font-bold uppercase text-neutral-400 tracking-[0.2em] mb-3">Resultado Líquido Operacional {resumo.ano}</h3>
            <p className={`text-2xl font-bold tracking-tight ${resumo.saldo_exercicio < 0 ? 'text-red-600' : 'text-[#0073B7]'}`}>
              {formatCurrency(Number(resumo.saldo_exercicio || 0))}
            </p>
            <p className="text-[10px] text-neutral-400 mt-4 leading-relaxed font-medium">Diferença matemática entre as receitas e as despesas operadas exclusivamente este ano.</p>
          </div>
        </div>

        {/* LIVRO CAIXA COMPLETO */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-400">
              Histórico de Lançamentos
            </h3>
            <div className="flex-1 h-px bg-neutral-300"></div>
          </div>

          <div className="w-full bg-white border border-neutral-200/60 rounded-3xl overflow-hidden shadow-2xs">
            {/* Cabeçalho da Tabela */}
            <div className="hidden md:grid grid-cols-12 bg-neutral-50/50 border-b border-neutral-100 py-5 px-8 text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400 select-none">
              <div className="col-span-2">Data</div>
              <div className="col-span-6">Descrição da Operação</div>
              <div className="col-span-2 text-center">Natureza</div>
              <div className="col-span-2 text-right">Valor</div>
            </div>

            {/* Listagem de Movimentações */}
            <div className="divide-y divide-neutral-100">
              {movimentacoes && movimentacoes.length > 0 ? (
                movimentacoes.map((item: Transacao) => {
                  const isDespesa = item.tipo === 'SAIDA';
                  return (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 items-center py-6 px-6 md:px-8 hover:bg-neutral-50/30 transition-colors group">
                      <div className="col-span-2 text-[10px] font-bold text-neutral-400 mb-2 md:mb-0">
                        {new Date(item.data).toLocaleDateString('pt-BR')}
                      </div>
                      
                      <div className="col-span-6 font-bold text-neutral-950 text-sm tracking-tight mb-3 md:mb-0 uppercase">
                        {item.descricao}
                      </div>
                      
                      <div className="col-span-2 flex md:justify-center mb-4 md:mb-0">
                        <span className={`text-[8px] font-bold uppercase px-3 py-1 rounded-full border tracking-widest ${
                          isDespesa ? 'border-red-100 text-red-600 bg-red-50/50' : 'border-blue-100 text-[#0073B7] bg-blue-50/50'
                        }`}>
                          {isDespesa ? 'DESPESA' : 'RECEITA'}
                        </span>
                      </div>
                      
                      <div className={`col-span-2 text-left md:text-right text-base font-bold tracking-tight ${isDespesa ? 'text-red-600' : 'text-neutral-950'}`}>
                        {isDespesa ? '−' : '+'} {formatCurrency(Number(item.valor))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                   <svg className="w-6 h-6 text-neutral-200 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-neutral-400 font-bold text-[10px] uppercase tracking-widest">Nenhum registro para este exercício</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TOTAIS DO RODAPÉ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-neutral-300 pt-10">
          <div className="bg-white border border-neutral-200/60 p-6 rounded-3xl shadow-2xs flex justify-between items-center group hover:shadow-md transition-all duration-300">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Total de Receitas</h3>
            <p className="text-xl md:text-2xl font-bold tracking-tight text-neutral-950">
               {formatCurrency(Number(resumo.total_entrada || 0))}
            </p>
          </div>
          <div className="bg-white border border-neutral-200/60 p-6 rounded-3xl shadow-2xs flex justify-between items-center group hover:shadow-md transition-all duration-300">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Total de Despesas</h3>
            <p className="text-xl md:text-2xl font-bold tracking-tight text-neutral-950">
               {formatCurrency(Number(resumo.total_saida || 0))}
            </p>
          </div>
        </div>
      </div>

      <footer className="mt-40 text-center py-20 border-t border-neutral-200/60 mx-6">
         <p className="text-[10px] font-bold uppercase tracking-[0.6em] text-neutral-300 select-none">DCE UFVJM • Transparência Pública Continuada</p>
      </footer>
    </main>
  );
}