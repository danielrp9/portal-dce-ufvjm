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
      <div className="min-h-screen bg-[#FDFDFB] flex items-center justify-center font-sans text-xs font-bold uppercase tracking-widest text-slate-400">
        Carregando Edições...
      </div>
    );
  }

  const principais = filteredNoticias.slice(0, 3);
  const emLista = filteredNoticias.slice(3);

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
        
        {/* HEADER DA SEÇÃO: Limpo, dinâmico e focado em ações fluidas */}
        <div className="mb-10 border-b border-black pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative">
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black leading-none">
              Últimas <span className="text-[#0073B7]">Edições</span>
            </h1>
            <p className="mt-1.5 text-[10px] font-sans uppercase tracking-[0.3em] text-slate-400 font-bold">
              Cobertura de Eventos e Atividades do DCE
            </p>
          </div>
          
          {/* PAINEL DE CONTROLES LATERAIS (Pesquisa Expandível + Filtro de Campus) */}
          <div className="flex items-center gap-2 self-end sm:self-auto font-sans relative z-20">
            
            {/* INPUT DE PESQUISA EXPANDÍVEL HORIZONTALMENTE */}
            <div className="flex items-center gap-2">
              {showSearchInput && (
                <input
                  type="text"
                  placeholder="DIGITE UM ASSUNTO OU TAG..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border border-black/10 text-[10px] text-slate-900 px-3 py-1.5 rounded-sm focus:outline-none focus:border-[#0073B7] font-bold uppercase tracking-wider animate-in fade-in zoom-in-95 duration-200 w-44 md:w-56"
                  autoFocus
                />
              )}
              
              <button
                onClick={() => {
                  setShowSearchInput(!showSearchInput);
                  if (showSearchInput) setSearchQuery(''); // Reseta a busca ao fechar
                }}
                className={`p-2 rounded-sm border transition-all ${
                  showSearchInput ? 'bg-black border-black text-white' : 'bg-white border-black/5 text-slate-900 hover:border-black'
                }`}
                aria-label="Pesquisar publicações"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Separador Minimalista */}
            <div className="w-px h-6 bg-black/10 mx-1"></div>

            {/* Botão Gatilho para Abrir o Painel de Tags de Localidades */}
            <button
              onClick={() => setShowCampusFilters(!showCampusFilters)}
              className={`flex items-center gap-2 px-4 py-2 border text-[10px] font-black uppercase tracking-wider rounded-xs transition-all ${
                showCampusFilters 
                  ? 'bg-black border-black text-white' 
                  : 'bg-white border-black/5 text-slate-900 hover:border-black'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 18H7.5m9.75-6h3.375m-3.375 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-9.75 0h9.75" />
              </svg>
              {showCampusFilters ? 'Ocultar' : 'Filtrar'}
            </button>
          </div>
        </div>

        {/* PAINEL DE TAGS REORGANIZADO ESTETICAMENTE (Efeito Moderno, Sem Poluição Visual) */}
        {showCampusFilters && (
          <div className="w-full bg-slate-50/60 border border-black/[0.04] p-4 rounded-sm mb-12 flex flex-col sm:flex-row gap-4 items-center justify-between font-sans animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 select-none">
                Filtrar por Campus da UFVJM:
              </span>
              
              {/* Layout de Badges Organizados Modernamente com cantos arredondados finos */}
              <div className="flex flex-wrap gap-1.5">
                {campusOptions.map((opt) => {
                  const isSelected = selectedCampus === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedCampus(opt.value)}
                      className={`text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border transition-all duration-200 focus:outline-none ${
                        isSelected
                          ? 'bg-[#0073B7] border-[#0073B7] text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="text-right select-none hidden md:inline">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300 whitespace-nowrap">
                {filteredNoticias.length} resultados
              </span>
            </div>
          </div>
        )}

        {/* FALLBACK: NENHUM REGISTRO */}
        {filteredNoticias.length === 0 && (
          <div className="w-full py-20 border border-dashed border-black/10 rounded-sm flex flex-col items-center justify-center bg-[#F9F9F7]/40 font-sans">
            <svg className="w-6 h-6 text-slate-300 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nenhum registro para os critérios selecionados</p>
          </div>
        )}

        {/* ================= SEÇÃO 1: GRID DE DESTAQUES FILTRADOS ================= */}
        {principais.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {principais.map((noticia: any) => (
              <article key={noticia.id} className="bg-white border border-black/5 rounded-sm overflow-hidden shadow-2xs hover:shadow-md flex flex-col group transition-all">
                <Link href={`/noticias/${noticia.slug}/`} className="relative aspect-video overflow-hidden bg-slate-100 border-b border-black/5">
                  <Image
                    src={noticia.capa.startsWith('http') ? noticia.capa : `http://127.0.0.1:8000${noticia.capa}`}
                    alt={noticia.titulo} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                </Link>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-3 font-sans text-[9px] font-black uppercase tracking-wider">
                    <span className="text-[#0073B7]">{noticia.campus_display || 'Geral'}</span>
                    <span className="text-slate-400 font-bold">{new Date(noticia.data_publicacao).toLocaleDateString('pt-BR')}</span>
                  </div>

                  <Link href={`/noticias/${noticia.slug}/`}>
                    <h2 className="text-lg font-bold leading-tight text-slate-950 group-hover:text-[#0073B7] transition-colors mb-3 tracking-tight font-serif line-clamp-2">
                      {noticia.titulo}
                    </h2>
                  </Link>
                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-6 font-sans font-light">
                    {he.decode(noticia.conteudo.replace(/<[^>]*>?/gm, ''))}
                  </p>
                  <Link 
                    href={`/noticias/${noticia.slug}/`}
                    className="mt-auto pt-4 border-t border-black/5 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 group-hover:text-black transition-all flex items-center justify-between font-sans"
                  >
                    Ler Reportagem Completa <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ================= SEÇÃO 2: HISTÓRICO FILTRADO EM LISTA ================= */}
        {emLista.length > 0 && (
          <div className="w-full flex flex-col gap-6 border-t border-black/10 pt-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] font-sans text-slate-400 mb-2">
              Acervo de Publicações Anteriores
            </h3>
            
            <div className="flex flex-col border-b border-black/5">
              {emLista.map((noticia: any) => (
                <article 
                  key={noticia.id} 
                  className="group flex flex-col sm:flex-row gap-6 py-6 border-t border-black/5 hover:bg-[#F9F9F7]/60 px-4 transition-all duration-200 rounded-xs"
                >
                  <Link 
                    href={`/noticias/${noticia.slug}/`} 
                    className="relative w-full sm:w-52 md:w-60 aspect-video flex-shrink-0 overflow-hidden bg-slate-100 border border-black/5 rounded-sm"
                  >
                    <Image
                      src={noticia.capa.startsWith('http') ? noticia.capa : `http://127.0.0.1:8000${noticia.capa}`}
                      alt={noticia.titulo} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-102"
                    />
                  </Link>

                  <div className="flex flex-col flex-1 min-w-0 py-1">
                    <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest font-sans mb-2">
                      <span className="text-[#0073B7] font-black">{noticia.campus_display || 'Geral'}</span>
                      <span>•</span>
                      <span>{new Date(noticia.data_publicacao).toLocaleDateString('pt-BR')}</span>
                    </div>

                    <Link href={`/noticias/${noticia.slug}/`}>
                      <h4 className="text-xl font-bold text-slate-950 leading-tight mb-2 tracking-tight group-hover:text-[#0073B7] transition-colors font-serif line-clamp-2">
                        {noticia.titulo}
                      </h4>
                    </Link>

                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed line-clamp-2 max-w-4xl font-sans font-light mb-4">
                      {he.decode(noticia.conteudo.replace(/<[^>]*>?/gm, ''))}
                    </p>

                    <Link 
                      href={`/noticias/${noticia.slug}/`}
                      className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-[#0073B7] hover:text-black mt-auto font-sans"
                    >
                      Acessar Matéria Completa <span>→</span>
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