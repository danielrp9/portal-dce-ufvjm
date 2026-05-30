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
    <div className="max-w-7xl mx-auto px-6 relative z-10">
        
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
        <div className="grid grid-cols-1 md:grid-cols-12 bg-white/70 backdrop-blur-md border border-white mb-12 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.08)] rounded-[3rem] overflow-hidden group hover:shadow-[0_40px_90px_-15px_rgba(0,115,183,0.1)] transition-all duration-700">
          <div className="md:col-span-7 p-10 md:p-14 flex flex-col justify-between items-start gap-8 border-b md:border-b-0 md:border-r border-neutral-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0073B7]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#0073B7]/10 transition-all"></div>
            <div>
              <div className="flex items-center gap-3 mb-6 select-none">
                <span className={`w-3 h-3 rounded-full ${initialResumo.aberto ? 'bg-[#8CC63F] animate-pulse shadow-[0_0_12px_rgba(140,198,63,0.6)]' : 'bg-neutral-300'}`}></span>
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#0073B7]">
                  {initialResumo.aberto ? 'Livro Caixa em Aberto' : 'Contas Consolidadas (Auditado)'}
                </span>
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-neutral-950 leading-tight mb-4">
                Disponibilidade Financeira Líquida
              </h2>
              <p className="text-sm text-neutral-500 max-w-lg leading-relaxed font-medium opacity-80">
                Total de recursos líquidos sob custódia e responsabilidade legal da gestão corrente no exercício de {initialResumo.ano}. Dados auditados automaticamente.
              </p>
            </div>
          </div>
          
          <div className="md:col-span-5 p-10 md:p-14 flex flex-col justify-center bg-[#001529] relative overflow-hidden">
             <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-blue-500/10 blur-[80px] pointer-events-none rounded-full"></div>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-3">Saldo Final Consolidado</p>
            <p className={`text-4xl md:text-5xl font-black tracking-tight drop-shadow-2xl ${isNegative ? 'text-red-500' : 'text-white'}`}>
              {formatCurrency(Number(initialResumo.saldo_final || 0))}
            </p>
            <div className="mt-8">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-2xl border-2 transition-all duration-500 ${isNegative ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-[#8CC63F]/10 text-[#8CC63F] border-[#8CC63F]/20'}`}>
                {isNegative ? 'BALANÇO EM DÉFICIT' : 'BALANÇO EM SUPERÁVIT'}
              </span>
            </div>
          </div>
        </div>

        {/* PARECER */}
        {!initialResumo.aberto && (
          <div className="w-full bg-neutral-950 text-white p-8 md:p-10 mb-10 rounded-3xl shadow-2xs border border-neutral-950">
            <p className="text-sm text-neutral-300 font-light leading-relaxed max-w-4xl">
              {isNegative 
                ? `O Diretório Central dos Estudantes encerrou as atividades financeiras de ${initialResumo.ano} em DÉFICIT. O prejuízo acumulado de ${formatCurrency(Math.abs(initialResumo.saldo_final))} foi computado em definitivo e transportado compulsoriamente como dívida ativa (passivo) para abertura do balanço inicial do próximo exercício.`
                : `O Diretório Central dos Estudantes encerrou as atividades financeiras de ${initialResumo.ano} em SUPERÁVIT. O lucro remanescente líquido de ${formatCurrency(initialResumo.saldo_final)} foi auditado e transportado de forma automática como aporte inicial em caixa para aplicação no próximo ano.`
              }
            </p>
          </div>
        )}

        {/* TABELA DE MOVIMENTAÇÕES */}
        <div className="mb-16">
          <div className="w-full bg-white border border-neutral-200/60 rounded-3xl overflow-hidden shadow-2xs">
            <div className="divide-y divide-neutral-100">
              {initialMovimentacoes && initialMovimentacoes.length > 0 ? (
                initialMovimentacoes.map((item: Transacao) => {
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
                <div className="py-20 text-center text-neutral-400 font-bold text-[10px] uppercase tracking-widest">
                  Nenhum registro para este exercício
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
