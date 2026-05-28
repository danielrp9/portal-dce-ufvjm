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
  const [allNoticias, setAllNoticias] = useState<Noticia[]>([]);
  const [filteredNoticias, setFilteredNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Estados de controle da interface expandida
  const [showCampusFilters, setShowCampusFilters] = useState<boolean>(false);
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);

  // Estados dos filtros dinâmicos
  const [selectedCampus, setSelectedCampus] = useState<string>('GERAL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const campusOptions = [
    { value: 'GERAL', label: 'Geral' },
    { value: 'DIAMANTINA', label: 'Diamantina' },
    { value: 'UNAI', label: 'Unaí' },
    { value: 'MUCURI', label: 'Mucuri' },
    { value: 'JANAUBA', label: 'Janaúba' },
  ];

  useEffect(() => {
    async function fetchNoticias() {
      try {
        const res = await api.get<PaginatedNoticias>('noticias/?page=1');
        const noticiasData = res.data.results || [];
        setAllNoticias(noticiasData);
        setFilteredNoticias(noticiasData);
      } catch (error) {
        console.error("Erro ao buscar notícias em tempo real:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNoticias();
  }, []);

  useEffect(() => {
    let result = allNoticias;

    if (selectedCampus !== 'GERAL') {
      result = result.filter((n: any) => n.campus === selectedCampus);
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((n: any) => {
        const matchTitulo = n.titulo?.toLowerCase().includes(query);
        const matchTags = n.tags?.toLowerCase().includes(query);
        return matchTitulo || matchTags;
      });
    }

    setFilteredNoticias(result);
  }, [selectedCampus, searchQuery, allNoticias]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col gap-4 items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-[#0073B7] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">Sincronizando Edições...</span>
      </div>
    );
  }

  const principais = filteredNoticias.slice(0, 3);
  const emLista = filteredNoticias.slice(3);

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-neutral-900 selection:bg-[#0073B7] selection:text-white font-sans antialiased pb-32">
      
      {/* 1. BREADCRUMB EDITORIAL SUTIL */}
      <div className="w-full border-b border-neutral-200/60 mb-8 bg-white/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <nav className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">
            <Link href="/" className="hover:text-[#0073B7] transition-colors">Início</Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-950">Notícias</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* HEADER DA SEÇÃO: Com identidade da Home e alinhamento tridimensional */}
        <div className="mb-10 border-b border-neutral-200 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#0073B7] mb-1">
              Portal Informativo
            </h3>
            <h1 className="text-3xl font-black tracking-tight text-neutral-950">
              Últimas Edições
            </h1>
          </div>
          
          {/* PAINEL DE CONTROLES LATERAIS (Pesquisa Expandível + Filtro de Campus) */}
          <div className="flex items-center gap-2 self-end sm:self-auto relative z-20">
            
            {/* INPUT DE PESQUISA EXPANDÍVEL HORIZONTALMENTE */}
            <div className="flex items-center gap-2">
              {showSearchInput && (
                <input
                  type="text"
                  placeholder="DIGITE UM ASSUNTO OU TAG..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border border-neutral-200/80 text-[10px] text-neutral-900 px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#0073B7] focus:ring-1 focus:ring-[#0073B7] font-bold uppercase tracking-wider animate-in fade-in zoom-in-95 duration-200 w-44 md:w-56 shadow-[0_8px_20px_rgba(0,0,0,0.02)]"
                  autoFocus
                />
              )}
              
              <button
                onClick={() => {
                  setShowSearchInput(!showSearchInput);
                  if (showSearchInput) setSearchQuery('');
                }}
                className={`p-2.5 rounded-xl border transition-all duration-300 transform active:scale-95 ${
                  showSearchInput 
                    ? 'bg-neutral-950 border-neutral-950 text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)]' 
                    : 'bg-white border-neutral-200/60 text-neutral-900 hover:border-neutral-400 hover:shadow-[0_8px_20px_rgba(0,0,0,0.05)]'
                }`}
                aria-label="Pesquisar publicações"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Separador Minimalista */}
            <div className="w-px h-6 bg-neutral-200 mx-1"></div>

            {/* Botão Gatilho para Abrir o Painel de Tags de Localidades */}
            <button
              onClick={() => setShowCampusFilters(!showCampusFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 border text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 transform active:scale-95 ${
                showCampusFilters 
                  ? 'bg-neutral-950 border-neutral-950 text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)]' 
                  : 'bg-white border-neutral-200/60 text-neutral-900 hover:border-neutral-400 hover:shadow-[0_8px_20px_rgba(0,0,0,0.05)]'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 18H7.5m9.75-6h3.375m-3.375 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-9.75 0h9.75" />
              </svg>
              {showCampusFilters ? 'Ocultar' : 'Filtrar'}
            </button>
          </div>
        </div>

        {/* PAINEL DE TAGS REORGANIZADO ESTETICAMENTE (Glassmorphism sutil e rounded-[2rem]) */}
        {showCampusFilters && (
          <div className="w-full bg-white border border-neutral-200/50 p-6 rounded-[2rem] mb-12 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.03)] animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 select-none">
                Filtrar por Campus:
              </span>
              
              <div className="flex flex-wrap gap-2">
                {campusOptions.map((opt) => {
                  const isSelected = selectedCampus === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedCampus(opt.value)}
                      className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full border transition-all duration-200 focus:outline-none ${
                        isSelected
                          ? 'bg-[#0073B7] border-[#0073B7] text-white shadow-[0_8px_20px_rgba(0,115,183,0.25)]'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-900'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="text-right select-none hidden md:inline">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300 whitespace-nowrap">
                {filteredNoticias.length} resultados
              </span>
            </div>
          </div>
        )}

        {/* FALLBACK: NENHUM REGISTRO */}
        {filteredNoticias.length === 0 && (
          <div className="w-full py-20 border border-dashed border-neutral-300 rounded-[2rem] flex flex-col items-center justify-center bg-white/50 shadow-xs">
            <svg className="w-6 h-6 text-neutral-300 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Nenhum registro para os critérios selecionados</p>
          </div>
        )}

        {/* ================= SEÇÃO 1: GRID DE DESTAQUES FILTRADOS (EFEITO 3D APLICADO) ================= */}
        {principais.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {principais.map((noticia: any) => (
              <article 
                key={noticia.id} 
                className="group cursor-pointer bg-white border border-neutral-200/50 rounded-[2rem] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_50px_rgba(0,115,183,0.12)] flex flex-col transform transition-all duration-500 hover:-translate-y-1.5"
              >
                <Link href={`/noticias/${noticia.slug}/`} className="relative aspect-video overflow-hidden bg-neutral-900 z-0">
                  <Image
                    src={noticia.capa.startsWith('http') ? noticia.capa : `http://127.0.0.1:8000${noticia.capa}`}
                    alt={noticia.titulo} 
                    fill 
                    className="object-cover transition-all duration-700 ease-out scale-100 group-hover:scale-105 group-hover:opacity-90"
                  />
                  {/* Badge Flutuante no Card */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-neutral-950 text-[8px] px-3 py-1.5 font-black uppercase tracking-[0.15em] z-10 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-white/40">
                    {noticia.campus_display || 'Geral'}
                  </div>
                </Link>
                
                <div className="p-6 flex-1 flex flex-col relative z-10">
                  <div className="flex justify-between items-center mb-3 text-[10px] font-bold text-[#8CC63F] uppercase tracking-wider">
                    <span className="text-neutral-400 font-medium font-sans">Por Redação Portal</span>
                    <span>{new Date(noticia.data_publicacao).toLocaleDateString('pt-BR')}</span>
                  </div>

                  <Link href={`/noticias/${noticia.slug}/`}>
                    <h2 className="text-base font-bold leading-snug text-neutral-950 group-hover:text-[#0073B7] transition-colors mb-3 tracking-tight line-clamp-2">
                      {noticia.titulo}
                    </h2>
                  </Link>
                  <p className="text-neutral-500 text-xs leading-relaxed line-clamp-2 mb-6 font-normal opacity-90">
                    {he.decode(noticia.conteudo.replace(/<[^>]*>?/gm, ''))}
                  </p>
                  
                  <Link 
                    href={`/noticias/${noticia.slug}/`}
                    className="mt-auto pt-4 border-t border-neutral-100 text-[9px] font-black uppercase tracking-[0.2em] text-[#0073B7] group-hover:text-neutral-950 transition-all flex items-center justify-between"
                  >
                    Ler Reportagem Completa <span className="transform transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ================= SEÇÃO 2: HISTÓRICO FILTRADO EM LISTA ================= */}
        {emLista.length > 0 && (
          <div className="w-full flex flex-col gap-6 border-t border-neutral-200 pt-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-2">
              Acervo de Publicações Anteriores
            </h3>
            
            <div className="flex flex-col gap-5">
              {emLista.map((noticia: any) => (
                <article 
                  key={noticia.id} 
                  className="group flex flex-col sm:flex-row gap-6 p-5 rounded-[2rem] border border-transparent hover:border-neutral-200/60 hover:bg-white hover:shadow-[0_16px_35px_rgba(0,0,0,0.05)] transform hover:-translate-y-0.5 transition-all duration-400"
                >
                  <Link 
                    href={`/noticias/${noticia.slug}/`} 
                    className="relative w-full sm:w-52 md:w-60 aspect-video flex-shrink-0 overflow-hidden bg-neutral-900 rounded-2xl shadow-xs"
                  >
                    <Image
                      src={noticia.capa.startsWith('http') ? noticia.capa : `http://127.0.0.1:8000${noticia.capa}`}
                      alt={noticia.titulo} 
                      fill 
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </Link>

                  <div className="flex flex-col flex-1 min-w-0 py-1">
                    <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest mb-2.5">
                      <span className="text-[#0073B7] bg-[#0073B7]/5 px-2.5 py-1 rounded-full">{noticia.campus_display || 'Geral'}</span>
                      <span className="text-neutral-300">•</span>
                      <span className="text-neutral-400">{new Date(noticia.data_publicacao).toLocaleDateString('pt-BR')}</span>
                    </div>

                    <Link href={`/noticias/${noticia.slug}/`}>
                      <h4 className="text-lg font-bold text-neutral-950 leading-snug mb-2 tracking-tight group-hover:text-[#0073B7] transition-colors line-clamp-2">
                        {noticia.titulo}
                      </h4>
                    </Link>

                    <p className="text-neutral-500 text-xs leading-relaxed line-clamp-2 max-w-4xl font-normal mb-4 opacity-90">
                      {he.decode(noticia.conteudo.replace(/<[^>]*>?/gm, ''))}
                    </p>

                    <Link 
                      href={`/noticias/${noticia.slug}/`}
                      className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-neutral-400 group-hover:text-neutral-950 transition-colors mt-auto"
                    >
                      Acessar Matéria Completa <span className="transform transition-transform group-hover:translate-x-0.5">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}