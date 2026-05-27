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
      <div className="min-h-screen bg-white flex items-center justify-center font-sans text-xs font-bold uppercase tracking-widest text-slate-400">
        Carregando Balanços e Auditoria Bancária...
      </div>
    );
  }

  if (errorZeroAnos || !resumo || !anoExercicio) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans gap-4 p-6 text-center">
        <p className="text-xs font-black uppercase tracking-widest text-slate-900">Nenhum Balanço Cadastrado no Sistema</p>
        <Link href="/" className="px-5 py-2.5 bg-slate-950 text-white text-[9px] font-black uppercase tracking-widest rounded-xs">
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
    <main className="min-h-screen bg-white pb-32 text-slate-950 selection:bg-slate-950 selection:text-white font-sans antialiased print:pb-0 print:bg-white">
      
      {/* SELETOR DE EXERCÍCIOS FISCAIS */}
      <div className="w-full bg-slate-50 border-b border-slate-200/80 print:hidden">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <nav className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <Link href="/" className="hover:text-black transition-colors">Início</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-extrabold">Demonstrativo Contábil</span>
          </nav>

          <div className="flex items-center gap-3 relative">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Exercício Fiscal:</span>
            <div className="flex border border-slate-300 bg-white shadow-3xs rounded-xs">
              {anosExpostos.map((ano) => (
                <button 
                  key={ano} 
                  onClick={() => { window.location.search = `?ano=${ano}`; }}
                  className={`text-[10px] font-black px-4 py-2 uppercase tracking-wider transition-all border-r border-slate-200 last:border-r-0 focus:outline-none ${
                    anoExercicio === String(ano) ? 'bg-slate-950 text-white border-slate-950' : 'text-slate-600 hover:text-black hover:bg-slate-50'
                  }`}
                >
                  {ano}
                </button>
              ))}

              {anosOcultos.length > 0 && (
                <div className="relative Harman-Layout flex items-center">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
                    className={`text-[10px] font-black px-4 py-2 uppercase tracking-wider focus:outline-none flex items-center gap-1.5 h-full ${
                      isAnoAtivoOcultado ? 'bg-[#0073B7] text-white' : 'text-slate-600 hover:text-black'
                    }`}
                  >
                    {isAnoAtivoOcultado ? `Ano: ${anoExercicio}` : "Outros Anos"}
                    <svg className={`w-3 h-3 transition-transform duration-200 ${showDropdown ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-300 rounded-xs shadow-md py-1 z-50 flex flex-col animate-in fade-in slide-in-from-top-1 duration-150">
                      {anosOcultos.map((ano) => (
                        <button
                          key={ano}
                          onClick={() => { window.location.search = `?ano=${ano}`; }}
                          className={`text-left text-[10px] font-black px-4 py-2.5 uppercase tracking-wider border-b border-slate-100 last:border-b-0 ${
                            anoExercicio === String(ano) ? 'bg-slate-950 text-white' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
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

      <div className="max-w-6xl mx-auto px-6 pt-12 print:pt-0 print:px-0">
        
        {/* CABEÇALHO DO EXTRATO BANCÁRIO */}
        <header className="mb-10 border-b-2 border-slate-950 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <span className="text-[10px] font-black text-[#0073B7] uppercase tracking-[0.25em] block mb-1">
              Diretório Central dos Estudantes — UFVJM
            </span>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-950 leading-none">
              Extrato de Conta Consolidado
            </h1>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              Auditoria de Fluxo de Caixa • Exercício Fiscal {resumo.ano}
            </p>
          </div>

          {/* BOTÃO EXPORTAR PDF COMPACTO (Aproveita a estilização nativa de impressão) */}
          <button
            onClick={() => window.print()}
            className="print:hidden inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-slate-950 text-slate-900 px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-xs transition-all shadow-3xs"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.82l2.12-2.12m0 0l2.12 2.12m-2.12-2.12V19.5M18 12a3 3 0 100-6M5.433 13.184l1.32-.44a1.205 1.205 0 011.53.642l.147.441a1.205 1.205 0 001.53.641l1.319-.44" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-4.5m4.5 0a3 3 0 01-3 3h-3M1.5 12a3 3 0 013-3h3m-3 3a3 3 0 003 3h3M9 1.5v3M15 1.5v3" />
            </svg>
            Imprimir Extrato (PDF)
          </button>
        </header>

        {/* COMPONENTE DA DISPONIBILIDADE LÍQUIDA BANCÁRIA */}
        <div className="grid grid-cols-1 md:grid-cols-12 border border-slate-950 mb-10 bg-white shadow-2xs rounded-xs overflow-hidden">
          <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between items-start gap-6 border-b md:border-b-0 md:border-r border-slate-950 bg-white">
            <div>
              <div className="flex items-center gap-2.5 mb-3 select-none">
                <span className={`w-2.5 h-2.5 rounded-full ${resumo.aberto ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  {resumo.aberto ? 'Livro Caixa Aberto (Operação Real)' : 'Contas Auditadas (Cofre Selado)'}
                </span>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 leading-tight">
                Disponibilidade Financeira Líquida
              </h2>
              <p className="text-[11px] text-slate-400 mt-1 max-w-md font-medium">
                Recursos totais líquidos sob custódia e responsabilidade legal da gestão corrente do diretório central.
              </p>
            </div>
          </div>
          
          <div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-center bg-slate-50/50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Saldo Final Consolidado</p>
            <p className={`text-3xl md:text-4xl font-black tracking-tight font-mono ${isNegative ? 'text-red-600' : 'text-slate-950'}`}>
              {formatCurrency(Number(resumo.saldo_final || 0))}
            </p>
            <div className="mt-2.5">
              <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-xs border ${isNegative ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                {isNegative ? 'BALANÇO EM DÉFICIT' : 'BALANÇO EM SUPERÁVIT'}
              </span>
            </div>
          </div>
        </div>

        {/* TEXTO DE PARECER / ATA CASO O ANO ESTEJA FECHADO */}
        {!resumo.aberto && (
          <div className="w-full bg-slate-950 text-white p-6 md:p-8 mb-10 rounded-xs shadow-2xs font-sans border border-slate-950">
            <div className="max-w-3xl border-b border-white/10 pb-4 mb-4">
              <h3 className="text-sm font-black uppercase tracking-wide text-white">Ata de Encerramento e Homologação Automática</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-light">Demonstrativo Imutável Gerado pelo Sistema de Integridade</p>
            </div>
            <p className="text-xs text-slate-300 font-light leading-relaxed max-w-4xl">
              {isNegative 
                ? `O Diretório Central dos Estudantes encerrou as atividades financeiras de ${resumo.ano} em DÉFICIT. O prejuízo acumulado de ${formatCurrency(Math.abs(resumo.saldo_final))} foi computado em definitivo e transportado compulsoriamente como dívida ativa (passivo) para abertura do balanço inicial do próximo exercício.`
                : `O Diretório Central dos Estudantes encerrou as Atividades financeiras de ${resumo.ano} em SUPERÁVIT. O lucro remanescente líquido de ${formatCurrency(resumo.saldo_final)} foi auditado e transportado de forma automática como aporte inicial em caixa para aplicação no próximo ano.`
              }
            </p>
          </div>
        )}

        {/* RESUMO DE TRANSPORTE CONTÁBIL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="border border-slate-200 bg-slate-50/30 p-5 rounded-xs flex flex-col justify-between">
            <div>
              <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                {resumo.saldo_anterior >= 0 ? "Aporte Inicial (Lucro Herdado)" : "Passivo Inicial (Dívida Herdada)"}
              </h3>
              <p className={`text-xl font-black font-mono ${resumo.saldo_anterior < 0 ? 'text-red-600' : 'text-slate-950'}`}>
                {formatCurrency(Number(resumo.saldo_anterior || 0))}
              </p>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 leading-tight">Valor contábil líquido herdado diretamente da virada de lote do exercício passado.</p>
          </div>

          <div className="border border-slate-200 bg-slate-50/30 p-5 rounded-xs flex flex-col justify-between">
            <div>
              <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">Resultado Líquido das Operações de {resumo.ano}</h3>
              <p className={`text-xl font-black font-mono ${resumo.saldo_exercicio < 0 ? 'text-red-600' : 'text-[#0073B7]'}`}>
                {formatCurrency(Number(resumo.saldo_exercicio || 0))}
              </p>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 leading-tight">Diferença matemática bruta entre as receitas e as despesas operadas exclusivamente este ano.</p>
          </div>
        </div>

        {/* LIVRO CAIXA COMPLETO (Visível na rolagem mesmo com o ano encerrado para transparência pública) */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-5 select-none">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-900">
              Livro Caixa / Histórico Completo de Lançamentos
            </h3>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <div className="w-full border border-slate-300 rounded-xs overflow-hidden shadow-3xs bg-white">
            {/* Cabeçalho da Tabela Tipo Extrato */}
            <div className="grid grid-cols-12 bg-slate-100 border-b border-slate-300 py-3 px-4 md:px-6 text-[9px] font-black uppercase tracking-wider text-slate-500 select-none">
              <div className="col-span-2">Data</div>
              <div className="col-span-6 md:col-span-7">Histórico / Descrição da Operação</div>
              <div className="col-span-2 md:col-span-1 text-center">Fluxo</div>
              <div className="col-span-2 text-right">Valor</div>
            </div>

            {/* Listagem de Linhas do Extrato */}
            <div className="divide-y divide-slate-200 bg-white">
              {movimentacoes && movimentacoes.length > 0 ? (
                movimentacoes.map((item: Transacao) => {
                  const isDespesa = item.tipo === 'SAIDA';
                  return (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 items-center py-4 px-4 md:px-6 hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-b-0">
                      {/* Data da movimentação */}
                      <div className="col-span-2 text-[10px] font-bold text-slate-400 font-mono mb-1 md:mb-0">
                        {new Date(item.data).toLocaleDateString('pt-BR')}
                      </div>
                      
                      {/* Descrição em alta visibilidade */}
                      <div className="col-span-6 md:col-span-7 font-bold text-slate-900 text-sm tracking-tight mb-2 md:mb-0 uppercase text-left truncate max-w-xl">
                        {item.descricao}
                      </div>
                      
                      {/* Badge Contábil de Natureza */}
                      <div className="col-span-2 md:col-span-1 flex md:justify-center mb-2 md:mb-0 select-none">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-xs border tracking-wide ${
                          isDespesa ? 'border-red-200 text-red-700 bg-red-50' : 'border-blue-200 text-[#0073B7] bg-blue-50'
                        }`}>
                          {isDespesa ? 'DESPESA' : 'RECEITA'}
                        </span>
                      </div>
                      
                      {/* Valor monetário formatado em fonte monoespaçada */}
                      <div className={`col-span-2 text-left md:text-right text-base font-black font-mono tracking-tight ${isDespesa ? 'text-red-600' : 'text-slate-950'}`}>
                        {isDespesa ? '−' : '+'} {formatCurrency(Number(item.valor))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-20 text-center bg-white">
                  <p className="text-slate-300 font-black text-xs uppercase tracking-wider">Nenhum registro contábil efetuado neste lote anual.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TOTAIS DO RAZONETE (RODAPÉ DO EXTRATO BANCÁRIO) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-300 pt-8 print:mt-10">
          <div className="space-y-1 bg-white border border-slate-200 p-5 rounded-xs shadow-3xs flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Arrecadação Bruta (Receitas)</h3>
            <p className="text-xl md:text-2xl font-black font-mono text-slate-900">
               {formatCurrency(Number(resumo.total_entrada || 0))}
            </p>
          </div>
          <div className="space-y-1 bg-white border border-slate-200 p-5 rounded-xs shadow-3xs flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Custo Acumulado (Despesas)</h3>
            <p className="text-xl md:text-2xl font-black font-mono text-slate-900">
               {formatCurrency(Number(resumo.total_saida || 0))}
            </p>
          </div>
        </div>
      </div>

      <footer className="mt-40 text-center py-16 border-t border-slate-100 mx-6 print:mt-20">
         <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-300 select-none">DCE UFVJM • Transparência Pública Continuada</p>
      </footer>
    </main>
  );
}