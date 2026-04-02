import React from 'react';
import { ResumoFinanceiro } from '@/types';

interface FinanceWidgetProps {
  dados: ResumoFinanceiro;
}

export default function FinanceWidgetUFVJM({ dados }: FinanceWidgetProps) {
  // Mantemos o vermelho apenas para alerta de caixa negativo por ser padrão contábil
  const isPositive = dados.status === 'AZUL';

  return (
    <div className={`p-8 border-2 ${isPositive ? 'border-[#0073B7] bg-[#0073B7]/5' : 'border-red-600 bg-red-50'}`}>
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-900 italic">Transparência DCE</h3>
        <span className={`text-[9px] px-2 py-1 font-black uppercase ${isPositive ? 'bg-[#0073B7] text-white' : 'bg-red-600 text-white'}`}>
          {dados.status}
        </span>
      </div>
      
      <div className="mb-6">
        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-2">Saldo em Caixa</p>
        <p className={`text-4xl font-black tracking-tighter ${isPositive ? 'text-[#0073B7]' : 'text-red-700'}`}>
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(dados.saldo || 0))}
        </p>
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
          <span className="text-gray-400 italic">Receitas</span>
          <span className="text-[#0073B7]">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(dados.total_entrada || 0))}</span>
        </div>
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
          <span className="text-gray-400 italic">Despesas</span>
          <span className="text-red-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(dados.total_saida || 0))}</span>
        </div>
      </div>
    </div>
  );
} 