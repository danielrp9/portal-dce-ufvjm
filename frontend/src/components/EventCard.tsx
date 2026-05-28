"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Evento } from '@/types';

interface EventCardProps {
  evento: Evento;
}

export default function EventCard({ evento }: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const dataEvento = new Date(evento.data_hora);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6">
      {/* Background escuro com desfoque alinhado ao padrão do sistema */}
      <div 
        className="absolute inset-0 bg-neutral-950/40 backdrop-blur-md transition-opacity duration-300" 
        onClick={() => setIsExpanded(false)}
      />
      
      {/* Caixa de diálogo arredondada e minimalista */}
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-neutral-200/60 shadow-xl p-6 md:p-10 z-10 text-neutral-900 font-sans antialiased flex flex-col gap-6">
        <button 
          onClick={() => setIsExpanded(false)}
          className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-950 transition-colors focus:outline-none p-2 hover:bg-neutral-50 rounded-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-2 block">
            Informações Completas
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-950 leading-tight pr-8">
            {evento.titulo}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-y border-neutral-100 py-6 text-left">
          <div>
            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Localização</p>
            <p className="text-xs md:text-sm font-semibold text-neutral-800 flex items-center gap-1.5">
              <span>📍</span> {evento.local}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Data e Horário</p>
            <p className="text-xs md:text-sm font-semibold text-neutral-800 flex items-center gap-1.5">
              <span>📅</span> {dataEvento.toLocaleDateString('pt-BR', { dateStyle: 'long' })}
            </p>
          </div>
        </div>

        <div className="text-left">
          <p className="text-sm text-neutral-600 leading-relaxed font-light whitespace-pre-line">
            {evento.descricao}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 mt-auto">
          {evento.link_ingresso && (
            <a 
              href={evento.link_ingresso}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-neutral-950 text-white text-center py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all rounded-xl shadow-xs"
            >
              Adquirir Ingresso
            </a>
          )}
          <button 
            onClick={handleShare}
            className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border rounded-xl ${
                copied 
                  ? 'bg-neutral-100 border-neutral-300 text-neutral-950' 
                  : 'border-neutral-200 hover:bg-neutral-50 text-neutral-500 hover:text-neutral-950'
            }`}
          >
            {copied ? 'Link Copiado!' : 'Compartilhar'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* CARD ENVELOPADO: Fundo transparente, sem sombras duras, atuando de forma integrada na sidebar */}
      <div className="group flex flex-col bg-transparent text-left w-full">
        
        {/* Banner com Proporção Fixa e bordas perfeitamente arredondadas */}
        <div className="relative aspect-[16/9] w-full bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-200/60 shadow-2xs">
          <Image 
            src={evento.banner.startsWith('http') ? evento.banner : `http://127.0.0.1:8000${evento.banner}`}
            alt={evento.titulo}
            fill
            className="object-cover transition-all duration-700 ease-out opacity-90 group-hover:opacity-100 group-hover:scale-102"
          />
          
          {/* Tag de Data no topo esquerdo do banner */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-neutral-950 px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full shadow-xs">
            {dataEvento.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </div>

          <button 
            onClick={handleShare}
            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-10 flex items-center gap-2 shadow-xs ${
              copied 
                ? 'bg-white text-neutral-950 px-4' 
                : 'bg-neutral-950/80 text-white hover:bg-white hover:text-neutral-950'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-emerald-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[9px] font-bold uppercase tracking-widest">Copiado</span>
              </>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6a3 3 0 106.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            )}
          </button>
        </div>

        {/* Bloco Informativo de apoio */}
        <div className="pt-4 flex flex-col flex-1">
          <div className="flex items-center gap-2.5 mb-2">
             <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Agenda</span>
             <span className="w-1 h-1 bg-neutral-200 rounded-full"></span>
             <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
               {dataEvento.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}H
             </span>
          </div>

          <h4 className="text-lg font-bold tracking-tight text-neutral-950 group-hover:text-neutral-700 transition-colors mb-2 line-clamp-2">
            {evento.titulo}
          </h4>
          
          <p className="text-xs text-neutral-500 line-clamp-2 mb-4 leading-relaxed font-light">
            {evento.descricao}
          </p>

          {/* Botões de Ações de rodapé organizados */}
          <div className="flex items-center justify-between mt-auto gap-4">
            <button 
              onClick={() => setIsExpanded(true)}
              className="text-[10px] font-bold uppercase tracking-widest text-neutral-950 hover:text-neutral-500 transition-colors flex items-center gap-1.5 focus:outline-none py-1.5"
            >
              <span className="w-3.5 h-3.5 border border-current rounded-full flex items-center justify-center text-[8px] font-bold">i</span>
              Ver detalhes
            </button>

            {evento.link_ingresso && (
              <a 
                href={evento.link_ingresso}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-neutral-950 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all rounded-lg shadow-2xs"
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