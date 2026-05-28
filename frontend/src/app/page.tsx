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
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
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

  // Força o Next.js a renderizar APENAS o loading no build estático.
  // Isso garante que o conteúdo real NUNCA seja "congelado" no HTML do build.
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col gap-4 items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-[#0073B7] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">Sincronizando Portal...</span>
      </div>
    );
  }

  const principal = noticias[0];
  const secundarias = noticias.slice(1, 4);

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-neutral-900 selection:bg-[#0073B7] selection:text-white font-sans antialiased pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 flex flex-col gap-12">
        
        {/* Bloco Superior: Banner de Destaque */}
        {principal ? (
          <article className="group cursor-pointer relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden bg-neutral-950 shadow-[0_24px_60px_rgba(0,0,0,0.18)] border border-neutral-800/20 transform transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_32px_70px_rgba(0,115,183,0.15)]">
            <Link href={`/noticias/${principal.slug}/`}>
              <div className="absolute inset-0 z-0">
                <Image 
                  src={principal.capa.startsWith('http') ? principal.capa : `http://127.0.0.1:8000${principal.capa}`}
                  alt={principal.titulo} 
                  fill 
                  className="object-cover transition-all duration-700 ease-out opacity-75 scale-100 group-hover:scale-105 group-hover:opacity-90" 
                  priority
                />
              </div>

              {/* Tag Superior 3D */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-neutral-950 text-[10px] px-4 py-2 font-black uppercase tracking-[0.2em] z-20 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.2)] border border-white/40">
                Notícia em Destaque
              </div>

              {/* Gradiente Acentuado de Profundidade */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent flex flex-col justify-end p-6 md:p-14 z-10">
                <div className="flex items-center gap-3 text-[10px] font-bold text-[#8CC63F] mb-4 uppercase tracking-[0.15em]">
                  <span className="text-white">Por {principal.autor || 'Redação DCE'}</span>
                  <span className="text-white/30">•</span>
                  <span>{new Date(principal.data_publicacao).toLocaleDateString('pt-BR')}</span>
                </div>

                <h2 className="text-xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4 max-w-4xl drop-shadow-md">
                  {principal.titulo}
                </h2>

                <p className="text-xs md:text-base text-neutral-300 font-normal line-clamp-2 max-w-3xl leading-relaxed opacity-90">
                  {he.decode(principal.conteudo.replace(/<[^>]*>?/gm, ''))}
                </p>
              </div>
            </Link>
          </article>
        ) : (
          <div className="w-full min-h-[350px] bg-white rounded-3xl border border-neutral-200/60 flex flex-col gap-2 items-center justify-center text-xs text-neutral-400 font-bold uppercase tracking-widest shadow-xs">
            <span>Nenhum destaque publicado.</span>
          </div>
        )}

        {/* Layout de Duas Colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Seção de Notícias Recentes (Esquerda) */}
          <section className="lg:col-span-8 bg-white rounded-[2rem] p-6 md:p-10 border border-neutral-200/50 shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col gap-8">
            <div className="border-b border-neutral-100 pb-5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#0073B7] mb-1">
                Feed Informativo
              </h3>
              <h2 className="text-3xl font-black tracking-tight text-neutral-950">
                Últimas Atualizações
              </h2>
            </div>

            {secundarias.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {secundarias.map((news: Noticia) => (
                  <article 
                    key={news.id} 
                    className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_35px_rgba(0,0,0,0.07)] transform hover:-translate-y-1 transition-all duration-400 h-full"
                  >
                    <Link href={`/noticias/${news.slug}/`} className="flex flex-col h-full">
                      <div className="aspect-video relative overflow-hidden bg-neutral-100">
                        <Image 
                          src={news.capa.startsWith('http') ? news.capa : `http://127.0.0.1:8000${news.capa}`} 
                          alt={news.titulo} 
                          fill 
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105" 
                        />
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <span className="text-[10px] font-black text-[#0073B7] uppercase tracking-wider mb-2.5 block">
                          {new Date(news.data_publicacao).toLocaleDateString('pt-BR')}
                        </span>
                        <h4 className="text-base font-bold leading-snug text-neutral-950 group-hover:text-[#0073B7] transition-colors mb-3 line-clamp-2 tracking-tight">
                          {news.titulo}
                        </h4>
                        <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 mt-auto font-normal">
                          {he.decode(news.conteudo.replace(/<[^>]*>?/gm, ''))}
                        </p>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400 italic py-8">Não há outras publicações recentes.</p>
            )}
          </section>

          {/* Sidebar Auxiliar (Direita) */}
          <aside className="lg:col-span-4 flex flex-col gap-10">
            
            {/* Bloco de Editais */}
            <div className="flex flex-col bg-gradient-to-br from-neutral-900 to-neutral-950 text-white rounded-[2rem] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.25)] relative overflow-hidden border border-neutral-800">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#8CC63F]/10 blur-3xl pointer-events-none rounded-full"></div>
              
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400">
                  Editais e Documentos
                </h3>
                {editalDestaque && (
                  <span className="bg-[#8CC63F] text-neutral-950 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_12px_rgba(140,198,63,0.4)] animate-pulse">
                    Novo
                  </span>
                )}
              </div>
              
              {editalDestaque ? (
                <div className="flex flex-col gap-4 mb-6">
                  <Link 
                    href={editalDestaque.arquivo.startsWith('http') ? editalDestaque.arquivo : `http://127.0.0.1:8000${editalDestaque.arquivo}`}
                    target="_blank"
                    className="group/doc flex gap-4 items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex flex-col items-center justify-center font-black text-[10px] text-white shadow-md select-none tracking-tighter">
                      <span>DOC</span>
                      <span className="text-[7px] font-medium opacity-80">PDF</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold text-[#8CC63F] uppercase tracking-wide block mb-0.5">
                        {new Date(editalDestaque.data_upload).toLocaleDateString('pt-BR')}
                      </span>
                      <h4 className="text-xs font-bold text-white leading-snug line-clamp-2 tracking-tight group-hover/doc:text-[#8CC63F] transition-colors">
                        {editalDestaque.titulo}
                      </h4>
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="mb-6 py-10 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center bg-white/5">
                  <p className="text-xs text-neutral-400 text-center font-light">
                    Não há editais ativos no momento.
                  </p>
                </div>
              )}
              
              <Link 
                href="/documentos/" 
                className="w-full bg-white text-neutral-950 py-4 text-xs font-black uppercase tracking-widest hover:bg-[#8CC63F] hover:text-neutral-950 transition-all duration-300 rounded-xl shadow-lg text-center"
              >
                Ver todos os editais
              </Link>
            </div>

            {/* Bloco de Agenda */}
            <section className="bg-white rounded-[2rem] p-6 md:p-8 border border-neutral-200/50 shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col gap-6">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
                <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#0073B7]">
                  Agenda Universitária
                </h3>
                <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></span>
              </div>

              {eventos.length > 0 ? (
                <div className="flex flex-col gap-5">
                  {eventos.map((evento: Evento, index: number) => (
                    <div key={evento.id} className="flex flex-col gap-5">
                      <div className="hover:opacity-90 transition-opacity transform hover:translate-x-0.5 transition-transform duration-200">
                        <EventCard evento={evento} />
                      </div>
                      {index < eventos.length - 1 && (
                        <div className="h-px bg-neutral-100 w-full" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic text-neutral-400 font-light py-2">Sem eventos próximos.</p>
              )}
            </section>

          </aside>
        </div>

      </div>
    </main>
  );
}
