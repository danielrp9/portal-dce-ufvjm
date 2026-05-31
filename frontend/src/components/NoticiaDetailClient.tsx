"use client";

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { Noticia } from '@/types';
import { getMediaUrl } from '@/utils/urls';
import Image from 'next/image';
import Link from 'next/link';
import PrintButton from '@/components/PrintButton';
import he from 'he';

interface NoticiaDetailClientProps {
  slug: string;
}

export default function NoticiaDetailClient({ slug }: NoticiaDetailClientProps) {
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let realSlug = slug;
    
    if ((!realSlug || realSlug === 'detalhe' || realSlug === 'fallback') && typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      if (pathParts[0] === 'noticias' && pathParts[1]) {
        realSlug = pathParts[1];
      }
    }

    if (!realSlug || realSlug === 'detalhe' || realSlug === 'fallback') {
      setLoading(false);
      return;
    }

    async function fetchDetail() {
      try {
        const res = await api.get<Noticia>(`noticias/${realSlug}/`);
        setNoticia(res.data);
      } catch (error) {
        console.error("Erro ao buscar conteúdo dinâmico da notícia:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col gap-4 items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-[#0073B7] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">Carregando Reportagem...</span>
      </div>
    );
  }

  if (!noticia) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center font-sans gap-4">
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Matéria não encontrada</p>
        <Link href="/noticias/" className="px-6 py-3 bg-neutral-950 text-white text-[9px] font-bold uppercase tracking-widest rounded-xl transition-all hover:bg-neutral-800 shadow-sm">
          Voltar para notícias
        </Link>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `/noticias/${noticia.slug}/`;
  const shareText = encodeURIComponent(`Portal do DCE: ${noticia.titulo}`);

  const listaTags = (noticia as any).tags
    ? (noticia as any).tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
    : [];

  const isGeral = !(noticia as any).campus || (noticia as any).campus === 'GERAL';

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-neutral-900 selection:bg-[#0073B7] selection:text-white font-sans antialiased pb-32">
      
      {/* 1. BREADCRUMB EDITORIAL SUTIL */}
      <div className="w-full border-b border-neutral-200/60 mb-8 bg-white/50 backdrop-blur-md sticky top-0 z-30 print:hidden">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-4">
          <nav className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">
            <Link href="/" className="hover:text-[#0073B7] transition-colors">Início</Link>
            <span className="text-neutral-300">/</span>
            <Link href="/noticias/" className="hover:text-[#0073B7] transition-colors">Notícias</Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-950 truncate max-w-[180px] md:max-w-xs">
              {noticia.titulo}
            </span>
          </nav>
        </div>
      </div>

      {/* CONTAINER LINEAR DA MATÉRIA */}
      <article className="max-w-4xl mx-auto px-4 md:px-6 pt-6 md:pt-10">
        
        {/* CABEÇALHO DA MATÉRIA */}
        <header className="mb-10 border-b border-neutral-200 pb-8 flex flex-col items-center text-center w-full">
          
          <div className="mb-4 select-none">
            {isGeral ? (
              <span className="bg-neutral-200/60 text-neutral-800 text-[8px] px-3 py-1.5 font-black uppercase tracking-[0.15em] rounded-full border border-neutral-300/40">
                Informativo Geral
              </span>
            ) : (
              <span className="bg-[#0073B7] text-white text-[8px] px-3 py-1.5 font-black uppercase tracking-[0.15em] rounded-full shadow-[0_4px_12px_rgba(0,115,183,0.15)]">
                Campus {(noticia as any).campus_display}
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-neutral-950 mb-6 max-w-3xl leading-snug">
            {noticia.titulo}
          </h1>

          <p className="text-xs md:text-sm text-neutral-500 font-normal opacity-90 leading-relaxed max-w-2xl mb-6">
            {(noticia as any).descricao || "Acompanhe os detalhes e os desdobramentos desta publicação oficial realizada pelo Diretório Central dos Estudantes."}
          </p>
          
          <div className="flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">
            <span className="text-neutral-950">Por {noticia.autor || 'Redação DCE'}</span>
            <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
            <span>Publicado: {new Date(noticia.data_publicacao).toLocaleDateString('pt-BR')}</span>
          </div>
        </header>

        {/* CORPO DA MATÉRIA PADRONIZADO EM SANS-SERIF */}
        <div 
          className="prose prose-neutral max-w-none text-neutral-800 text-sm md:text-base leading-relaxed text-justify mb-12 font-sans font-normal"
          dangerouslySetInnerHTML={{ __html: noticia.conteudo }} 
        />

        {/* IMAGEM DE CAPA POSICIONADA AO FINAL PARA MANTER A EXPERIÊNCIA DE LEITURA */}
        {noticia.capa && (
          <div className="max-w-3xl mx-auto w-full relative aspect-video rounded-[2rem] overflow-hidden mb-12 shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-neutral-200/50 bg-neutral-900">
            <Image 
              src={getMediaUrl(noticia.capa)} 
              alt={noticia.titulo} 
              fill 
              className="object-cover"
            />
          </div>
        )}

        {/* SEÇÃO DE TAGS NO PADRÃO DE DESIGN ARREDONDADO */}
        {listaTags.length > 0 && (
          <div className="w-full flex flex-wrap items-center gap-2 mb-12 select-none print:hidden">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 mr-1">Assuntos:</span>
            {listaTags.map((tag: string, index: number) => (
              <span key={index} className="bg-white text-neutral-500 border border-neutral-200 text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.02)]">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* --- RODAPÉ DE FERRAMENTAS INSTITUCIONAIS --- */}
        <footer className="pt-8 border-t border-neutral-200 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-neutral-950 flex items-center justify-center text-[10px] font-black text-white uppercase tracking-wider select-none">
                {(noticia.autor || 'DC').substring(0,2).toUpperCase()}
            </div>
            <p className="text-[10px] font-black text-neutral-950 uppercase tracking-[0.15em]">DCE UFVJM</p>
          </div>

          <div className="flex items-center gap-3">
            <PrintButton />

            <div className="flex items-center gap-2 border-l border-neutral-200 pl-3">
                <a 
                  href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2.5 bg-white text-neutral-900 hover:bg-neutral-950 hover:text-white transition-all duration-300 transform active:scale-95 rounded-xl border border-neutral-200/60 shadow-[0_8px_20px_rgba(0,0,0,0.02)] hover:border-neutral-950"
                  title="Compartilhar no WhatsApp"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412 0 12.048c0 2.12.554 4.189 1.605 6.04L0 24l6.104-1.602a11.803 11.803 0 005.94 1.603h.005c6.634 0 12.043-5.412 12.048-12.049a11.815 11.815 0 00-3.535-8.508z" />
                  </svg>
                </a>
                <Link href="/noticias/" className="ml-1 px-5 py-2.5 bg-white hover:bg-neutral-950 border border-neutral-200/60 hover:border-neutral-950 text-neutral-900 hover:text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 transform active:scale-95 shadow-[0_8px_20px_rgba(0,0,0,0.02)]">
                  Voltar
                </Link>
            </div>
          </div>
        </footer>
      </article>
    </main>
  );
}