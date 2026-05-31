"use client";

import React, { useState, useEffect } from 'react';
import { Artigo, PaginatedResponse } from '@/types';
import Link from 'next/link';
import { Search, ChevronRight, BookOpen } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Pagination from './Pagination';

import api from '@/services/api';

export default function ArtigosList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';

  const [data, setData] = useState<PaginatedResponse<Artigo> | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSearchInput, setShowSearchInput] = useState<boolean>(search !== '');
  const [searchQuery, setSearchQuery] = useState<string>(search);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          search: search || undefined
        };

        const res = await api.get('/artigos/', { params });
        setData(res.data);
      } catch (error) {
        console.error("Erro ao buscar artigos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, search]);

  const PAGE_SIZE = 6;
  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 0;

  const updateFilters = (newPage: number, newSearch: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newPage > 1) params.set('page', newPage.toString());
    else params.delete('page');
    
    if (newSearch) params.set('search', newSearch);
    else params.delete('search');
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(1, searchQuery);
  };

  const handlePageChange = (newPage: number) => {
    updateFilters(newPage, search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && !data) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0073B7]"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        
        {/* Header Ultra-Compacto e Legível: Artigos */}
        <div className="mb-10 relative">
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#8CC63F]/5 blur-[50px] rounded-full pointer-events-none -z-10"></div>
          
          <div className="relative flex flex-row items-center justify-between gap-4 border-b border-neutral-200/60 pb-6">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 select-none">
                <div className="w-6 h-[2px] bg-[#8CC63F] rounded-full"></div>
                <h3 className="text-[8px] font-black uppercase tracking-[0.3em] text-[#0073B7]">
                  Produção Intelectual
                </h3>
              </div>
              <h1 className="text-xl md:text-3xl font-black tracking-tight text-neutral-950 uppercase truncate">
                Espaço de Artigos
              </h1>
            </div>
            
            <div className="flex items-center gap-2 md:gap-3 relative z-20 shrink-0">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
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
                  type="button"
                  onClick={() => {
                    if (showSearchInput && searchQuery) {
                      updateFilters(1, '');
                      setSearchQuery('');
                    }
                    setShowSearchInput(!showSearchInput);
                  }}
                  className={`p-2.5 rounded-xl border transition-all duration-300 ${
                    showSearchInput ? 'bg-[#0073B7] border-[#0073B7] text-white' : 'bg-white border-neutral-200 text-neutral-950 hover:border-[#0073B7]'
                  }`}
                >
                  <Search size={14} strokeWidth={3} />
                </button>
              </form>

              <div className="w-px h-6 bg-neutral-200 mx-1"></div>
              
              <div className="bg-[#8CC63F] w-2 h-2 rounded-full shadow-[0_0_10px_rgba(140,198,63,0.4)] animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Listagem de Artigos - Alterado para Lista (1 coluna) */}
        <div className={`flex flex-col gap-8 transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          {data.results.length > 0 ? (
            data.results.map((artigo) => (
              <article 
                key={artigo.id} 
                className="group bg-white border border-neutral-100 rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_40px_80px_rgba(140,198,63,0.1)] transition-all duration-700 transform hover:-translate-y-2 flex flex-col lg:flex-row gap-8 relative overflow-hidden"
              >
                {/* Efeito de luz interna sutil no hover */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#8CC63F]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="flex items-center gap-6 lg:w-1/4 flex-shrink-0">
                  <div className="w-16 h-16 bg-[#F8FAFC] rounded-2xl flex items-center justify-center border border-neutral-100 shadow-sm group-hover:bg-[#0073B7] group-hover:text-white transition-all duration-500">
                    <BookOpen className="group-hover:scale-110 transition-transform duration-500" size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-[2px] bg-[#8CC63F]"></div>
                      <p className="text-[10px] font-black text-[#0073B7] uppercase tracking-[0.3em]">Autor(a)</p>
                    </div>
                    <p className="text-sm font-black text-neutral-950 uppercase tracking-tight line-clamp-1">{artigo.autor}</p>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <Link href={`/artigos/${artigo.slug}/`}>
                    <h2 className="text-2xl font-black text-neutral-950 leading-tight mb-4 tracking-tight group-hover:text-[#0073B7] transition-colors duration-500 uppercase line-clamp-1">
                      {artigo.titulo}
                    </h2>
                  </Link>

                  <p className="text-neutral-500 text-sm leading-relaxed font-medium opacity-100 mb-6 line-clamp-2">
                    {artigo.resumo}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#8CC63F] rounded-full shadow-[0_0_12px_rgba(140,198,63,0.6)] animate-pulse"></div>
                      <span className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em]">
                        {new Date(artigo.data_publicacao).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <Link 
                      href={`/artigos/${artigo.slug}/`}
                      className="text-[11px] font-black uppercase tracking-[0.4em] text-[#0073B7] flex items-center gap-3 hover:text-neutral-950 transition-colors group/link"
                    >
                      Ler Artigo <ChevronRight size={18} className="transform transition-transform group-hover/link:translate-x-1.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full py-32 text-center bg-white rounded-[3.5rem] border-2 border-dashed border-neutral-200 shadow-inner">
              <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-neutral-100 shadow-sm">
                <Search size={40} className="text-neutral-200" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-neutral-400">Nenhum artigo encontrado para sua busca.</p>
            </div>
          )}
        </div>

        <Pagination 
          currentPage={page} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />

      </div>
  );
}
