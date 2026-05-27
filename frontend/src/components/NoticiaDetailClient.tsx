"use client";

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { Noticia } from '@/types';
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
      <div className="min-h-screen bg-white flex items-center justify-center font-sans text-xs font-bold uppercase tracking-widest text-slate-400">
        Carregando Reportagem...
      </div>
    );
  }

  if (!noticia) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans gap-4">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Matéria não encontrada</p>
        <Link href="/noticias/" className="px-6 py-3 bg-[#0073B7] text-white text-[9px] font-black uppercase tracking-widest rounded-sm">
          Voltar para notícias
        </Link>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `http://dce.ufvjm.edu.br/noticias/${noticia.slug}/`;
  const shareText = encodeURIComponent(`Portal do DCE: ${noticia.titulo}`);

  // Processa as tags vindas da API de forma segura cortando por vírgulas
  const listaTags = (noticia as any).tags
    ? (noticia as any).tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
    : [];

  const isGeral = !(noticia as any).campus || (noticia as any).campus === 'GERAL';

  return (
    <main className="min-h-screen bg-white pb-32 selection:bg-black selection:text-white">
      
      {/* 1. BREADCRUMB EDITORIAL */}
      <div className="w-full bg-white border-b border-gray-100 print:hidden selection:bg-[#0073B7]/10 selection:text-[#0073B7]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest font-sans">
          <Link href="/" className="text-slate-400 hover:text-black transition-colors">
            Início
          </Link>
          <span className="text-slate-300">/</span>
          
          <Link href="/noticias/" className="text-slate-400 hover:text-black transition-colors">
            Notícias
          </Link>
          <div className="h-3 w-px bg-slate-200 mx-2"></div>
          
          <span className="text-[#0073B7] font-black truncate max-w-[280px] md:max-w-md">
            {noticia.titulo}
          </span>
        </div>
      </div>

      {/* CONTAINER LINEAR DA MATÉRIA */}
      <article className="max-w-4xl mx-auto px-6 pt-12 md:pt-16">
        
        {/* CABEÇALHO COM DISTANCIAMENTO SUAVE */}
        <header className="mb-12 flex flex-col items-center text-center w-full border-b border-slate-100 pb-10">
          
          {/* CORREÇÃO CIRÚRGICA DA REDUNDÂNCIA DA TAG GERAL */}
          <div className="mb-4 font-sans select-none">
            {isGeral ? (
              <span className="bg-slate-900 text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-xs">
                Informativo Geral
              </span>
            ) : (
              <span className="bg-[#0073B7] text-white text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-xs">
                Campus {(noticia as any).campus_display}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-950 leading-tight mb-6 font-serif max-w-3xl">
            {noticia.titulo}
          </h1>

          <p className="text-sm md:text-base text-slate-400 font-sans font-medium leading-relaxed max-w-2xl mb-6">
            {(noticia as any).descricao || "Acompanhe os detalhes e os desdobramentos desta publicação oficial realizada pelo Diretório Central dos Estudantes."}
          </p>
          
          <div className="flex items-center justify-center gap-4 text-[9px] font-bold uppercase tracking-widest text-slate-400 font-sans">
            <span className="text-slate-900 font-black">Por {noticia.autor || 'Redação DCE'}</span>
            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
            <span>Publicado: {new Date(noticia.data_publicacao).toLocaleDateString('pt-BR')}</span>
          </div>
        </header>

        {/* CORPO DA MATÉRIA EM FLUXO CONTÍNUO */}
        <div 
          className="prose prose-slate prose-base md:prose-lg max-w-none text-slate-800 leading-[1.95] font-serif text-justify mb-16 
                     first-letter:inline-block first-letter:text-3xl first-letter:md:text-4xl first-letter:font-black first-letter:text-[#0073B7] first-letter:mr-0.5"
          dangerouslySetInnerHTML={{ __html: noticia.conteudo }} 
        />

        {/* IMAGEM DE CAPA NO FINAL */}
        {noticia.capa && (
          <div className="w-full max-w-3xl mx-auto relative aspect-[16/10] rounded-sm overflow-hidden mb-10 shadow-md border border-slate-100">
            <Image 
              src={noticia.capa.startsWith('http') ? noticia.capa : `http://127.0.0.1:8000${noticia.capa}`} 
              alt={noticia.titulo} 
              fill 
              className="object-cover transition-all duration-700 grayscale-[5%] hover:grayscale-0"
            />
          </div>
        )}

        {/* SEÇÃO DE TAGS E ASSUNTOS NO FINAL DA PÁGINA */}
        {listaTags.length > 0 && (
          <div className="w-full max-w-3xl mx-auto flex flex-wrap items-center gap-1.5 mb-14 font-sans select-none text-left print:hidden">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 mr-1">Assuntos:</span>
            {listaTags.map((tag: string, index: number) => (
              <span key={index} className="bg-slate-50 text-slate-600 border border-black/[0.04] text-[8px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* --- RODAPÉ DE FERRAMENTAS INSTITUCIONAIS --- */}
        <footer className="pt-10 border-t border-slate-100 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center text-[10px] font-black text-white italic select-none">
                {(noticia.autor || 'DC').substring(0,2).toUpperCase()}
            </div>
            <p className="text-[11px] font-black text-slate-950 uppercase font-sans tracking-wider">DCE UFVJM</p>
          </div>

          <div className="flex items-center gap-3">
            <PrintButton />

            <div className="flex items-center gap-2 border-l border-slate-200 pl-4 font-sans">
                <a 
                  href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 bg-green-50 text-green-600 hover:bg-[#25D366] hover:text-white transition-all rounded-sm shadow-2xs border border-green-100"
                  title="Compartilhar no WhatsApp"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412 0 12.048c0 2.12.554 4.189 1.605 6.04L0 24l6.104-1.602a11.803 11.803 0 005.94 1.603h.005c6.634 0 12.043-5.412 12.048-12.049a11.815 11.815 0 00-3.535-8.508z" />
                  </svg>
                </a>
                <Link href="/noticias/" className="ml-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors">
                  Voltar
                </Link>
            </div>
          </div>
        </footer>
      </article>
    </main>
  );
}