import React from 'react';
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

async function getEventos(page: string = '1') {
  try {
    const res = await api.get<PaginatedEventos | Evento[]>(`eventos/?page=${page}`);
    const dados = Array.isArray(res.data) ? res.data : (res.data as any).results || [];
    const count = Array.isArray(res.data) ? res.data.length : (res.data as any).count || 0;
    return { eventos: dados, count };
  } catch (error) {
    console.error("Erro ao carregar lista de eventos:", error);
    return { eventos: [], count: 0 };
  }
}

export default async function EventosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = params.page || '1';
  const { eventos, count } = await getEventos(currentPage);
  const totalPages = Math.ceil(count / 6);

  return (
    <main className="min-h-screen bg-[#FDFDFB] pb-32 selection:bg-black selection:text-white font-serif">
      
      {/* 1. BREADCRUMB EDITORIAL SUTIL */}
      <div className="w-full border-b border-black/5 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 font-sans">
            <Link href="/" className="hover:text-black transition-colors">Início</Link>
            <span>/</span>
            <span className="text-black font-bold">Eventos</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* TÍTULO DA PÁGINA - REFORMULADO (SUTIL E ELEGANTE) */}
        <div className="mb-12 border-b border-black pb-4">
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black leading-none">
            Agenda <span className="text-[#0073B7]">Acadêmica</span>
          </h1>
          <p className="mt-1 text-[10px] font-sans uppercase tracking-[0.3em] text-slate-400 font-bold">
            Calendário de Mobilizações, Palestras e Cultura
          </p>
        </div>

        {eventos.length > 0 ? (
          <>
            {/* 2. GRID EDITORIAL (GRID DE CÉLULAS COM LINHAS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10 border border-black/10">
              {eventos.map((evento: Evento) => (
                <div 
                  key={evento.id} 
                  className="bg-[#FDFDFB] p-6 transition-all duration-500 hover:bg-[#F9F9F7]"
                >
                  <EventCard evento={evento} />
                </div>
              ))}
            </div>

            {/* 3. PAGINAÇÃO JORNALÍSTICA */}
            {totalPages > 1 && (
              <div className="mt-24 pt-8 border-t border-black/10 flex flex-col items-center gap-6">
                <div className="flex items-center gap-4">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Link
                      key={i + 1}
                      href={`/eventos?page=${i + 1}`}
                      className={`text-lg font-black transition-all px-4 py-1 ${
                        currentPage === String(i + 1) 
                        ? 'text-[#0073B7] border-b-2 border-[#0073B7]' 
                        : 'text-slate-300 hover:text-black'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-32 text-center border-2 border-dashed border-black/5">
            <p className="text-slate-300 font-bold text-sm uppercase tracking-[0.2em] italic font-sans opacity-50">
              Nenhum evento agendado no radar.
            </p>
          </div>
        )}
      </div>

      <footer className="mt-40 text-center py-20 border-t border-black/5 mx-6">
         <div className="text-[10px] font-bold uppercase tracking-[1em] text-slate-200 select-none font-sans italic">
           DCE UFVJM
         </div>
      </footer>
    </main>
  );
}