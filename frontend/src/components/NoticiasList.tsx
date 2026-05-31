"use client";

import React, { useState, useEffect } from 'react';
import { Noticia, PaginatedResponse } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import he from 'he';
import { Search, Filter, ChevronRight } from 'lucide-react';
import { getMediaUrl } from '@/utils/urls';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Pagination from './Pagination';

import api from '@/services/api';

export default function NoticiasList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const campus = searchParams.get('campus') || 'GERAL';

  const [data, setData] = useState<PaginatedResponse<Noticia> | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCampusFilters, setShowCampusFilters] = useState<boolean>(campus !== 'GERAL');
  const [showSearchInput, setShowSearchInput] = useState<boolean>(search !== '');
  const [searchQuery, setSearchQuery] = useState<string>(search);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          search: search || undefined,
          campus: campus !== 'GERAL' ? campus : undefined
        };

        const res = await api.get('/noticias/', { params });
        setData(res.data);
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, search, campus]);

  const PAGE_SIZE = 6;
  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 0;

  const updateFilters = (newPage: number, newSearch: string, newCampus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newPage > 1) params.set('page', newPage.toString());
    else params.delete('page');
    
    if (newSearch) params.set('search', newSearch);
    else params.delete('search');
    
    if (newCampus !== 'GERAL') params.set('campus', newCampus);
    else params.delete('campus');
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(1, searchQuery, campus);
  };

  const handlePageChange = (newPage: number) => {
    updateFilters(newPage, search, campus);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCampusChange = (newCampus: string) => {
    updateFilters(1, search, newCampus);
  };

  const campusOptions = [
    { value: 'GERAL', label: 'Geral' },
    { value: 'DIAMANTINA', label: 'Diamantina' },
    { value: 'UNAI', label: 'Unaí' },
    { value: 'MUCURI', label: 'Mucuri' },
    { value: 'JANAUBA', label: 'Janaúba' },
  ];

  if (loading && !data) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0073B7]"></div>
      </div>
    );
  }

  if (!data) return null;

  const showPrincipais = page === 1 && !search && campus === 'GERAL';
  const principais = showPrincipais ? data.results.slice(0, 3) : [];
  const emLista = showPrincipais ? data.results.slice(3) : data.results;

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        
        {/* Header Ultra-Compacto e Legível: Notícias */}
        <div className="mb-10 relative">
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#0073B7]/5 blur-[50px] rounded-full pointer-events-none"></div>
          
          <div className="relative flex flex-row items-center justify-between gap-4 border-b border-neutral-200/60 pb-6">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 select-none">
                <div className="w-6 h-[2px] bg-[#0073B7] rounded-full"></div>
                <h3 className="text-[8px] font-black uppercase tracking-[0.3em] text-[#0073B7]">
                  Notícias Estudantis
                </h3>
              </div>
              <h1 className="text-xl md:text-3xl font-black tracking-tight text-neutral-950 uppercase truncate">
                Notícias
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
                       updateFilters(1, '', campus);
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

              <button
                onClick={() => setShowCampusFilters(!showCampusFilters)}
                className={`flex items-center gap-2.5 px-4 py-2.5 border text-[9px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 shadow-sm ${
                  showCampusFilters ? 'bg-neutral-950 border-neutral-950 text-white' : 'bg-white border-neutral-200 text-neutral-950 hover:border-neutral-950'
                }`}
              >
                <Filter size={12} strokeWidth={3} />
                {showCampusFilters ? 'Ocultar' : 'Filtrar'}
              </button>
            </div>
          </div>
        </div>

        {/* Filtros Glassmorphism */}
        {showCampusFilters && (
          <div className="w-full bg-white/70 backdrop-blur-md border border-white shadow-[0_20px_40px_rgba(0,0,0,0.05)] p-8 rounded-[2.5rem] mb-16 flex flex-col sm:flex-row gap-6 items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0073B7] flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#8CC63F] rounded-full"></div>
                Filtrar por Campus:
              </span>
              <div className="flex flex-wrap gap-3">
                {campusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleCampusChange(opt.value)}
                    className={`text-[9px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full border-2 transition-all duration-300 ${
                      campus === opt.value
                        ? 'bg-[#0073B7] border-[#0073B7] text-white shadow-[0_5px_15px_rgba(0,115,183,0.3)]'
                        : 'bg-white border-neutral-100 text-neutral-400 hover:border-[#0073B7] hover:text-[#0073B7]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        <div className={`transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          {/* Grid de Destaques */}
          {principais.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
              {principais.map((noticia: Noticia) => (
                <article 
                  key={noticia.id} 
                  className="group cursor-pointer bg-white/80 backdrop-blur-sm border border-neutral-200/50 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_rgba(0,115,183,0.12)] flex flex-col transform transition-all duration-700 hover:-translate-y-2"
                >
                  <Link href={`/noticias/${noticia.slug}/`} className="relative aspect-video overflow-hidden bg-neutral-950">
                    <Image
                      src={getMediaUrl(noticia.capa)}
                      alt={noticia.titulo} 
                      fill 
                      className="object-cover transition-all duration-1000 ease-out group-hover:scale-110 group-hover:opacity-80"
                    />
                    <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md text-[#0073B7] text-[8px] px-4 py-2 font-black uppercase tracking-[0.2em] z-10 rounded-full border border-white/40 shadow-lg">
                      {noticia.campus_display || 'Geral'}
                    </div>
                  </Link>
                  
                  <div className="p-8 flex-1 flex flex-col relative">
                    <div className="absolute top-0 right-8 w-12 h-1 bg-[#8CC63F] rounded-b-full shadow-[0_0_10px_rgba(140,198,63,0.3)]"></div>

                    <div className="flex justify-between items-center mb-4 text-[10px] font-black text-[#8CC63F] uppercase tracking-wider">
                      <span className="text-neutral-400 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-neutral-200 rounded-full"></div>
                        Editorial
                      </span>
                      <span>{new Date(noticia.data_publicacao).toLocaleDateString('pt-BR')}</span>
                    </div>

                    <Link href={`/noticias/${noticia.slug}/`}>
                      <h2 className="text-xl font-black leading-tight text-neutral-950 group-hover:text-[#0073B7] transition-colors duration-500 mb-4 tracking-tight line-clamp-2">
                        {noticia.titulo}
                      </h2>
                    </Link>
                    <p className="text-neutral-500 text-[13px] leading-relaxed line-clamp-3 mb-8 font-medium opacity-85 group-hover:opacity-100 transition-opacity">
                      {he.decode(noticia.conteudo.replace(/<[^>]*>?/gm, ''))}
                    </p>
                    
                    <Link 
                      href={`/noticias/${noticia.slug}/`}
                      className="mt-auto pt-6 border-t border-neutral-50 text-[10px] font-black uppercase tracking-[0.3em] text-[#0073B7] hover:text-neutral-950 transition-all flex items-center justify-between group/btn"
                    >
                      Ler Reportagem <ChevronRight size={14} className="transform transition-transform group-hover/btn:translate-x-1.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Acervo em Lista */}
          {emLista.length > 0 ? (
            <div className="w-full flex flex-col gap-10 border-t border-neutral-200 pt-16">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-[#8CC63F] rounded-full shadow-[0_0_8px_rgba(140,198,63,0.4)]"></div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-neutral-400">
                  {showPrincipais ? 'Acervo de Publicações' : 'Resultados da Pesquisa'}
                </h3>
              </div>
              
              <div className="flex flex-col gap-8">
                {emLista.map((noticia: Noticia) => (
                  <article 
                    key={noticia.id} 
                    className="group flex flex-col lg:flex-row gap-8 p-6 rounded-[2.5rem] bg-white/60 backdrop-blur-sm border border-neutral-100 hover:border-[#0073B7]/20 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(0,115,183,0.06)] transform hover:-translate-y-1.5 transition-all duration-700"
                  >
                    <Link 
                      href={`/noticias/${noticia.slug}/`} 
                      className="relative w-full lg:w-72 aspect-video flex-shrink-0 overflow-hidden bg-neutral-950 rounded-[2rem] shadow-xl"
                    >
                      <Image
                        src={getMediaUrl(noticia.capa)}
                        alt={noticia.titulo} 
                        fill 
                        className="object-cover transition-all duration-1000 ease-out group-hover:scale-110 group-hover:opacity-80"
                      />
                    </Link>

                    <div className="flex flex-col flex-1 min-w-0 py-2 relative">
                      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.25em] mb-4">
                        <span className="text-[#0073B7] bg-[#0073B7]/5 px-4 py-1.5 rounded-full border border-[#0073B7]/10">{noticia.campus_display || 'Geral'}</span>
                        <span className="text-neutral-300">•</span>
                        <span className="text-neutral-400">{new Date(noticia.data_publicacao).toLocaleDateString('pt-BR')}</span>
                      </div>

                      <Link href={`/noticias/${noticia.slug}/`}>
                        <h4 className="text-2xl font-black text-neutral-950 leading-snug mb-4 tracking-tight group-hover:text-[#0073B7] transition-colors duration-500 line-clamp-1">
                          {noticia.titulo}
                        </h4>
                      </Link>

                      <p className="text-neutral-500 text-sm leading-relaxed line-clamp-2 max-w-4xl font-medium mb-6 opacity-85 group-hover:opacity-100 transition-opacity">
                        {he.decode(noticia.conteudo.replace(/<[^>]*>?/gm, ''))}
                      </p>

                      <Link 
                        href={`/noticias/${noticia.slug}/`} 
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#0073B7] hover:text-neutral-950 transition-all mt-auto group/l"
                      >
                        Acessar Conteúdo <ChevronRight size={14} className="transform transition-transform group-hover/l:translate-x-1.5" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-neutral-400 uppercase tracking-widest text-xs font-black">Nenhuma notícia encontrada para os filtros aplicados.</p>
            </div>
          )}
        </div>

      </div>
  );
}
