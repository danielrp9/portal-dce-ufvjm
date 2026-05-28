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
      <div className="min-h-screen bg-[#F4F4F2] flex items-center justify-center font-sans text-xs font-bold uppercase tracking-widest text-neutral-400">
        Carregando Atualizações do Portal...
      </div>
    );
  }

  const principal = noticias[0];
  const secundarias = noticias.slice(1, 4);

  return (
    <main className="min-h-screen bg-[#F4F4F2] text-neutral-900 selection:bg-neutral-900 selection:text-white font-sans antialiased">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-8">
        
        {/* Bloco Superior: Banner de Destaque Principal */}
        {principal ? (
          <article className="group cursor-pointer relative w-full aspect-[16/8] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-sm bg-neutral-950 transition-all duration-500 hover:shadow-xl">
            <Link href={`/noticias/${principal.slug}/`}>
              <div className="absolute inset-0 z-0">
                <Image 
                  src={principal.capa.startsWith('http') ? principal.capa : `http://127.0.0.1:8000${principal.capa}`}
                  alt={principal.titulo} 
                  fill 
                  className="object-cover transition-all duration-700 ease-out opacity-85 group-hover:scale-102 group-hover:opacity-100" 
                  priority
                />
              </div>

              {/* Tag Arredondada no topo */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-neutral-950 text-[10px] px-4 py-1.5 font-bold uppercase tracking-widest z-20 rounded-full shadow-xs">
                Notícia em Destaque
              </div>

              {/* Gradiente e Conteúdo Textual inferior */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12 z-10">
                <div className="flex items-center gap-3 text-[10px] font-medium text-neutral-300 mb-3 uppercase tracking-wider opacity-90">
                  <span>Por {principal.autor || 'Redação DCE'}</span>
                  <span className="text-white/30">•</span>
                  <span>{new Date(principal.data_publicacao).toLocaleDateString('pt-BR')}</span>
                </div>

                <h2 className="text-2xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-4 max-w-4xl transition-colors duration-300">
                  {principal.titulo}
                </h2>

                <p className="text-sm md:text-base text-neutral-300 font-light line-clamp-2 max-w-3xl leading-relaxed opacity-90">
                  {he.decode(principal.conteudo.replace(/<[^>]*>?/gm, ''))}
                </p>
              </div>
            </Link>
          </article>
        ) : (
          <div className="w-full min-h-[300px] bg-white rounded-3xl border border-neutral-200/60 flex items-center justify-center text-xs text-neutral-400 uppercase tracking-widest shadow-2xs">
            Nenhum destaque publicado.
          </div>
        )}

        {/* Layout de Duas Colunas Inferior (Feed e Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Seção de Notícias Recentes (Esquerda) */}
          <section className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 border border-neutral-200/60 shadow-2xs flex flex-col gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 mb-1">
                Feed Informativo
              </h3>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-950">
                Últimas Atualizações
              </h2>
            </div>

            {secundarias.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {secundarias.map((news: Noticia) => (
                  <article 
                    key={news.id} 
                    className="group flex flex-col bg-neutral-50/50 rounded-2xl overflow-hidden border border-neutral-100 hover:bg-neutral-50 hover:shadow-md transition-all duration-300 h-full"
                  >
                    <Link href={`/noticias/${news.slug}/`} className="flex flex-col h-full">
                      <div className="aspect-video relative overflow-hidden bg-neutral-200">
                        <Image 
                          src={news.capa.startsWith('http') ? news.capa : `http://127.0.0.1:8000${news.capa}`} 
                          alt={news.titulo} 
                          fill 
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-102" 
                        />
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2 block">
                          {new Date(news.data_publicacao).toLocaleDateString('pt-BR')}
                        </span>
                        <h4 className="text-lg font-bold leading-snug text-neutral-950 group-hover:text-neutral-700 transition-colors mb-2 line-clamp-2 tracking-tight">
                          {news.titulo}
                        </h4>
                        <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 mt-auto font-light">
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
          <aside className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Bloco de Editais - Estilo Dark Minimalista da Imagem */}
            <div className="flex flex-col bg-[#121212] text-white rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
                  Editais e Documentos
                </h3>
                {editalDestaque && (
                  <span className="bg-white text-black text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                    Novo
                  </span>
                )}
              </div>
              
              {editalDestaque ? (
                <div className="flex flex-col gap-4 mb-6">
                  <Link 
                    href={editalDestaque.arquivo.startsWith('http') ? editalDestaque.arquivo : `http://127.0.0.1:8000${editalDestaque.arquivo}`}
                    target="_blank"
                    className="group/doc flex gap-4 items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-200"
                  >
                    {/* Ícone Minimalista Redondo */}
                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-xs text-neutral-950 shadow-xs select-none">
                      PDF
                    </div>
                    
                    {/* Informações do Edital */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wide block mb-0.5">
                        {new Date(editalDestaque.data_upload).toLocaleDateString('pt-BR')}
                      </span>
                      <h4 className="text-sm font-semibold text-white leading-snug line-clamp-2 tracking-tight group-hover/doc:text-neutral-300 transition-colors">
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
                className="w-full bg-white text-neutral-950 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all rounded-xl shadow-xs text-center"
              >
                Ver todos os editais
              </Link>
            </div>

            {/* Bloco de Agenda */}
            <section className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-200/60 shadow-2xs flex flex-col gap-6">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
                  Agenda Universitária
                </h3>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              </div>

              {eventos.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {eventos.map((evento: Evento, index: number) => (
                    <div key={evento.id} className="flex flex-col gap-4">
                      <div className="hover:opacity-85 transition-opacity">
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