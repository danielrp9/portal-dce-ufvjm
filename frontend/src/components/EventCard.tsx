"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Evento } from '@/types';

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
      {/* Background escuro com desfoque alinhado ao padrão do sistema */}
      <div 
        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-md transition-opacity duration-300" 
        onClick={() => setIsExpanded(false)}
      />
      
      {/* Caixa de diálogo arredondada e minimalista */}
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-neutral-200/60 shadow-2xl p-8 md:p-12 z-10 text-neutral-900 font-sans antialiased flex flex-col gap-8 animate-in zoom-in-95 duration-300">
        <button 
          onClick={() => setIsExpanded(false)}
          className="absolute top-8 right-8 text-neutral-400 hover:text-neutral-950 transition-colors focus:outline-none p-2 hover:bg-neutral-50 rounded-full"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0073B7] mb-3 block">
            Informações Completas
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-950 leading-tight pr-10">
            {evento.titulo}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-y border-neutral-100 py-8 text-left">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center flex-shrink-0">
               <span className="text-sm">📍</span>
            </div>
            <div>
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Localização</p>
              <p className="text-xs md:text-sm font-bold text-neutral-900 uppercase">
                {evento.local}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center flex-shrink-0">
               <span className="text-sm">📅</span>
            </div>
            <div>
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Data e Horário</p>
              <p className="text-xs md:text-sm font-bold text-neutral-900 uppercase">
                {dataEvento.toLocaleDateString('pt-BR', { dateStyle: 'long' })}
              </p>
            </div>
          </div>
        </div>

        <div className="text-left">
          <p className="text-sm md:text-base text-neutral-500 leading-relaxed font-light whitespace-pre-line">
            {evento.descricao}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-auto">
          {evento.link_ingresso && (
            <a 
              href={evento.link_ingresso}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-neutral-950 text-white text-center py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all rounded-xl shadow-md"
            >
              Adquirir Ingresso
            </a>
          )}
          <button 
            onClick={handleShare}
            className={`px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all border rounded-xl flex items-center justify-center gap-2 ${
                copied 
                  ? 'bg-neutral-50 border-neutral-200 text-[#0073B7]' 
                  : 'border-neutral-200 hover:bg-neutral-50 text-neutral-400 hover:text-neutral-950'
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
            src={evento.banner.startsWith('http') ? evento.banner : `http://127.0.0.1:8000${evento.banner}`}
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
          <div className="flex items-center justify-between mt-auto gap-4 pt-4 border-t border-neutral-50">
            <button 
              onClick={() => setIsExpanded(true)}
              className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-neutral-950 transition-colors flex items-center gap-2 focus:outline-none"
            >
              <div className="w-4 h-4 rounded-full border border-neutral-200 flex items-center justify-center text-[8px] font-bold">i</div>
              Detalhes
            </button>

            {evento.link_ingresso && (
              <a 
                href={evento.link_ingresso}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-neutral-950 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-[#8CC63F] transition-all rounded-xl shadow-2xs"
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