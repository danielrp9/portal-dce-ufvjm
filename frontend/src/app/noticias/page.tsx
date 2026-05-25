"use client";

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { Noticia } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import he from 'he';

interface PaginatedNoticias {
  count: number;
  results: Noticia[];
}

export default function NoticiasPage() {
  // Estado local para gerenciar as notícias em tempo real vindas da API do Django
  const [data, setData] = useState<PaginatedNoticias>({ count: 0, results: [] });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchNoticias() {
      try {
        // Busca os dados diretamente da API em runtime no navegador de forma relativa
        const res = await api.get<PaginatedNoticias>('noticias/?page=1');
        setData(res.data);
      } catch (error) {
        console.error("Erro ao buscar notícias em tempo real:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNoticias();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFB] flex items-center justify-center font-sans text-xs font-bold uppercase tracking-widest text-slate-400">
        Carregando Edições...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFDFB] pb-32 selection:bg-black selection:text-white font-serif">
      
      {/* 1. BREADCRUMB EDITORIAL SUTIL */}
      <div className="w-full border-b border-black/5 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 font-sans">
            <Link href="/" className="hover:text-black transition-colors">Início</Link>
            <span>/</span>
            <span className="text-black font-bold">Notícias</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* TÍTULO DA SEÇÃO - REFORMULADO (MAIS SUTIL) */}
        <div className="mb-12 border-b border-black pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black leading-none">
              Últimas <span className="text-[#0073B7]">Edições</span>
            </h1>
            <p className="mt-1 text-[10px] font-sans uppercase tracking-[0.3em] text-slate-400 font-bold">
              Cobertura de Eventos e Atividades do DCE
            </p>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300 font-sans">
              {data.count} matérias encontradas
            </span>
          </div>
        </div>

        {/* 2. GRID EDITORIAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10 border border-black/10">
          {data.results.map((noticia) => (
            <article key={noticia.id} className="bg-[#FDFDFB] flex flex-col group transition-all hover:bg-[#F9F9F7]">
              <Link href={`/noticias/${noticia.slug}`} className="relative aspect-video overflow-hidden border-b border-black/5">
                <Image
                  src={noticia.capa.startsWith('http') ? noticia.capa : `http://127.0.0.1:8000${noticia.capa}`}
                  alt={noticia.titulo} fill className="object-cover"
                />
              </Link>
              
              <div className="p-8 flex-1 flex flex-col">
                <span className="text-[9px] font-bold text-[#0073B7] uppercase tracking-[0.25em] font-sans mb-4">
                  {new Date(noticia.data_publicacao).toLocaleDateString('pt-BR')}
                </span>
                <Link href={`/noticias/${noticia.slug}`}>
                  <h2 className="text-xl font-bold leading-tight text-slate-950 group-hover:text-[#0073B7] transition-colors mb-4 tracking-tight">
                    {noticia.titulo}
                  </h2>
                </Link>
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-8 font-serif italic">
                  {he.decode(noticia.conteudo.replace(/<[^>]*>?/gm, '')).substring(0, 140)}...
                </p>
                <Link 
                  href={`/noticias/${noticia.slug}`}
                  className="mt-auto pt-6 border-t border-black/5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-black transition-all flex items-center justify-between font-sans"
                >
                  Ler Reportagem Completa <span>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}