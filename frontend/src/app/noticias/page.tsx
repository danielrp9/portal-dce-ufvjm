import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Noticia } from '@/types';
import NoticiasList from '@/components/NoticiasList';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

async function getNoticias(): Promise<Noticia[]> {
  try {
    const res = await fetch(`${API_URL}/api/noticias/?page=1`, {
      next: { revalidate: 60 }, // Revalida a cada 1 minuto
    });
    
    if (!res.ok) {
      throw new Error('Falha ao buscar notícias');
    }
    
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Erro no Server Component:", error);
    return [];
  }
}

export default async function NoticiasPage() {
  const initialNoticias = await getNoticias();

  return (
    <main className="min-h-screen bg-[#F0F2F5] text-neutral-900 selection:bg-[#0073B7] selection:text-white font-sans antialiased pb-32 relative overflow-hidden">
      
      {/* Elementos de Fundo */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#0073B7]/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#8CC63F]/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>

      {/* Breadcrumb */}
      <div className="w-full border-b border-neutral-200/60 mb-12 bg-white/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-5">
          <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            <Link href="/" className="hover:text-[#0073B7] transition-colors">Início</Link>
            <ChevronRight size={10} className="text-neutral-300" />
            <span className="text-neutral-950">Central de Notícias</span>
          </nav>
        </div>
      </div>

      <NoticiasList initialNoticias={initialNoticias} />
      
    </main>
  );
}
