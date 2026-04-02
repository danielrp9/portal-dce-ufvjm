"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Evento } from '@/types';

interface EventCardProps {
  evento: Evento;
}

export default function EventCard({ evento }: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false); // Estado para o feedback visual
  const dataEvento = new Date(evento.data_hora);
  
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const eventUrl = `${window.location.origin}/eventos`; // Ajuste conforme sua rota

    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: evento.titulo,
          text: `Confira este evento no DCE UFVJM: ${evento.titulo}`,
          url: eventUrl,
        });
      } catch (error) {
        console.log('Erro ao compartilhar', error);
      }
    } else {
      // Feedback Visual integrado em vez de Alert
      navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reseta o estado após 2 segundos
    }
  };

  return (
    <>
      <div className="group flex flex-col bg-white transition-all duration-500">
        {/* Banner com Proporção Fixa */}
        <div className="relative aspect-[16/10] w-full bg-slate-50 overflow-hidden border border-slate-100">
          <Image 
            src={evento.banner.startsWith('http') ? evento.banner : `http://127.0.0.1:8000${evento.banner}`}
            alt={evento.titulo}
            fill
            className="object-cover transition-all duration-1000 grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105"
          />
          
          <div className="absolute top-0 left-0 bg-black text-white px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em]">
            {dataEvento.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </div>

          {/* Botão de Compartilhar com Feedback Visual Integrado */}
          <button 
            onClick={handleShare}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all z-10 flex items-center gap-2 ${
              copied ? 'bg-[#8CC63F] text-black px-4' : 'bg-white/90 text-slate-900 hover:bg-[#0073B7] hover:text-white'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[9px] font-black uppercase tracking-widest">Link Copiado</span>
              </>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6a3 3 0 106.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            )}
          </button>
        </div>

        {/* Conteúdo Informativo */}
        <div className="py-6 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-4">
             <span className="text-[9px] font-black text-[#0073B7] uppercase tracking-widest">Campus</span>
             <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
               {dataEvento.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}H
             </span>
          </div>

          <h3 className="text-xl font-bold uppercase tracking-tighter leading-tight mb-4 group-hover:text-[#0073B7] transition-colors">
            {evento.titulo}
          </h3>
          
          <p className="text-xs text-slate-500 line-clamp-2 mb-6 leading-relaxed font-medium">
            {evento.descricao}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <button 
              onClick={() => setIsExpanded(true)}
              className="text-[10px] font-black uppercase tracking-widest text-[#8CC63F] hover:text-black transition-colors flex items-center gap-2"
            >
              <span className="w-4 h-4 border border-current rounded-full flex items-center justify-center text-[8px]">i</span>
              Detalhes
            </button>

            {evento.link_ingresso && (
              <a 
                href={evento.link_ingresso}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-black text-white text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#0073B7] transition-all rounded-sm"
              >
                Ingressos
              </a>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DE DETALHES (Fundo Desfocado) */}
      {isExpanded && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setIsExpanded(false)}
          />
          <div className="relative bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-sm shadow-2xl p-8 md:p-12 animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsExpanded(false)}
              className="absolute top-6 right-6 text-slate-300 hover:text-black transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0073B7] mb-6 block">Informações Completas</span>
            <h2 className="text-3xl font-bold uppercase tracking-tighter mb-8 leading-none">{evento.titulo}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 border-y border-slate-100 py-8 text-left">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Localização</p>
                <p className="text-sm font-bold uppercase text-slate-700">📍 {evento.local}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Data e Horário</p>
                <p className="text-sm font-bold uppercase text-slate-700">
                  📅 {dataEvento.toLocaleDateString('pt-BR', { dateStyle: 'long' })}
                </p>
              </div>
            </div>

            <div className="mb-12">
              <p className="text-base text-slate-600 leading-relaxed whitespace-pre-line text-left">
                {evento.descricao}
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {evento.link_ingresso && (
                <a 
                  href={evento.link_ingresso}
                  target="_blank"
                  className="flex-1 bg-[#0073B7] text-white text-center py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all"
                >
                  Adquirir Ingresso Agora
                </a>
              )}
              <button 
                onClick={handleShare}
                className={`px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${
                    copied ? 'bg-[#8CC63F] border-[#8CC63F] text-black' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {copied ? 'Link Copiado para Área de Transferência' : 'Compartilhar Evento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}