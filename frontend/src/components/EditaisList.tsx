"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edital, PaginatedResponse } from '@/types';
import { 
  Search, 
  CheckCircle2,
  XCircle,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Pagination from './Pagination';

import api from '@/services/api';

export default function EditaisList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const campus = searchParams.get('campus') || 'GERAL';

  const [data, setData] = useState<PaginatedResponse<Edital> | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>(search);
  const [showSearchInput, setShowSearchInput] = useState<boolean>(search !== '');
  const [showCampusFilters, setShowCampusFilters] = useState<boolean>(campus !== 'GERAL');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          search: search || undefined,
          campus: campus !== 'GERAL' ? campus : undefined
        };

        const res = await api.get('/editais/', { params });
        setData(res.data);
      } catch (error) {
        console.error("Erro ao buscar editais:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, search, campus]);

  const campusOptions = [
    { value: 'GERAL', label: 'Geral' },
    { value: 'DIAMANTINA', label: 'Diamantina' },
    { value: 'UNAI', label: 'Unaí' },
    { value: 'MUCURI', label: 'Mucuri' },
    { value: 'JANAUBA', label: 'Janaúba' },
  ];

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

  const renderEditalCard = (edital: Edital, isEncerrado = false) => (
    <div key={edital.id} className={`group flex flex-col md:flex-row md:items-center justify-between p-8 md:p-12 transition-all duration-500 border-b border-neutral-100 last:border-0 ${isEncerrado ? 'opacity-80 grayscale-[0.3] hover:grayscale-0 hover:opacity-100 bg-[#F8FAFC]' : 'hover:bg-white bg-white'}`}>
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-5">
          <span className={`w-3 h-3 rounded-full ${isEncerrado ? 'bg-neutral-400' : 'bg-[#8CC63F] shadow-[0_0_15px_rgba(140,198,63,0.6)] animate-pulse'}`}></span>
          <span className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em]">
            {isEncerrado ? 'Finalizado em' : 'Publicado em'} {new Date(edital.data_publicacao).toLocaleDateString('pt-BR')}
          </span>
          <span className="px-4 py-1.5 bg-[#0073B7] text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-[0_5px_15_rgba(0,115,183,0.2)]">
            {edital.campus_display || 'Geral'}
          </span>
        </div>
        <Link href={`/editais/${edital.slug}/`}>
          <h3 className={`text-2xl md:text-3xl font-black tracking-tight leading-tight max-w-3xl uppercase ${isEncerrado ? 'text-neutral-600' : 'text-neutral-950 group-hover:text-[#0073B7] transition-colors'}`}>
            {edital.titulo}
          </h3>
        </Link>
      </div>
      
      <div className="mt-10 md:mt-0 md:ml-12">
        <Link 
          href={`/editais/${edital.slug}/`}
          className={`inline-flex items-center gap-5 text-[11px] font-black uppercase tracking-[0.3em] px-10 py-5 rounded-[1.5rem] transition-all duration-300 shadow-xl group/btn ${isEncerrado ? 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300' : 'bg-[#001529] text-white hover:bg-[#0073B7] hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,115,183,0.25)]'}`}
        >
          {isEncerrado ? 'Ver Histórico' : 'Acompanhar Edital'}
          <ChevronRight size={18} className="transition-transform group-hover/btn:translate-x-1.5" />
        </Link>
      </div>
    </div>
  );

  if (loading && !data) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0073B7]"></div>
      </div>
    );
  }

  if (!data) return null;

  const editaisAtivos = data.results.filter((e: Edital) => e.ativo === true);
  const editaisEncerrados = data.results.filter((e: Edital) => e.ativo === false);

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        
        {/* Header Ultra-Compacto e Legível: Editais */}
        <div className="mb-10 relative">
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#8CC63F]/5 blur-[50px] rounded-full pointer-events-none -z-10"></div>
          
          <div className="relative flex flex-row items-center justify-between gap-4 border-b border-neutral-200/60 pb-6">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 select-none">
                <div className="w-6 h-[2px] bg-[#8CC63F] rounded-full"></div>
                <h3 className="text-[8px] font-black uppercase tracking-[0.3em] text-[#0073B7]">
                  Chamadas Públicas
                </h3>
              </div>
              <h1 className="text-xl md:text-3xl font-black tracking-tight text-neutral-950 uppercase truncate">
                Editais e Eleições
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

        {/* Filtros */}
        {showCampusFilters && (
          <div className="w-full bg-white border-4 border-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] p-10 rounded-[3rem] mb-20 flex flex-col sm:flex-row gap-8 items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 w-full">
              <span className="text-[12px] font-black uppercase tracking-[0.4em] text-[#0073B7] flex items-center gap-3">
                <div className="w-2 h-2 bg-[#8CC63F] rounded-full shadow-[0_0_10px_#8CC63F]"></div>
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

        <div className={`transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          {/* SEÇÃO: EDITAIS ATIVOS */}
          <section className="mb-24">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-[#8CC63F] rounded-2xl flex items-center justify-center shadow-[0_15px_30px_rgba(140,198,63,0.3)]">
                <CheckCircle2 size={24} className="text-white" />
              </div>
              <h2 className="text-3xl font-black tracking-tight text-neutral-950 uppercase">Processos em Aberto</h2>
              <div className="h-px flex-1 bg-neutral-200"></div>
            </div>

            <div className="bg-white border border-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.12)] rounded-[3.5rem] overflow-hidden">
              {editaisAtivos.length > 0 ? (
                <div className="divide-y divide-neutral-100">
                  {editaisAtivos.map(e => renderEditalCard(e, false))}
                </div>
              ) : (
                <div className="py-24 text-center flex flex-col items-center gap-4">
                  <p className="text-neutral-400 font-black text-xs uppercase tracking-[0.4em]">Nenhum edital ativo para os filtros aplicados.</p>
                </div>
              )}
            </div>
          </section>

          {/* SEÇÃO: EDITAIS ENCERRADOS */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-neutral-400 rounded-2xl flex items-center justify-center shadow-xl">
                <XCircle size={24} className="text-white" />
              </div>
              <h2 className="text-3xl font-black tracking-tight text-neutral-500 uppercase">Editais Encerrados</h2>
              <div className="h-px flex-1 bg-neutral-200"></div>
            </div>

            <div className="bg-white border border-neutral-100 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] rounded-[3.5rem] overflow-hidden">
              {editaisEncerrados.length > 0 ? (
                <div className="divide-y divide-neutral-50">
                  {editaisEncerrados.map(e => renderEditalCard(e, true))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <p className="text-neutral-400 font-black text-[10px] uppercase tracking-[0.3em]">Nenhum edital no histórico para os filtros aplicados.</p>
                </div>
              )}
            </div>
          </section>

          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </div>

      </div>
  );
}
