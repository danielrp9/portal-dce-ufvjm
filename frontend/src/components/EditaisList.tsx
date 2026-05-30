"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Edital } from '@/types';
import { 
  Search, 
  CheckCircle2,
  XCircle,
  ChevronRight,
  Filter
} from 'lucide-react';
import { getMediaUrl } from '@/utils/urls';

interface EditaisListProps {
  initialEditais: Edital[];
}

export default function EditaisList({ initialEditais }: EditaisListProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);
  const [showCampusFilters, setShowCampusFilters] = useState<boolean>(false);
  const [selectedCampus, setSelectedCampus] = useState<string>('GERAL');

  const campusOptions = [
    { value: 'GERAL', label: 'Geral' },
    { value: 'DIAMANTINA', label: 'Diamantina' },
    { value: 'UNAI', label: 'Unaí' },
    { value: 'MUCURI', label: 'Mucuri' },
    { value: 'JANAUBA', label: 'Janaúba' },
  ];

  const filterFn = (e: Edital) => {
    const matchQuery = e.titulo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCampus = selectedCampus === 'GERAL' || e.campus === selectedCampus;
    return matchQuery && matchCampus;
  };

  const editaisAtivos = initialEventosAtivos(initialEditais).filter(filterFn);
  const editaisEncerrados = initialEventosEncerrados(initialEditais).filter(filterFn);

  function initialEventosAtivos(list: Edital[]) {
    return list.filter((e: Edital) => e.ativo === true);
  }

  function initialEventosEncerrados(list: Edital[]) {
    return list.filter((e: Edital) => e.ativo === false);
  }

  const ativosFiltrados = editaisAtivos;
  const encerradosFiltrados = editaisEncerrados;

  const renderEditalCard = (edital: Edital, isEncerrado = false) => (
    <div key={edital.id} className={`group flex flex-col md:flex-row md:items-center justify-between p-8 md:p-10 transition-all duration-500 ${isEncerrado ? 'opacity-75 grayscale-[0.5] hover:grayscale-0 hover:opacity-100 bg-neutral-50/50' : 'hover:bg-white bg-white/40'}`}>
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-4">
          <span className={`w-2 h-2 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] ${isEncerrado ? 'bg-neutral-400' : 'bg-[#8CC63F] shadow-[0_0_10px_rgba(140,198,63,0.5)]'}`}></span>
          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
            {isEncerrado ? 'Encerrado em' : 'Publicado em'} {new Date(edital.data_publicacao).toLocaleDateString('pt-BR')}
          </span>
          <span className="px-3 py-1 bg-[#0073B7]/5 text-[#0073B7] text-[8px] font-black uppercase tracking-widest rounded-full border border-[#0073B7]/10">
            {edital.campus_display || 'Geral'}
          </span>
        </div>
        <Link href={`/editais/${edital.slug}/`}>
          <h3 className={`text-xl md:text-2xl font-black tracking-tight leading-tight max-w-3xl ${isEncerrado ? 'text-neutral-600' : 'text-neutral-950 group-hover:text-[#0073B7] transition-colors'}`}>
            {edital.titulo}
          </h3>
        </Link>
      </div>
      
      <div className="mt-8 md:mt-0 md:ml-12">
        <Link 
          href={`/editais/${edital.slug}/`}
          className={`inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl group/btn ${isEncerrado ? 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300' : 'bg-neutral-950 text-white hover:bg-[#8CC63F] hover:text-neutral-950'}`}
        >
          {isEncerrado ? 'Ver Histórico' : 'Acompanhar Edital'}
          <ChevronRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Ultra-Compacto e Legível: Editais */}
        <div className="mb-10 relative">
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#8CC63F]/5 blur-[50px] rounded-full pointer-events-none -z-10"></div>
          
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-neutral-200/60 pb-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-1 select-none">
                <div className="w-6 h-[2px] bg-[#8CC63F] rounded-full"></div>
                <h3 className="text-[8px] font-black uppercase tracking-[0.3em] text-[#0073B7]">
                  Chamadas Públicas
                </h3>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-neutral-950 uppercase">
                Editais e Eleições
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
                    onClick={() => setSelectedCampus(opt.value)}
                    className={`text-[9px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full border-2 transition-all duration-300 ${
                      selectedCampus === opt.value
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

        {/* SEÇÃO: EDITAIS ATIVOS */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 bg-[#8CC63F] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(140,198,63,0.4)]">
               <CheckCircle2 size={20} className="text-white" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-neutral-950">Processos em Aberto</h2>
            <div className="h-px flex-1 bg-neutral-200"></div>
          </div>

          <div className="bg-white/70 backdrop-blur-md border border-white shadow-[0_30px_70px_rgba(0,0,0,0.05)] rounded-[3.5rem] overflow-hidden">
            {ativosFiltrados.length > 0 ? (
              <div className="divide-y divide-neutral-100">
                {ativosFiltrados.map(e => renderEditalCard(e, false))}
              </div>
            ) : (
              <div className="py-24 text-center flex flex-col items-center gap-4">
                <p className="text-neutral-400 font-black text-xs uppercase tracking-[0.4em]">Nenhum edital ativo no momento.</p>
              </div>
            )}
          </div>
        </section>

        {/* SEÇÃO: EDITAIS ENCERRADOS */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 bg-neutral-400 rounded-2xl flex items-center justify-center shadow-lg">
               <XCircle size={20} className="text-white" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-neutral-400">Editais Encerrados</h2>
            <div className="h-px flex-1 bg-neutral-200/60"></div>
          </div>

          <div className="bg-neutral-100/40 backdrop-blur-sm border border-neutral-200/50 rounded-[3.5rem] overflow-hidden">
            {encerradosFiltrados.length > 0 ? (
              <div className="divide-y divide-neutral-200/40">
                {encerradosFiltrados.map(e => renderEditalCard(e, true))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-neutral-400 font-black text-[10px] uppercase tracking-[0.3em]">Nenhum edital no histórico.</p>
              </div>
            )}
          </div>
        </section>

      </div>
  );
}
