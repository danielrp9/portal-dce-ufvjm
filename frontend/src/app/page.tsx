"use client";

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { Noticia, Evento, Documento } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import he from 'he';
import EventCard from '@/components/EventCard';

interface DjangoPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export default function HomePage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [editalDestaque, setEditalDestaque] = useState<Documento | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [newsRes, eventsRes, docsRes] = await Promise.all([
          api.get<DjangoPaginatedResponse<Noticia> | Noticia[]>('noticias/'),
          api.get<DjangoPaginatedResponse<Evento> | Evento[]>('eventos/'),
          api.get<DjangoPaginatedResponse<Documento> | Documento[]>('documentos/')
        ]);

        const listaNoticias = Array.isArray(newsRes.data) 
          ? newsRes.data 
          : (newsRes.data && 'results' in newsRes.data ? newsRes.data.results : []);

        const listaEventos = Array.isArray(eventsRes.data) 
          ? eventsRes.data 
          : (eventsRes.data && 'results' in eventsRes.data ? eventsRes.data.results : []);

        const listaDocs = Array.isArray(docsRes.data) 
          ? docsRes.data 
          : (docsRes.data && 'results' in docsRes.data ? docsRes.data.results : []);

        const edital = listaDocs.find((doc: Documento) => doc.tipo === 'EDITAL') || null;

        setNoticias(listaNoticias);
        // Armazena os 3 próximos eventos para a listagem da agenda
        setEventos(listaEventos.slice(0, 3));
        setEditalDestaque(edital);
      } catch (e) {
        console.error("Erro ao carregar dados dinâmicos da Home:", e);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFB] flex items-center justify-center font-sans text-xs font-bold uppercase tracking-widest text-slate-400">
        Carregando Atualizações do Portal...
      </div>
    );
  }

  const principal = noticias[0];
  const secundarias = noticias.slice(1, 4);

  return (
    <main className="min-h-screen bg-[#FDFDFB] text-slate-900 selection:bg-black selection:text-white font-serif">
      
      {/* CONTAINER PRINCIPAL DO GRID MACRO */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* COLUNA ESQUERDA (8/12): FLUXO EDITORIAL DE NOTÍCIAS */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          
          {/* 1. MANCHETE PRINCIPAL EM DESTAQUE */}
          {principal ? (
            <article className="group cursor-pointer relative w-full rounded-sm overflow-hidden border border-black/5 shadow-xs bg-white transition-all duration-300 hover:shadow-md">
              <Link href={`/noticias/${principal.slug}/`}>
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                  <Image 
                    src={principal.capa.startsWith('http') ? principal.capa : `http://127.0.0.1:8000${principal.capa}`}
                    alt={principal.titulo} 
                    fill 
                    className="object-cover transition-all duration-700 ease-out grayscale-[8%] group-hover:grayscale-0 group-hover:scale-101" 
                    priority
                  />
                  
                  {/* Micro-arredondamento sutil apenas na tag de controle contextual */}
                  <div className="absolute top-4 left-4 bg-slate-950 text-white text-[9px] px-3 py-1 font-bold uppercase font-sans tracking-widest z-20 rounded-xs">
                    Destaque
                  </div>

                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent flex flex-col justify-end pb-6 px-6 md:px-8 z-10">
                    <div className="flex items-center gap-4 text-[9px] font-bold text-slate-300 mb-2 uppercase tracking-widest font-sans opacity-90">
                      <span>Por {principal.autor || 'Redação DCE'}</span>
                      <span className="text-white/20">•</span>
                      <span>{new Date(principal.data_publicacao).toLocaleDateString('pt-BR')}</span>
                    </div>

                    <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight tracking-tight mb-2 transition-colors duration-300 group-hover:text-[#0073B7]">
                      {principal.titulo}
                    </h2>

                    <p className="text-xs md:text-sm text-slate-300 font-sans font-light line-clamp-2 max-w-2xl leading-relaxed opacity-90">
                      {he.decode(principal.conteudo.replace(/<[^>]*>?/gm, ''))}
                    </p>
                  </div>
                </div>
              </Link>
            </article>
          ) : (
            <div className="w-full min-h-[350px] border border-dashed border-black/10 rounded-sm flex items-center justify-center text-xs text-slate-400 font-sans uppercase tracking-widest">
              Nenhum destaque publicado.
            </div>
          )}

          {/* 2. SEÇÃO DE NOTÍCIAS RECENTES */}
          {secundarias.length > 0 && (
            <div className="w-full pt-4">
              <div className="h-px bg-black/10 w-full mb-6"></div>
              
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] font-sans text-slate-400 mb-6">
                Outras Publicações Recentes
              </h3>

              {/* Grid interno responsivo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {secundarias.map((news: Noticia) => (
                  <article 
                    key={news.id} 
                    className="group flex flex-col bg-white border border-black/5 rounded-sm overflow-hidden shadow-2xs hover:bg-[#F9F9F7]/40 hover:shadow-md transition-all duration-300"
                  >
                    <Link href={`/noticias/${news.slug}/`} className="flex flex-col h-full">
                       <div className="aspect-video relative overflow-hidden bg-slate-100 border-b border-black/5">
                          <Image 
                            src={news.capa.startsWith('http') ? news.capa : `http://127.0.0.1:8000${news.capa}`} 
                            alt={news.titulo} 
                            fill 
                            className="object-cover transition-transform duration-500 ease-out grayscale-[5%] group-hover:grayscale-0 group-hover:scale-102" 
                          />
                       </div>

                       <div className="p-5 flex flex-col flex-1">
                         <span className="text-[9px] font-black text-[#0073B7] uppercase tracking-widest font-sans mb-2 block">
                            {new Date(news.data_publicacao).toLocaleDateString('pt-BR')}
                         </span>
                         <h4 className="text-base font-bold leading-tight text-slate-950 group-hover:text-[#0073B7] transition-colors mb-2 line-clamp-2 font-serif tracking-tight">
                           {news.titulo}
                         </h4>
                         <p className="text-xs text-slate-500 leading-relaxed font-sans line-clamp-2 mt-auto font-light">
                            {he.decode(news.conteudo.replace(/<[^>]*>?/gm, ''))}
                         </p>
                       </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* COLUNA DIREITA (4/12): SIDEBAR ASIDE INDEPENDENTE */}
        <aside className="lg:col-span-4 flex flex-col gap-12">
          
          {/* ESTRUTURA REFORMULADA DE EDITAIS */}
          <div className="flex flex-col bg-white border border-black/[0.08] rounded-sm p-6 shadow-2xs relative overflow-hidden">
            
            {/* Header da Seção */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/5">
              <h3 className="font-sans text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">
                Editais e Documentos
              </h3>
              {editalDestaque && (
                <span className="bg-[#EE86C2] text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-xs shadow-3xs transform rotate-1">
                  Novo
                </span>
              )}
            </div>
            
            {editalDestaque ? (
              <div className="flex flex-col gap-5 mb-6">
                <Link 
                  href={editalDestaque.arquivo.startsWith('http') ? editalDestaque.arquivo : `http://127.0.0.1:8000${editalDestaque.arquivo}`}
                  target="_blank"
                  className="group/doc flex gap-4 items-start p-3 -mx-3 rounded-md hover:bg-slate-50 transition-all duration-200"
                >
                  {/* Ícone de PDF Minimalista e Sofisticado */}
                  <div className="flex-shrink-0 w-11 h-14 bg-red-500 group-hover/doc:bg-red-600 transition-colors rounded-xs flex flex-col items-center justify-center font-sans text-[10px] font-black text-white shadow-xs select-none relative">
                    <span className="leading-none mb-0.5">PDF</span>
                    <div className="w-5 h-[1.5px] bg-white/30"></div>
                  </div>
                  
                  {/* Detalhes do Documento */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold text-slate-400 font-sans uppercase tracking-wider block mb-1">
                      Publicado em {new Date(editalDestaque.data_upload).toLocaleDateString('pt-BR')}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug font-serif line-clamp-3 group-hover/doc:text-[#0073B7] transition-colors tracking-tight">
                      {editalDestaque.titulo}
                    </h4>
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#0073B7] font-sans font-bold uppercase tracking-wider mt-2 opacity-0 group-hover/doc:opacity-100 transition-all duration-200 transform translate-x-[-4px] group-hover/doc:translate-x-0">
                      Acessar arquivo →
                    </span>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="mb-6 py-8 px-4 border border-dashed border-black/10 rounded-sm flex flex-col items-center justify-center bg-slate-50/50">
                <p className="text-[11px] text-slate-400 text-center leading-relaxed font-sans">
                  Não há editais ativos no momento.
                </p>
              </div>
            )}
            
            {/* Link de Ação do Repositório Geral */}
            <Link 
              href="/documentos/" 
              className="w-full bg-slate-950 text-white py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#0073B7] transition-all font-sans rounded-xs shadow-2xs text-center"
            >
              Ver todos os editais
            </Link>
          </div>

          {/* Agenda Universitária */}
          <section className="border-t-2 border-black pt-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex justify-between items-center font-sans">
              Agenda DCE <span className="w-2 h-2 bg-red-600 rounded-full"></span>
            </h3>
            {eventos.length > 0 ? (
              <div className="flex flex-col gap-4">
                {eventos.map((evento: Evento, index: number) => (
                  <div key={evento.id}>
                    <div className="hover:opacity-90 transition-opacity">
                      <EventCard evento={evento} />
                    </div>
                    {index < eventos.length - 1 && (
                      <div className="h-px bg-black/[0.06] w-full mt-4"></div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] italic text-slate-400 font-sans">Sem eventos próximos.</p>
            )}
          </section>
        </aside>

      </div>
    </main>
  );
}