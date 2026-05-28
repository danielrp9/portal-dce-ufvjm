"use client";

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { Evento } from '@/types';
import EventCard from '@/components/EventCard';
import Link from 'next/link';

interface PaginatedEventos {
  count: number;
  next: string | null;
  previous: string | null;
  results: Evento[];
}

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<string>('1');

  useEffect(() => {
    async function getEventosData() {
      setLoading(true);
      try {
        const res = await api.get<PaginatedEventos | Evento[]>(`eventos/?page=${currentPage}`);
        const dados = Array.isArray(res.data) ? res.data : (res.data as any).results || [];
        const total = Array.isArray(res.data) ? res.data.length : (res.data as any).count || 0;
        setEventos(dados);
        setCount(total);
      } catch (error) {
        console.error("Erro ao carregar lista de eventos dinâmicos:", error);
      } finally {
        setLoading(false);
      }
    }
    getEventosData();
  }, [currentPage]);

  const totalPages = Math.ceil(count / 6);

  if (loading && eventos.length === 0) {
    return (
      <div className="min-h-screen bg-[#F4F4F2] flex items-center justify-center font-sans text-xs font-bold uppercase tracking-widest text-neutral-400">
        Sincronizando Agenda...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F4F2] pb-32 text-neutral-900 selection:bg-neutral-950 selection:text-white font-sans antialiased">
      
      {/* 1. BREADCRUMB EDITORIAL SUTIL */}
      <div className="w-full border-b border-neutral-200/60 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400">
            <Link href="/" className="hover:text-neutral-950 transition-colors">Início</Link>
            <span>/</span>
            <span className="text-neutral-950 font-bold">Eventos</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER DA SEÇÃO */}
        <div className="mb-12 border-b border-neutral-300 pb-5">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 mb-1">
            Agenda Acadêmica
          </h3>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-950 uppercase">
            Calendário de <span className="text-[#0073B7]">Mobilizações</span>
          </h1>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
            Palestras, Cultura e Atividades Institucionais
          </p>
        </div>

        {eventos.length > 0 ? (
          <>
            {/* 2. GRID DE EVENTOS (ESTILO NEWS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {eventos.map((evento: Evento) => (
                <article 
                  key={evento.id} 
                  className="bg-white border border-neutral-200/60 rounded-3xl p-6 shadow-2xs hover:shadow-md transition-all duration-300 group"
                >
                  <EventCard evento={evento} />
                </article>
              ))}
            </div>

            {/* 3. PAGINAÇÃO MINIMALISTA */}
            {totalPages > 1 && (
              <div className="mt-20 pt-10 border-t border-neutral-200/60 flex flex-col items-center">
                <div className="flex items-center gap-4">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(String(i + 1))}
                      className={`text-xs font-bold uppercase tracking-widest transition-all px-4 py-2 rounded-xl ${
                        currentPage === String(i + 1) 
                        ? 'bg-neutral-950 text-white' 
                        : 'text-neutral-400 hover:text-neutral-950 hover:bg-white'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-24 text-center border border-dashed border-neutral-300 rounded-3xl bg-white/50">
            <svg className="w-8 h-8 text-neutral-200 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
            </svg>
            <p className="text-neutral-400 font-bold text-[10px] uppercase tracking-widest">
              Nenhum evento agendado para o período
            </p>
          </div>
        )}
      </div>

      <footer className="mt-40 text-center py-20 border-t border-neutral-200/60 mx-6">
         <p className="text-[10px] font-bold uppercase tracking-[0.6em] text-neutral-300 select-none">
           DCE UFVJM • Agenda Aberta
         </p>
      </footer>
    </main>
  );
}
