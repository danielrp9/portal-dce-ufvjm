"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import TransparenciaList from '@/components/TransparenciaList';
import api from '@/services/api';

function TransparenciaContent() {
  const searchParams = useSearchParams();
  const ano = searchParams.get('ano');
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getTransparenciaData(ano: string | null) {
      try {
        const anosRes = await api.get('financeiro/anos/');
        const anosData = anosRes.data;
        const listaAnos = (anosData || []).map((item: any) => item.ano).sort((a: number, b: number) => b - a);

        if (listaAnos.length === 0) return null;

        const anoAtivo = ano || listaAnos[0].toString();

        const [listaRes, resumoRes] = await Promise.all([
          api.get(`financeiro/?ano=${anoAtivo}`),
          api.get(`financeiro/resumo/?ano=${anoAtivo}`)
        ]);

        return {
          movimentacoes: Array.isArray(listaRes.data) ? listaRes.data : (listaRes.data.results || []),
          resumo: resumoRes.data,
          anosDisponiveis: listaAnos,
          anoExercicio: anoAtivo
        };
      } catch (error) {
        console.error("Erro ao buscar transparência:", error);
        return null;
      }
    }

    async function load() {
      setLoading(true);
      const d = await getTransparenciaData(ano);
      setData(d);
      setLoading(false);
    }
    load();
  }, [ano]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center font-sans gap-4">
        <div className="w-10 h-10 border-4 border-[#0073B7] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Carregando Balanço...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center font-sans gap-4 p-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Nenhum Balanço Cadastrado</p>
        <Link href="/" className="px-6 py-3 bg-neutral-950 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all">
          Voltar ao início
        </Link>
      </div>
    );
  }

  return (
    <TransparenciaList 
      initialMovimentacoes={data.movimentacoes}
      initialResumo={data.resumo}
      anosDisponiveis={data.anosDisponiveis}
      anoExercicio={data.anoExercicio}
    />
  );
}

export default function TransparenciaPage() {
  return (
    <main className="min-h-screen bg-[#F0F2F5] pb-32 text-neutral-900 selection:bg-[#0073B7] selection:text-white font-sans antialiased print:pb-0 print:bg-white relative overflow-hidden">
      
      {/* Elementos de Fundo */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#0073B7]/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-[#8CC63F]/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>

      {/* BREADCRUMB */}
      <div className="w-full border-b border-neutral-200/60 mb-12 bg-white/60 backdrop-blur-md sticky top-0 z-40 print:hidden">
        <div className="max-w-[1440px] mx-auto px-6 py-5">
          <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            <Link href="/" className="hover:text-[#0073B7] transition-colors">Início</Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-950 font-black">Transparência Financeira</span>
          </nav>
        </div>
      </div>

      <Suspense fallback={
        <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center font-sans gap-4">
          <div className="w-10 h-10 border-4 border-[#0073B7] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Iniciando Auditoria...</p>
        </div>
      }>
        <TransparenciaContent />
      </Suspense>

      <footer className="mt-40 text-center py-20 border-t border-neutral-200/60 mx-6">
         <p className="text-[10px] font-black uppercase tracking-[0.6em] text-neutral-300 select-none">DCE UFVJM • Transparência Pública Continuada</p>
      </footer>
    </main>
  );
}
