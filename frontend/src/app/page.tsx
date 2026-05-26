import React from 'react';
import api from '@/services/api';
import { Noticia, Evento, Documento } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import he from 'he';
import EventCard from '@/components/EventCard';

// Interface interna para mapear o formato de paginação padrão do Django REST Framework
interface DjangoPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

async function getHomeData() {
  try {
    // Fazemos a chamada tipando como 'any' temporariamente para extrair os dados com segurança, 
    // já que o Django pode retornar a lista pura ou o objeto paginado.
    const [newsRes, eventsRes, docsRes] = await Promise.all([
      api.get<DjangoPaginatedResponse<Noticia> | Noticia[]>('noticias/'),
      api.get<DjangoPaginatedResponse<Evento> | Evento[]>('eventos/'),
      api.get<DjangoPaginatedResponse<Documento> | Documento[]>('documentos/')
    ]);

    // Tratamento seguro para extrair o array de resultados, seja ele paginado ou lista pura
    const listaNoticias = Array.isArray(newsRes.data) 
      ? newsRes.data 
      : (newsRes.data && 'results' in newsRes.data ? newsRes.data.results : []);

    const listaEventos = Array.isArray(eventsRes.data) 
      ? eventsRes.data 
      : (eventsRes.data && 'results' in eventsRes.data ? eventsRes.data.results : []);

    const listaDocs = Array.isArray(docsRes.data) 
      ? docsRes.data 
      : (docsRes.data && 'results' in docsRes.data ? docsRes.data.results : []);

    // Filtra o edital mais recente entre os documentos
    const editalDestaque = listaDocs.find((doc: Documento) => doc.tipo === 'EDITAL') || null;

    return { 
      noticias: listaNoticias as Noticia[], 
      eventoDestaque: listaEventos[0] || null,
      editalDestaque 
    };
  } catch (e) {
    console.error("Erro na API:", e);
    return { noticias: [], eventoDestaque: null, editalDestaque: null };
  }
}

export default async function HomePage() {
  const { noticias, eventoDestaque, editalDestaque } = await getHomeData();
  const principal = noticias[0];
  const secundarias = noticias.slice(1, 4);

  return (
    <main className="min-h-screen bg-[#FDFDFB] text-slate-900 selection:bg-black selection:text-white font-serif">
      
      {/* SEÇÃO PRINCIPAL - MANCHETE */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-black/5">
        
        {/* Lado Esquerdo: Notícia Principal */}
        <div className="lg:col-span-8">
          {principal && (
            <article className="group cursor-pointer">
              <Link href={`/noticias/${principal.slug}`}>
                <div className="relative aspect-[16/9] mb-8 overflow-hidden border border-black/5">
                  <Image 
                    src={principal.capa.startsWith('http') ? principal.capa : `http://127.0.0.1:8000${principal.capa}`}
                    alt={principal.titulo} fill className="object-cover" priority
                  />
                  <div className="absolute bottom-4 left-4 bg-black text-white text-[9px] px-3 py-1 font-bold uppercase font-sans tracking-widest">
                    Destaque Hoje
                  </div>
                </div>
                <h2 className="text-4xl md:text-6xl font-black leading-[1.1] mb-6 decoration-1 group-hover:underline transition-all">
                  {principal.titulo}
                </h2>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 mb-6 uppercase tracking-widest font-sans">
                  <span>Por {principal.autor || 'Redação DCE'}</span>
                  <span>•</span>
                  <span>{new Date(principal.data_publicacao).toLocaleDateString('pt-BR')}</span>
                </div>
                <p className="text-lg text-slate-600 leading-relaxed line-clamp-3">
                  {he.decode(principal.conteudo.replace(/<[^>]*>?/gm, '')).substring(0, 250)}...
                </p>
              </Link>
            </article>
          )}
        </div>

        {/* Lado Direito: Sidebar Funcional */}
        <aside className="lg:col-span-4 flex flex-col gap-12">
          
          {/* BOX DE EDITAIS COM DESTAQUE DE NOVIDADE (BADGE EXTERNO) */}
          <div className="relative">
            {/* NOVO SELO DE DESTAQUE (Rosa clássico, referência ao Pink Scores das imagens) */}
            <div className="absolute -top-3 -left-3 bg-[#EE86C2] text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 shadow-lg z-10 font-sans transform -rotate-3">
              Nova Publicação
            </div>

            <div className="border border-black/10 p-2 bg-[#F9F9F7]">
              <div className="border border-black/20 p-6 flex flex-col items-center text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase mb-8 tracking-[0.3em] font-sans">Editais e Documentos</span>
                
                {editalDestaque ? (
                  <div className="mb-8 w-full">
                    {/* Mantive o selo interno original, mas removi o pulse para o destaque principal ser o externo */}
                    <div className="inline-block bg-[#0073B7] text-white text-[8px] font-black px-2 py-0.5 uppercase tracking-tighter mb-4 font-sans">
                      Destaque Atual
                    </div>
                    <h3 className="text-2xl font-bold mb-3 italic leading-tight">
                      {editalDestaque.titulo}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-sans uppercase mb-4">
                      Publicado em {new Date(editalDestaque.data_upload).toLocaleDateString('pt-BR')}
                    </p>
                    
                    <Link 
                      href={editalDestaque.arquivo.startsWith('http') ? editalDestaque.arquivo : `http://127.0.0.1:8000${editalDestaque.arquivo}`}
                      target="_blank"
                      className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black hover:text-[#0073B7] transition-colors font-sans border-b border-black hover:border-[#0073B7] pb-1"
                    >
                      Baixar Arquivo <span>↓</span>
                    </Link>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 mb-8 px-4 leading-relaxed font-sans">
                    Não há editais publicados recentemente.
                  </p>
                )}

                <div className="w-full h-px bg-black/10 mb-6"></div>
                
                <Link href="/documentos" className="w-full bg-black text-white py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#0073B7] transition-all font-sans">
                  Ver Repositório de Editais
                </Link>
              </div>
            </div>
          </div>

          {/* Agenda Universitária */}
          <section className="border-t-2 border-black pt-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex justify-between items-center font-sans">
              Agenda DCE <span className="w-2 h-2 bg-red-600 rounded-full"></span>
            </h3>
            {eventoDestaque ? (
              <div className="hover:opacity-80 transition-opacity">
                <EventCard evento={eventoDestaque} />
              </div>
            ) : (
              <p className="text-[10px] italic text-slate-400 font-sans">Sem eventos próximos.</p>
            )}
          </section>
        </aside>
      </div>

      {/* SEÇÃO INFERIOR - GRID DE NOTÍCIAS SECUNDÁRIAS */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {secundarias.map((news: Noticia) => (
            <article key={news.id} className="group flex flex-col">
              <div className="h-[2px] bg-black/5 w-full mb-8"></div>
              <Link href={`/noticias/${news.slug}`} className="flex flex-col gap-4">
                 <div className="aspect-video relative overflow-hidden bg-slate-100 border border-black/5">
                    <Image 
                      src={news.capa.startsWith('http') ? news.capa : `http://127.0.0.1:8000${news.capa}`} 
                      alt={news.titulo} fill className="object-cover" 
                    />
                 </div>
                 <span className="text-[9px] font-black text-[#0073B7] uppercase tracking-widest font-sans">
                    {new Date(news.data_publicacao).toLocaleDateString('pt-BR')}
                 </span>
                 <h4 className="text-xl font-bold leading-tight group-hover:underline transition-all">
                   {news.titulo}
                 </h4>
                 <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 font-sans">
                    {he.decode(news.conteudo.replace(/<[^>]*>?/gm, '')).substring(0, 100)}...
                 </p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}