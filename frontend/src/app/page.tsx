"use client";

import React, { useState, useEffect } from 'react';
import { Noticia, Evento, Edital } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import he from 'he';
import QuickAccess from '@/components/QuickAccess';
import RadioPlayer from '@/components/RadioPlayer';
import EventsCarousel from '@/components/EventsCarousel';
import { ChevronRight, FileText, Bell, Loader2 } from 'lucide-react';
import { getMediaUrl } from '@/utils/urls';
import api from '@/services/api';

export default function HomePage() {
  const [data, setData] = useState<{
    noticias: Noticia[];
    eventos: Evento[];
    editais: Edital[];
  }>({
    noticias: [],
    eventos: [],
    editais: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [newsRes, eventsRes, editaisRes] = await Promise.all([
          api.get('/noticias/'),
          api.get('/eventos/'),
          api.get('/editais/')
        ]);

        setData({
          noticias: newsRes.data.results || [],
          eventos: eventsRes.data.results || [],
          editais: editaisRes.data.results || []
        });
      } catch (e) {
        console.error("Erro ao carregar dados da Home:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const { noticias, eventos, editais } = data;
  const principal = noticias[0];
  const secundarias = noticias.slice(1, 4);
  const editaisAtivos = editais.filter((e: Edital) => e.ativo === true);
  const editalDestaque = editaisAtivos[0] || null;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F6F8] gap-4">
        <Loader2 className="w-12 h-12 text-[#0073B7] animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 animate-pulse">
          Sincronizando Portal...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F6F8] text-neutral-900 selection:bg-[#0073B7] selection:text-white font-sans antialiased pb-20 relative overflow-hidden">
      
      {/* Elementos de Fundo - Suavizados para conforto visual */}
      <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-[#0073B7]/6 blur-[180px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-[20%] right-[-10%] w-[800px] h-[800px] bg-[#8CC63F]/5 blur-[160px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] left-[5%] w-[1200px] h-[1200px] bg-[#00AEEF]/5 blur-[200px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 flex flex-col gap-10 md:gap-14 relative z-10">
        
        {/* HERO SECTION */}
        {principal ? (
          <article className="group cursor-pointer relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden bg-neutral-950 shadow-[0_40px_100px_-20px_rgba(0,21,41,0.3)] border border-white/10 transform transition-all duration-700 hover:shadow-[0_50px_120px_-20px_rgba(0,115,183,0.25)]">
            <Link href={`/noticias/${principal.slug}/`}>
              <div className="absolute inset-0 z-0">
                <Image 
                  src={getMediaUrl(principal.capa)}
                  alt={principal.titulo} 
                  fill 
                  className="object-cover transition-all duration-1000 ease-out opacity-75 scale-100 group-hover:scale-105 group-hover:opacity-90" 
                  priority
                />
              </div>

              <div className="absolute top-8 left-8 flex items-center gap-3 z-20">
                <div className="bg-[#0073B7] text-white text-[8px] px-4 py-2 font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                  Destaque Principal
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-[#001529] via-[#001529]/40 to-transparent flex flex-col justify-end p-8 md:p-14 z-10">
                <div className="max-w-4xl">
                  <div className="flex items-center gap-4 text-[10px] font-black text-[#8CC63F] mb-6 uppercase tracking-[0.25em]">
                    <span className="text-white bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10">Por {principal.autor || 'Redação DCE'}</span>
                    <span className="w-1.5 h-1.5 bg-[#8CC63F] rounded-full shadow-[0_0_10px_#8CC63F]"></span>
                    <span className="text-neutral-300">{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(principal.data_publicacao))}</span>
                  </div>

                  <h2 className="text-2xl md:text-5xl font-black text-white leading-[1.1] tracking-tight mb-6 drop-shadow-2xl group-hover:text-[#8CC63F] transition-colors duration-500">
                    {principal.titulo}
                  </h2>

                  <p className="text-sm md:text-lg text-neutral-300 font-medium line-clamp-2 max-w-3xl leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                    {he.decode(principal.conteudo.replace(/<[^>]*>?/gm, ''))}
                  </p>
                </div>
              </div>
            </Link>
          </article>
        ) : (
          <div className="w-full min-h-[400px] bg-white rounded-[2.5rem] border border-neutral-200/60 flex flex-col gap-4 items-center justify-center shadow-inner">
            <Bell size={48} className="text-neutral-200 animate-bounce" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400">Aguardando Novidades...</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start">
          
          {/* FEED DE ÚLTIMAS ATUALIZAÇÕES */}
          <section className="lg:col-span-8 bg-white/60 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 border border-white/60 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.05)] flex flex-col gap-10">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-[2px] bg-[#0073B7] rounded-full"></div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0073B7]">Informativoz</h3>
                </div>
                <h2 className="text-3xl font-black tracking-tight text-neutral-950">Últimas do Portal</h2>
              </div>
              <Link href="/noticias" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-[#0073B7] transition-all bg-neutral-50 px-5 py-2.5 rounded-full border border-neutral-100 hover:border-[#0073B7]/20">
                Ver Tudo <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {secundarias.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {secundarias.map((news: Noticia) => (
                  <article key={news.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_60px_rgba(0,115,183,0.1)] transform hover:-translate-y-2 transition-all duration-700 h-full relative">
                    <div className="absolute top-4 left-4 z-10">
                       <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-white shadow-sm">
                         <p className="text-[8px] font-black text-[#0073B7] uppercase tracking-widest">Notícia</p>
                       </div>
                    </div>
                    <Link href={`/noticias/${news.slug}/`} className="flex flex-col h-full">
                      <div className="aspect-[16/10] relative overflow-hidden bg-neutral-100">
                        <Image 
                          src={getMediaUrl(news.capa)} 
                          alt={news.titulo} fill className="object-cover transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1" 
                        />
                        <div className="absolute inset-0 bg-[#001529]/0 group-hover:bg-[#001529]/20 transition-all duration-700"></div>
                      </div>
                      <div className="p-8 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">
                            {new Date(news.data_publicacao).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <h4 className="text-xl font-black leading-tight text-neutral-950 group-hover:text-[#0073B7] transition-colors mb-4 line-clamp-2 tracking-tight">
                          {news.titulo}
                        </h4>
                        <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3 mt-auto font-medium opacity-85 group-hover:opacity-100 transition-opacity">
                          {he.decode(news.conteudo.replace(/<[^>]*>?/gm, ''))}
                        </p>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400 italic py-10 text-center bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200">Não há outras publicações recentes.</p>
            )}
          </section>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4 flex flex-col gap-10">
            
            {/* Widget: Editais */}
            <div className="flex flex-col bg-[#001529] text-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_40px_80px_-20px_rgba(0,21,41,0.4)] relative overflow-hidden border border-white/10 group/ed">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#8CC63F]/10 blur-[100px] pointer-events-none rounded-full group-hover/ed:bg-[#8CC63F]/20 transition-all duration-700"></div>
              
              <div className="flex items-center justify-between mb-8 pb-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#8CC63F] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(140,198,63,0.4)]">
                    <FileText size={20} className="text-[#001529]" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Chamadas</h3>
                    <p className="text-xs font-black text-white uppercase tracking-tight">Editais Abertos</p>
                  </div>
                </div>
                {editalDestaque && (
                  <span className="bg-[#8CC63F] text-neutral-950 text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(140,198,63,0.5)] animate-pulse">Ativo</span>
                )}
              </div>
              
              {editalDestaque ? (
                <div className="flex flex-col gap-4 mb-8">
                  <Link 
                    href={`/editais/${editalDestaque.slug}/`}
                    className="group/item flex gap-5 items-center p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#8CC63F]/30 hover:bg-white/10 transition-all duration-500 transform hover:scale-[1.03] shadow-xl"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-[#8CC63F]/10 rounded-2xl flex flex-col items-center justify-center font-black text-[10px] text-[#8CC63F] border border-[#8CC63F]/20 shadow-2xl">
                      <FileText size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-white leading-snug line-clamp-2 tracking-tight group-hover/item:text-[#8CC63F] transition-colors">{editalDestaque.titulo}</h4>
                      <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-2">Publicado em {new Date(editalDestaque.data_publicacao).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="mb-8 py-10 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-[10px] text-neutral-600 font-bold uppercase tracking-widest">Sem editais recentes</div>
              )}
              
              <Link href="/editais/" className="w-full bg-white text-neutral-950 py-5 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-[#8CC63F] transition-all duration-300 rounded-2xl shadow-2xl text-center flex items-center justify-center gap-3 group-hover/ed:gap-5">
                Ver Repositório <ChevronRight size={16} />
              </Link>
            </div>

            {/* Agenda */}
            <EventsCarousel initialEventos={eventos} />

          </aside>
        </div>

        {/* RÁDIO UNIVERSITÁRIA */}
        <RadioPlayer />

        <QuickAccess />

      </div>
    </main>
  );
}
