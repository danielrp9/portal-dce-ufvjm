"use client";

import React, { useEffect, useState } from 'react';
import { Evento } from '@/types';
import EventCard from '@/components/EventCard';
import Link from 'next/link';
import { Calendar, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

interface EventsCarouselProps {
  initialEventos: Evento[];
}

export default function EventsCarousel({ initialEventos }: EventsCarouselProps) {
  const [currentEventIndex, setCurrentEventIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const eventos = initialEventos.filter(e => e.ativo !== false);

  useEffect(() => {
    if (eventos.length <= 1 || isPaused || isModalOpen) return;
    
    const interval = setInterval(() => {
      setCurrentEventIndex((prevIndex) => (prevIndex + 1 >= eventos.length ? 0 : prevIndex + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [eventos, isPaused, isModalOpen]);

  const nextEvent = () => {
    setCurrentEventIndex((prev) => (prev + 1 >= eventos.length ? 0 : prev + 1));
  };

  const prevEvent = () => {
    setCurrentEventIndex((prev) => (prev - 1 < 0 ? eventos.length - 1 : prev - 1));
  };

  const eventosExibidos = eventos.slice(currentEventIndex, currentEventIndex + 1);

  return (
    <section className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col gap-8 relative overflow-hidden group/ag">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#0073B7]/5 rounded-full blur-3xl pointer-events-none group-hover/ag:bg-[#0073B7]/10 transition-all"></div>
      
      <div className="flex justify-between items-center pb-6 border-b border-neutral-100">
        <div className="flex items-center gap-3">
           <div className="w-1.5 h-6 bg-[#0073B7] rounded-full shadow-[0_0_10px_rgba(0,115,183,0.3)]"></div>
           <h3 className="text-xl font-black text-neutral-950 uppercase tracking-tight">Eventos</h3>
        </div>
        
        <div className="flex items-center gap-3">
          {eventos.length > 1 && (
            <button 
              onClick={() => setIsPaused(!isPaused)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border ${
                isPaused 
                  ? 'bg-[#0073B7] text-white border-[#0073B7]' 
                  : 'bg-neutral-50 text-neutral-400 border-neutral-100 hover:text-neutral-600'
              }`}
            >
              {isPaused ? <Play size={10} fill="currentColor" /> : <Pause size={10} fill="currentColor" />}
              <span className="text-[8px] font-black uppercase tracking-widest">{isPaused ? 'Pausado' : 'Auto'}</span>
            </button>
          )}
          <span className={`w-2 h-2 rounded-full shadow-[0_0_12px_#8CC63F] transition-all duration-500 ${isPaused || isModalOpen ? 'bg-neutral-300 shadow-none grayscale' : 'bg-[#8CC63F] animate-pulse'}`}></span>
        </div>
      </div>

      {eventosExibidos.length > 0 ? (
        <div className="flex flex-col gap-6 relative">
          
          {/* Navegação Minimalista nas Laterais */}
          {eventos.length > 1 && (
            <>
              <button 
                onClick={prevEvent}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/80 backdrop-blur-md border border-neutral-100 text-neutral-400 hover:text-[#0073B7] hover:border-[#0073B7] rounded-full shadow-xl transition-all opacity-0 group-hover/ag:opacity-100 -translate-x-2 group-hover/ag:translate-x-0"
              >
                <ChevronLeft size={18} strokeWidth={3} />
              </button>
              <button 
                onClick={nextEvent}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/80 backdrop-blur-md border border-neutral-100 text-neutral-400 hover:text-[#0073B7] hover:border-[#0073B7] rounded-full shadow-xl transition-all opacity-0 group-hover/ag:opacity-100 translate-x-2 group-hover/ag:translate-x-0"
              >
                <ChevronRight size={18} strokeWidth={3} />
              </button>
            </>
          )}

          <div className="transition-all duration-700">
            {eventosExibidos.map((evento: Evento) => (
              <div key={evento.id} className="hover:scale-[1.01] transition-transform duration-500 bg-neutral-50/50 p-2 rounded-[2rem] border border-neutral-100">
                <EventCard 
                  evento={evento} 
                  onExpandChange={(expanded) => setIsModalOpen(expanded)}
                />
              </div>
            ))}
          </div>
          
          <div className="flex flex-col gap-5">
            <Link href="/eventos/" className="w-full bg-neutral-950 hover:bg-[#0073B7] text-white py-4 text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-500 rounded-2xl text-center block shadow-lg hover:shadow-[#0073B7]/20 transform hover:-translate-y-1">Agenda Completa</Link>
            
            {eventos.length > 1 && (
              <div className="flex justify-center gap-1.5">
                {eventos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentEventIndex(idx)}
                    className={`h-1 rounded-full transition-all duration-500 ${idx === currentEventIndex ? 'w-8 bg-[#0073B7]' : 'w-2 bg-neutral-200 hover:bg-neutral-300'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-xs italic text-neutral-400 font-medium py-6 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">Não há eventos marcados.</p>
      )}
    </section>
  );
}
