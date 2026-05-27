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

  // Garante que o portal só execute no cliente, evitando erros de SSR
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

  // Estrutura interna isolada do Modal de Detalhes
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 select-none">
      {/* Background escuro com desfoque de alta fidelidade */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300" 
        onClick={() => setIsExpanded(false)}
      />
      
      {/* Caixa de diálogo principal totalmente responsiva */}
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl p-6 md:p-12 z-10 text-slate-900 font-serif">
        <button 
          onClick={() => setIsExpanded(false)}
          className="absolute top-6 right-6 text-slate-400 hover:text-black transition-colors focus:outline-none"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#0073B7] mb-4 block font-sans">
          Informações Completas
        </span>
        <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tighter mb-6 md:mb-8 leading-none">
          {evento.titulo}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 border-y border-slate-100 py-6 md:py-8 text-left font-sans">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Localização</p>
            <p className="text-xs md:text-sm font-bold uppercase text-slate-700">📍 {evento.local}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Data e Horário</p>
            <p className="text-xs md:text-sm font-bold uppercase text-slate-700">
              📅 {dataEvento.toLocaleDateString('pt-BR', { dateStyle: 'long' })}
            </p>
          </div>
        </div>

        <div className="mb-8 md:mb-12 font-serif">
          <p className="text-sm md:text-base text-slate-700 leading-relaxed whitespace-pre-line text-left">
            {evento.descricao}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 font-sans">
          {evento.link_ingresso && (
            <a 
              href={evento.link_ingresso}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#0073B7] text-white text-center py-3.5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all rounded-xs"
            >
              Adquirir Ingresso
            </a>
          )}
          <button 
            onClick={handleShare}
            className={`px-6 py-3.5 text-[10px] font-black uppercase tracking-[0.3em] transition-all border rounded-xs ${
                copied ? 'bg-[#8CC63F] border-[#8CC63F] text-black' : 'border-slate-200 hover:bg-slate-50 text-slate-700'
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
      {/* CARD ENVELOPADO: Agora possui fundo branco e bordas delimitadoras explícitas alinhadas com o bloco de editais */}
      <div className="group flex flex-col bg-white border border-black/10 rounded-sm shadow-xs overflow-hidden transition-all duration-300 hover:shadow-md text-left">
        
        {/* Banner com Proporção Fixa e Linha Divisória Inferior Bruta */}
        <div className="relative aspect-[16/10] w-full bg-slate-50 overflow-hidden border-b border-black/10">
          <Image 
            src={evento.banner.startsWith('http') ? evento.banner : `http://127.0.0.1:8000${evento.banner}`}
            alt={evento.titulo}
            fill
            className="object-cover transition-all duration-1000 grayscale-[15%] group-hover:grayscale-0 group-hover:scale-102"
          />
          
          <div className="absolute top-0 left-0 bg-slate-950 text-white px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] font-sans">
            {dataEvento.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </div>

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
                <span className="text-[9px] font-black uppercase tracking-widest font-sans">Link Copiado</span>
              </>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6a3 3 0 106.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            )}
          </button>
        </div>

        {/* BLOCO INFORMATIVO DELIMITADO: Encapsulado com padding (p-5) para evitar o vazamento lateral do texto */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-3 font-sans">
             <span className="text-[9px] font-black text-[#0073B7] uppercase tracking-widest">Campus</span>
             <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
               {dataEvento.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}H
             </span>
          </div>

          <h3 className="text-xl font-bold uppercase tracking-tight leading-tight mb-2 text-slate-950 group-hover:text-[#0073B7] transition-colors font-sans">
            {evento.titulo}
          </h3>
          
          <p className="text-xs text-slate-500 line-clamp-2 mb-6 leading-relaxed font-medium font-sans">
            {evento.descricao}
          </p>

          {/* Rodapé de ações interno, delimitado com borda e espaçamento */}
          <div className="flex items-center justify-between mt-auto font-sans pt-4 border-t border-slate-100">
            <button 
              onClick={() => setIsExpanded(true)}
              className="text-[10px] font-black uppercase tracking-widest text-[#8CC63F] hover:text-black transition-colors flex items-center gap-2 focus:outline-none"
            >
              <span className="w-4 h-4 border border-current rounded-full flex items-center justify-center text-[8px]">i</span>
              Detalhes
            </button>

            {evento.link_ingresso && (
              <a 
                href={evento.link_ingresso}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-slate-950 text-white text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#0073B7] transition-all rounded-xs shadow-2xs"
              >
                Ingressos
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Teleporta o modal diretamente para fora do escopo colunado da sidebar */}
      {isExpanded && mounted && createPortal(modalContent, document.body)}
    </>
  );
}