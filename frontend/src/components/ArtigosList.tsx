"use client";

import React, { useEffect, useState } from 'react';
import { Artigo } from '@/types';
import Link from 'next/link';
import { Search, ChevronRight, BookOpen } from 'lucide-react';

interface ArtigosListProps {
  initialArtigos: Artigo[];
}

export default function ArtigosList({ initialArtigos }: ArtigosListProps) {
  const [allArtigos, setAllArtigos] = useState<Artigo[]>(initialArtigos);
  const [filteredArtigos, setFilteredArtigos] = useState<Artigo[]>(initialArtigos);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredArtigos(allArtigos);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = allArtigos.filter((a) => 
        a.titulo.toLowerCase().includes(query) || 
        a.autor.toLowerCase().includes(query) ||
        a.resumo.toLowerCase().includes(query)
      );
      setFilteredArtigos(filtered);
    }
  }, [searchQuery, allArtigos]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header Ultra-Compacto e Legível: Artigos */}
        <div className="mb-10 relative">
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#8CC63F]/5 blur-[50px] rounded-full pointer-events-none -z-10"></div>
          
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-neutral-200/60 pb-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-1 select-none">
                <div className="w-6 h-[2px] bg-[#8CC63F] rounded-full"></div>
                <h3 className="text-[8px] font-black uppercase tracking-[0.3em] text-[#0073B7]">
                  Produção Intelectual
                </h3>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-neutral-950 uppercase">
                Espaço de Artigos
              </h1>
            </div>
            
            <div className="flex items-center gap-3 relative z-20">
              <div className="flex items-center gap-2">
                {showSearchInput && (
                  <input
                    type="text"
                    placeholder="PESQUISAR..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white border border-neutral-200 text-[10px] text-neutral-900 px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#0073B7] font-bold uppercase tracking-widest animate-in fade-in slide-in-from-right-2 duration-300 w-40 md:w-56 shadow-sm"
                    autoFocus
                  />
                )}
                <button
                  onClick={() => {
                    setShowSearchInput(!showSearchInput);
                    if (showSearchInput) setSearchQuery('');
                  }}
                  className={`p-2.5 rounded-xl border transition-all duration-300 ${
                    showSearchInput ? 'bg-[#0073B7] border-[#0073B7] text-white' : 'bg-white border-neutral-200 text-neutral-950 hover:border-[#0073B7]'
                  }`}
                >
                  <Search size={14} strokeWidth={3} />
                </button>
              </div>

              <div className="w-px h-6 bg-neutral-200 mx-1"></div>
              
              <div className="bg-[#8CC63F] w-2 h-2 rounded-full shadow-[0_0_10px_rgba(140,198,63,0.4)] animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Listagem de Artigos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {filteredArtigos.length > 0 ? (
            filteredArtigos.map((artigo) => (
              <article 
                key={artigo.id} 
                className="group bg-white/70 backdrop-blur-sm border border-neutral-200/50 rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_90px_rgba(140,198,63,0.08)] transition-all duration-700 transform hover:-translate-y-2 flex flex-col h-full relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#8CC63F]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#8CC63F]/10 transition-all"></div>
                
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 bg-neutral-50 rounded-2xl flex items-center justify-center border border-neutral-100 shadow-inner group-hover:bg-[#0073B7]/5 transition-colors duration-500">
                    <BookOpen className="text-[#0073B7] group-hover:scale-110 transition-transform duration-500" size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#0073B7] uppercase tracking-[0.25em] mb-1">Autor(a)</p>
                    <p className="text-sm font-black text-neutral-950 uppercase tracking-tight">{artigo.autor}</p>
                  </div>
                </div>

                <Link href={`/artigos/${artigo.slug}/`}>
                  <h2 className="text-2xl font-black text-neutral-950 leading-tight mb-5 tracking-tight group-hover:text-[#0073B7] transition-colors duration-500">
                    {artigo.titulo}
                  </h2>
                </Link>

                <p className="text-neutral-500 text-[15px] leading-relaxed font-medium opacity-85 mb-10 line-clamp-4">
                  {artigo.resumo}
                </p>

                <div className="mt-auto pt-8 border-t border-neutral-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#8CC63F] rounded-full shadow-[0_0_8px_rgba(140,198,63,0.5)]"></div>
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                      {new Date(artigo.data_publicacao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <Link 
                    href={`/artigos/${artigo.slug}/`}
                    className="text-[10px] font-black uppercase tracking-[0.35em] text-[#0073B7] flex items-center gap-2 hover:text-neutral-950 transition-colors group/link"
                  >
                    Ler Artigo <ChevronRight size={14} className="transform transition-transform group-hover/link:translate-x-1.5" />
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full py-32 text-center bg-white/40 backdrop-blur-md rounded-[3rem] border border-dashed border-neutral-200">
              <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-neutral-100 shadow-inner">
                <Search size={32} className="text-neutral-200" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400">Nenhum artigo encontrado para sua busca.</p>
            </div>
          )}
        </div>

      </div>
  );
}
