import React from 'react';
import Link from 'next/link';
import { Evento } from '@/types';
import EventCard from '@/components/EventCard';
import { Calendar, ChevronRight, CheckCircle2, History } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

async function getEventos(): Promise<Evento[]> {
  try {
    const res = await fetch(`${API_URL}/api/eventos/`, {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) throw new Error('Falha ao buscar eventos');
    
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Erro ao buscar eventos no servidor:", error);
    return [];
  }
}

export default async function EventosPage() {
  const todos = await getEventos();
  const eventosAtivos = todos.filter((e: Evento) => e.ativo !== false);
  const eventosEncerrados = todos.filter((e: Evento) => e.ativo === false);

  return (
    <main className="min-h-screen bg-[#F0F2F5] pb-32 text-neutral-900 selection:bg-[#0073B7] selection:text-white font-sans antialiased relative overflow-hidden">
      
      {/* Elementos de Fundo */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#8CC63F]/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#0073B7]/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>

      {/* BREADCRUMB */}
      <div className="w-full border-b border-neutral-200/60 mb-12 bg-white/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            <Link href="/" className="hover:text-[#0073B7] transition-colors">Início</Link>
            <ChevronRight size={10} className="text-neutral-300" />
            <span className="text-neutral-950 font-black">Agenda de Eventos</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Ultra-Compacto e Legível: Eventos */}
        <div className="mb-10 relative">
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#0073B7]/5 blur-[50px] rounded-full pointer-events-none"></div>
          
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-neutral-200/60 pb-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-1 select-none">
                <div className="w-6 h-[2px] bg-[#0073B7] rounded-full"></div>
                <h3 className="text-[8px] font-black uppercase tracking-[0.3em] text-[#0073B7]">
                  Mobilização Estudantil
                </h3>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-neutral-950 uppercase">
                Calendário de Eventos
              </h1>
            </div>
            
            <div className="flex items-center gap-5 bg-white/80 backdrop-blur-xl px-6 py-4 rounded-2xl border border-neutral-200 shadow-xl group hover:shadow-2xl transition-all duration-500 z-20">
              <div className="w-10 h-10 bg-[#8CC63F]/10 rounded-xl flex items-center justify-center border border-[#8CC63F]/20 group-hover:scale-110 transition-transform">
                <Calendar size={20} className="text-[#8CC63F]" />
              </div>
              <div>
                <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-1">Status da Agenda</p>
                <p className="text-[11px] font-black text-neutral-950 uppercase tracking-tight">Atividades Abertas</p>
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO: EVENTOS FUTUROS */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 bg-[#8CC63F] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(140,198,63,0.4)]">
               <CheckCircle2 size={20} className="text-white" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-neutral-950">Próximas Atividades</h2>
            <div className="h-px flex-1 bg-neutral-200"></div>
          </div>

          {eventosAtivos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {eventosAtivos.map((evento: Evento) => (
                <article 
                  key={evento.id} 
                  className="bg-white border border-neutral-100 rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_100px_rgba(0,115,183,0.1)] transition-all duration-700 transform hover:-translate-y-2 relative group"
                >
                  <div className="absolute top-0 right-12 w-8 h-1 bg-[#8CC63F] rounded-b-full shadow-[0_0_10px_rgba(140,198,63,0.4)]"></div>
                  <EventCard evento={evento} />
                </article>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center bg-white/40 backdrop-blur-md border-2 border-dashed border-neutral-200 rounded-[3.5rem]">
              <p className="text-neutral-400 font-black text-xs uppercase tracking-[0.4em]">Nenhum evento agendado para o momento.</p>
            </div>
          )}
        </section>

        {/* SEÇÃO: EVENTOS ENCERRADOS */}
        <section>
          <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 bg-neutral-400 rounded-2xl flex items-center justify-center shadow-lg">
               <History size={20} className="text-white" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-neutral-400">Atividades Realizadas</h2>
            <div className="h-px flex-1 bg-neutral-200/60"></div>
          </div>

          {eventosEncerrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 opacity-80">
              {eventosEncerrados.map((evento: Evento) => (
                <article 
                  key={evento.id} 
                  className="bg-neutral-50/50 backdrop-blur-sm border border-neutral-200/50 rounded-[3rem] p-8 grayscale-[0.4] hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                >
                  <EventCard evento={evento} />
                </article>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-neutral-400 font-black text-[10px] uppercase tracking-[0.3em]">Histórico de atividades vazio.</p>
            </div>
          )}
        </section>

      </div>

      <footer className="mt-40 text-center py-20 border-t border-neutral-200/60 mx-6">
         <p className="text-[10px] font-black uppercase tracking-[0.6em] text-neutral-300 select-none">
           DCE UFVJM • PORTAL DE COMUNICAÇÃO
         </p>
      </footer>
    </main>
  );
}
