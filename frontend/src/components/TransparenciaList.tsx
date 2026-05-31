"use client";

import React, { useState, useEffect } from 'react';
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

interface TransparenciaListProps {
  initialMovimentacoes: Transacao[];
  initialResumo: ResumoFinanceiroCompleto;
  anosDisponiveis: number[];
  anoExercicio: string;
}

export default function TransparenciaList({ 
  initialMovimentacoes, 
  initialResumo, 
  anosDisponiveis, 
  anoExercicio 
}: TransparenciaListProps) {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  useEffect(() => {
    const handleOutsideClick = () => setShowDropdown(false);
    if (showDropdown) {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [showDropdown]);

  const isNegative = initialResumo.status === 'VERMELHO';
  
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const doisMaisNovos = anosDisponiveis.slice(0, 2);
  let anosPrincipais = Array.from(new Set([...doisMaisNovos, Number(anoExercicio)]));
  anosPrincipais.sort((a, b) => b - a);

  const anosNoHistorico = anosDisponiveis.filter(ano => !anosPrincipais.includes(ano)).sort((a, b) => b - a);

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        
        {/* Header Ultra-Compacto e Legível: Transparência */}
        <div className="mb-10 relative">
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#0073B7]/5 blur-[50px] rounded-full pointer-events-none"></div>
          
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-neutral-200/60 pb-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-1 select-none">
                <div className="w-6 h-[2px] bg-[#0073B7] rounded-full"></div>
                <h3 className="text-[8px] font-black uppercase tracking-[0.3em] text-[#0073B7]">
                  Transparência Pública
                </h3>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-neutral-950 uppercase">
                Demonstrativo de Contas
              </h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 relative z-20">
              <div className="flex items-center gap-2 bg-white border border-neutral-200 shadow-sm rounded-2xl p-1.5">
                {anosPrincipais.map((ano) => (
                  <Link 
                    key={ano} 
                    href={`/transparencia/?ano=${ano}`}
                    className={`text-[9px] font-black px-5 py-2.5 uppercase tracking-widest transition-all rounded-xl ${
                      anoExercicio === String(ano) ? 'bg-[#0073B7] text-white shadow-md' : 'text-neutral-500 hover:text-[#0073B7] hover:bg-neutral-50'
                    }`}
                  >
                    {ano}
                  </Link>
                ))}

                {anosNoHistorico.length > 0 && (
                  <div className="relative flex items-center" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={(e) => { 
                        e.preventDefault();
                        setShowDropdown(!showDropdown); 
                      }}
                      className={`text-[9px] font-black px-5 py-2.5 uppercase tracking-widest transition-all rounded-xl ${
                        showDropdown ? 'bg-neutral-950 text-white' : 'text-neutral-500 hover:text-[#0073B7] hover:bg-neutral-50'
                      }`}
                    >
                      Histórico
                    </button>

                    {showDropdown && (
                      <div className="absolute right-0 top-full mt-3 w-44 bg-white border border-neutral-200 shadow-2xl rounded-2xl py-3 z-[100] flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                        {anosNoHistorico.map((ano) => (
                          <Link
                            key={ano}
                            href={`/transparencia/?ano=${ano}`}
                            onClick={() => setShowDropdown(false)}
                            className="text-left text-[9px] font-black px-6 py-3 uppercase tracking-widest transition-colors text-neutral-500 hover:bg-neutral-50 hover:text-[#0073B7]"
                          >
                            Exercício {ano}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="w-px h-6 bg-neutral-200 mx-1"></div>

              <button
                onClick={() => window.print()}
                className="print:hidden bg-neutral-950 text-white hover:bg-[#8CC63F] hover:text-neutral-950 px-6 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-95"
              >
                Gerar PDF
              </button>
            </div>
          </div>
        </div>

        {/* CARD DE DISPONIBILIDADE LÍQUIDA */}
        <div className="grid grid-cols-1 md:grid-cols-12 bg-white border border-white mb-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] rounded-[3rem] overflow-hidden group hover:shadow-[0_50px_120px_-20px_rgba(0,115,183,0.15)] transition-all duration-700 relative">
          <div className="md:col-span-7 p-10 md:p-14 flex flex-col justify-between items-start gap-10 border-b md:border-b-0 md:border-r border-neutral-100 relative overflow-hidden bg-white">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#0073B7]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#0073B7]/10 transition-all"></div>
            <div>
              <div className="flex items-center gap-4 mb-8 select-none">
                <span className={`w-4 h-4 rounded-full ${initialResumo.aberto ? 'bg-[#8CC63F] animate-pulse shadow-[0_0_15px_rgba(140,198,63,0.8)]' : 'bg-neutral-300'}`}></span>
                <span className="text-[12px] font-black uppercase tracking-[0.3em] text-[#0073B7]">
                  {initialResumo.aberto ? 'Livro Caixa em Aberto' : 'Contas Consolidadas (Auditado)'}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-neutral-950 leading-tight mb-6">
                Disponibilidade <br/><span className="text-[#0073B7]">Financeira Líquida</span>
              </h2>
              <div className="w-16 h-1.5 bg-[#8CC63F] rounded-full mb-8"></div>
              <p className="text-base text-neutral-500 max-w-lg leading-relaxed font-bold opacity-100">
                Total de recursos líquidos sob custódia e responsabilidade legal da gestão corrente no exercício de {initialResumo.ano}. Dados auditados automaticamente.
              </p>
            </div>
          </div>
          
          <div className="md:col-span-5 p-10 md:p-14 flex flex-col justify-center bg-[#001529] relative overflow-hidden shadow-inner">
             <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none rounded-full"></div>
            <p className="text-[12px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-4">Saldo Final Consolidado</p>
            <p className={`text-4xl md:text-6xl font-black tracking-tighter drop-shadow-2xl ${isNegative ? 'text-red-500' : 'text-white'}`}>
              {formatCurrency(Number(initialResumo.saldo_final || 0))}
            </p>
            <div className="mt-10">
              <span className={`text-[11px] font-black uppercase tracking-[0.25em] px-8 py-4 rounded-[1.5rem] border-2 shadow-2xl transition-all duration-500 ${isNegative ? 'bg-red-500 text-white border-red-500 shadow-red-500/20' : 'bg-[#8CC63F] text-neutral-950 border-[#8CC63F] shadow-[0_15px_30px_rgba(140,198,63,0.3)]'}`}>
                {isNegative ? 'BALANÇO EM DÉFICIT' : 'BALANÇO EM SUPERÁVIT'}
              </span>
            </div>
          </div>
        </div>

        {/* PARECER */}
        {!initialResumo.aberto && (
          <div className="w-full bg-[#001529] text-white p-10 md:p-14 mb-16 rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] border-l-8 border-[#8CC63F] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full"></div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#8CC63F] mb-6">Parecer de Encerramento</h4>
            <p className="text-lg text-neutral-200 font-bold leading-relaxed max-w-5xl">
              {isNegative 
                ? `O Diretório Central dos Estudantes encerrou as atividades financeiras de ${initialResumo.ano} em DÉFICIT. O prejuízo acumulado de ${formatCurrency(Math.abs(initialResumo.saldo_final))} foi computado em definitivo e transportado compulsoriamente como dívida ativa (passivo) para abertura do balanço inicial do próximo exercício.`
                : `O Diretório Central dos Estudantes encerrou as atividades financeiras de ${initialResumo.ano} em SUPERÁVIT. O lucro remanescente líquido de ${formatCurrency(initialResumo.saldo_final)} foi auditado e transportado de forma automática como aporte inicial em caixa para aplicação no próximo ano.`
              }
            </p>
          </div>
        )}

        {/* TABELA DE MOVIMENTAÇÕES */}
        <div className="mb-24">
          <div className="w-full bg-white border border-neutral-100 rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]">
            <div className="bg-[#F8FAFC] border-b border-neutral-100 px-8 py-5 flex items-center justify-between">
               <span className="text-[11px] font-black uppercase tracking-[0.3em] text-neutral-400">Movimentações do Exercício</span>
               <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#0073B7]">Registro Oficial</span>
            </div>
            <div className="divide-y divide-neutral-50">
              {initialMovimentacoes && initialMovimentacoes.length > 0 ? (
                initialMovimentacoes.map((item: Transacao) => {
                  const isDespesa = item.tipo === 'SAIDA';
                  return (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 items-center py-8 px-8 md:px-12 hover:bg-neutral-50/50 transition-all group">
                      <div className="col-span-2 text-[11px] font-black text-neutral-400 mb-3 md:mb-0 uppercase tracking-widest">
                        {new Date(item.data).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="col-span-6 font-black text-neutral-950 text-base tracking-tight mb-4 md:mb-0 uppercase">
                        {item.descricao}
                      </div>
                      <div className="col-span-2 flex md:justify-center mb-5 md:mb-0">
                        <span className={`text-[9px] font-black uppercase px-4 py-2 rounded-xl border-2 tracking-widest ${
                          isDespesa ? 'border-red-100 text-red-600 bg-red-50 shadow-sm' : 'border-blue-100 text-[#0073B7] bg-blue-50 shadow-sm'
                        }`}>
                          {isDespesa ? 'DESPESA' : 'RECEITA'}
                        </span>
                      </div>
                      <div className={`col-span-2 text-left md:text-right text-lg font-black tracking-tighter ${isDespesa ? 'text-red-600' : 'text-neutral-950'}`}>
                        {isDespesa ? '−' : '+'} {formatCurrency(Number(item.valor))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-24 text-center text-neutral-400 font-black text-xs uppercase tracking-[0.5em]">
                  Nenhum registro para este exercício
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
