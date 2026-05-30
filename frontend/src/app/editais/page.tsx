import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Edital } from '@/types';
import EditaisList from '@/components/EditaisList';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

async function getEditais(): Promise<Edital[]> {
  try {
    const res = await fetch(`${API_URL}/api/editais/`, {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      throw new Error('Falha ao buscar editais');
    }
    
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Erro ao buscar editais no servidor:", error);
    return [];
  }
}

export default async function EditaisPage() {
  const initialEditais = await getEditais();

  return (
    <main className="min-h-screen bg-[#F4F6F8] text-neutral-900 selection:bg-[#0073B7] selection:text-white font-sans antialiased pb-32 relative overflow-hidden">
      
      {/* Elementos de Fundo - Suavizados */}
      <div className="absolute top-[-5%] right-[-5%] w-[900px] h-[900px] bg-[#0073B7]/6 blur-[180px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[1000px] h-[1000px] bg-[#8CC63F]/5 blur-[200px] rounded-full pointer-events-none -z-10"></div>

      {/* BREADCRUMB */}
      <div className="w-full bg-white/60 backdrop-blur-md border-b border-neutral-200/60 mb-12 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            <Link href="/" className="hover:text-[#0073B7] transition-colors">Início</Link>
            <ChevronRight size={10} className="text-neutral-300" />
            <span className="text-neutral-900 font-black">Editais e Chamadas</span>
          </nav>
        </div>
      </div>

      <EditaisList initialEditais={initialEditais} />
      
    </main>
  );
}
