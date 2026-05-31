"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Evento } from '@/types';
import EventCard from '@/components/EventCard';
import { Calendar, ChevronRight, CheckCircle2, History, Loader2 } from 'lucide-react';
import api from '@/services/api';

export default function EventosPage() {
  const [todos, setTodos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEventos() {
      try {
        const res = await api.get('/eventos/');
        setTodos(res.data.results || []);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      } finally {
        setLoading(false);
      }
    }
    loadEventos();
  }, []);

  const eventosAtivos = todos.filter((e: Evento) => e.ativo !== false);
  const eventosEncerrados = todos.filter((e: Evento) => e.ativo === false);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F6F8] gap-4">
        <Loader2 className="w-12 h-12 text-[#0073B7] animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 animate-pulse">
          Sincronizando Agenda...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F6F8] pb-32 text-neutral-900 selection:bg-[#0073B7] selection:text-white font-sans antialiased relative overflow-hidden">
      
      {/* Elementos de Fundo - Suavizados */}
      <div className="absolute top-[-5%] left-[-5%] w-[1000px] h-[1000px] bg-[#8CC63F]/5 blur-[160px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[1100px] h-[1100px] bg-[#0073B7]/6 blur-[200px] rounded-full pointer-events-none -z-10"></div>

      {/* BREADCRUMB */}
      <div className="w-full border-b border-neutral-200/60 mb-12 bg-white/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-6 py-5 md:px-12 lg:px-20">
          <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            <Link href="/" className="hover:text-[#0073B7] transition-colors">Início</Link>
            <ChevronRight size={10} className="text-neutral-300" />
            <span className="text-neutral-950 font-black">Agenda de Eventos</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        
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
                Eventos do DCE
              </h1>
            </div>
          </div>
        </div>

        {/* SEÇÃO: EVENTOS FUTUROS */}
        <section className="mb-24">
          {eventosAtivos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {eventosAtivos.map((evento: Evento) => (
                <article 
                  key={evento.id} 
                  className="bg-white border border-white rounded-[3.5rem] p-10 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_45px_100px_-15px_rgba(0,115,183,0.18)] transition-all duration-700 transform hover:-translate-y-3 relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-12 w-12 h-2 bg-[#8CC63F] rounded-b-full shadow-[0_0_15px_rgba(140,198,63,0.6)]"></div>
                  {/* Efeito de luz interna */}
                  <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#0073B7]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  <div className="relative z-10">
                    <EventCard evento={evento} />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center bg-white border-2 border-dashed border-neutral-200 rounded-[3.5rem] shadow-inner">
              <p className="text-neutral-400 font-black text-xs uppercase tracking-[0.4em]">Nenhum evento agendado para o momento.</p>
            </div>
          )}
        </section>

        {/* SEÇÃO: EVENTOS ENCERRADOS */}
        <section>
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-neutral-400 rounded-2xl flex items-center justify-center shadow-xl">
               <History size={24} className="text-white" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-neutral-500 uppercase">Atividades Realizadas</h2>
            <div className="h-px flex-1 bg-neutral-200"></div>
          </div>

          {eventosEncerrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {eventosEncerrados.map((evento: Evento) => (
                <article 
                  key={evento.id} 
                  className="bg-[#F8FAFC] border border-neutral-100 rounded-[3.5rem] p-10 opacity-80 grayscale-[0.2] hover:grayscale-0 hover:opacity-100 hover:bg-white hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-700 transform hover:-translate-y-2"
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
