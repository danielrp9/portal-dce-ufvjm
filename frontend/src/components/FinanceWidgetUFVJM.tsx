import React from 'react';
import { ResumoFinanceiro } from '@/types';

interface FinanceWidgetProps {
  dados: ResumoFinanceiro;
}

export default function FinanceWidgetUFVJM({ dados }: FinanceWidgetProps) {
  // Mantemos o vermelho apenas para alerta de caixa negativo por ser padrão contábil
  const isPositive = dados.status === 'AZUL';

  return (
    <div className={`p-10 rounded-[2.5rem] border-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] transform hover:-translate-y-2 ${isPositive ? 'border-[#0073B7] bg-white' : 'border-red-600 bg-white'}`}>
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-neutral-100">
        <h3 className="font-black text-[11px] uppercase tracking-[0.3em] text-neutral-950">Transparência DCE</h3>
        <span className={`text-[10px] px-4 py-1.5 font-black uppercase tracking-widest rounded-full shadow-sm ${isPositive ? 'bg-[#0073B7] text-white shadow-[#0073B7]/20' : 'bg-red-600 text-white shadow-red-600/20'}`}>
          {isPositive ? 'BALANÇO POSITIVO' : 'BALANÇO EM DÉBITO'}
        </span>
      </div>
      
      <div className="mb-8">
        <p className="text-[11px] text-neutral-400 font-black uppercase tracking-[0.4em] mb-3">Saldo em Caixa</p>
        <p className={`text-5xl font-black tracking-tighter ${isPositive ? 'text-[#0073B7]' : 'text-red-700'}`}>
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(dados.saldo || 0))}
        </p>
      </div>

      <div className="space-y-4 pt-6 border-t border-neutral-100">
        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em]">
          <span className="text-neutral-400">Total Receitas</span>
          <span className="text-[#0073B7] bg-[#0073B7]/5 px-3 py-1 rounded-lg">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(dados.total_entrada || 0))}</span>
        </div>
        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.25em]">
          <span className="text-neutral-400">Total Despesas</span>
          <span className="text-red-600 bg-red-50 px-3 py-1 rounded-lg">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(dados.total_saida || 0))}</span>
        </div>
      </div>
    </div>
  );
} 
