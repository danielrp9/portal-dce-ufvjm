"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Evento } from '@/types';
import { getMediaUrl } from '@/utils/urls';

interface EventCardProps {
  evento: Evento;
  onExpandChange?: (expanded: boolean) => void;
}

export default function EventCard({ evento, onExpandChange }: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const dataEvento = new Date(evento.data_hora);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (onExpandChange) {
      onExpandChange(isExpanded);
    }
  }, [isExpanded, onExpandChange]);
  
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const eventUrl = `${window.location.origin}/eventos`;

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
      navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
      {/* Background escuro com desfoque alinhado ao padrão do sistema */}
      <div 
        className="absolute inset-0 bg-neutral-950/70 backdrop-blur-md transition-opacity duration-300" 
        onClick={() => setIsExpanded(false)}
      />
      
      {/* Caixa de diálogo arredondada e minimalista */}
      <div className="relative bg-white w-full h-full md:h-auto md:max-w-2xl md:max-h-[85vh] md:rounded-[2.5rem] shadow-2xl z-10 text-neutral-900 font-sans antialiased flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header Fixo */}
        <div className="flex items-center justify-between p-6 md:p-7 border-b border-neutral-100 bg-white sticky top-0 z-20">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 mb-0.5 select-none">
              <div className="w-5 h-[1.5px] bg-[#0073B7] rounded-full"></div>
              <h3 className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] text-[#0073B7]">
                Detalhes do Evento
              </h3>
            </div>
            <h2 className="text-lg md:text-2xl font-black tracking-tight text-neutral-950 uppercase leading-tight pr-10">
              {evento.titulo}
            </h2>
          </div>
          <button 
            onClick={() => setIsExpanded(false)}
            className="absolute top-5 right-5 md:top-6 md:right-6 text-neutral-400 hover:text-neutral-950 transition-all focus:outline-none p-2.5 hover:bg-neutral-100 rounded-xl border border-transparent hover:border-neutral-200 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Conteúdo Rolável */}
        <div className="flex-1 overflow-y-auto scrollbar-hide md:scrollbar-default p-6 md:p-8">
          {/* Estilo personalizado para scrollbar no desktop via CSS inline-like approach with Tailwind */}
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            
            @media (min-width: 768px) {
              .scrollbar-default::-webkit-scrollbar { width: 6px; }
              .scrollbar-default::-webkit-scrollbar-track { background: #f1f1f1; }
              .scrollbar-default::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
              .scrollbar-default::-webkit-scrollbar-thumb:hover { background: #0073B7; }
            }
          `}</style>

          <div className="flex flex-col gap-8">
            {/* Informações Rápidas em Grid Horizontal Suave e Compacto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div className="flex items-center gap-3.5 p-4 bg-neutral-50 rounded-xl border border-neutral-100/60 group">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-sm border border-neutral-100">📍</div>
                <div>
                  <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-0">Localização</p>
                  <p className="text-[11px] md:text-xs font-black text-neutral-950 uppercase">{evento.local}</p>
                </div>
              </div>
              <div className="flex items-center gap-3.5 p-4 bg-neutral-50 rounded-xl border border-neutral-100/60 group">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-sm border border-neutral-100">📅</div>
                <div>
                  <p className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-0">Data e Horário</p>
                  <p className="text-[11px] md:text-xs font-black text-neutral-950 uppercase">
                    {dataEvento.toLocaleDateString('pt-BR', { dateStyle: 'long' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Descrição com foco em leitura */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-5 bg-[#8CC63F] rounded-full shadow-[0_0_8px_#8CC63F]"></div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Descrição do Evento</h4>
              </div>
              <div className="prose prose-neutral max-w-none">
                <p className="text-sm md:text-base text-neutral-600 leading-relaxed font-medium whitespace-pre-line bg-white">
                  {evento.descricao}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Fixo */}
        <div className="p-6 md:p-7 border-t border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row gap-3">
          {evento.link_ingresso && (
            <a 
              href={evento.link_ingresso}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-neutral-950 text-white text-center py-4 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-[#0073B7] transition-all rounded-xl shadow-xl hover:shadow-[#0073B7]/20 active:scale-95"
            >
              Garantir Ingresso
            </a>
          )}
          <button 
            onClick={handleShare}
            className={`px-8 py-4 text-[9px] font-black uppercase tracking-[0.3em] transition-all border rounded-xl flex items-center justify-center gap-2.5 shadow-md active:scale-95 ${
                copied 
                  ? 'bg-[#8CC63F] border-[#8CC63F] text-white' 
                  : 'bg-white border-neutral-200 hover:border-neutral-950 text-neutral-400 hover:text-neutral-950'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                Link Copiado
              </>
            ) : 'Compartilhar'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="group flex flex-col bg-transparent text-left w-full">
        
        {/* Banner com Proporção Fixa */}
        <div className="relative aspect-[16/9] w-full bg-neutral-50 rounded-3xl overflow-hidden border border-neutral-200/60 shadow-2xs">
          <Image 
            src={getMediaUrl(evento.banner)}
            alt={evento.titulo}
            fill
            className="object-cover transition-all duration-700 ease-out opacity-95 group-hover:opacity-100 group-hover:scale-102"
          />
          
          {/* Tag de Data */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-neutral-950 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] rounded-full shadow-xs border border-neutral-100">
            {dataEvento.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </div>

          <button 
            onClick={handleShare}
            className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 z-10 flex items-center gap-2 shadow-xs ${
              copied 
                ? 'bg-[#8CC63F] text-white px-4' 
                : 'bg-neutral-950/80 text-white hover:bg-white hover:text-neutral-950'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[9px] font-bold uppercase tracking-widest">OK</span>
              </>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6a3 3 0 106.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            )}
          </button>
        </div>

        {/* Bloco Informativo */}
        <div className="pt-6 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-3">
             <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Agenda</span>
             <span className="w-1 h-1 bg-neutral-200 rounded-full"></span>
             <span className="text-[9px] font-bold text-[#0073B7] uppercase tracking-[0.2em]">
               {dataEvento.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}H
             </span>
          </div>

          <h4 className="text-xl font-bold tracking-tight text-neutral-950 group-hover:text-neutral-700 transition-colors mb-3 line-clamp-2">
            {evento.titulo}
          </h4>
          
          <p className="text-xs text-neutral-500 line-clamp-2 mb-6 leading-relaxed font-light">
            {evento.descricao}
          </p>

          {/* Ações */}
          <div className="flex items-center justify-between mt-auto gap-3 pt-4 border-t border-neutral-50">
            <button 
              onClick={() => setIsExpanded(true)}
              className="flex-1 bg-white border-2 border-neutral-950 text-neutral-950 py-2.5 text-[9px] font-black uppercase tracking-widest hover:bg-neutral-950 hover:text-white transition-all rounded-xl shadow-xs flex items-center justify-center gap-2 focus:outline-none group/det"
            >
              <div className="w-3.5 h-3.5 rounded-full border border-neutral-950 flex items-center justify-center text-[7px] font-black group-hover/det:border-white transition-colors italic">i</div>
              Detalhes
            </button>

            {evento.link_ingresso && (
              <a 
                href={evento.link_ingresso}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2.5 bg-neutral-950 text-white text-[9px] font-black uppercase tracking-widest hover:bg-[#8CC63F] transition-all rounded-xl shadow-xs text-center"
              >
                Ingressos
              </a>
            )}
          </div>
        </div>
      </div>

      {isExpanded && mounted && createPortal(modalContent, document.body)}
    </>
  );
}