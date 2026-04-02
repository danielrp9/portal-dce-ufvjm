import React from 'react';
import api from '@/services/api';
import { Noticia, ResumoFinanceiro, Evento } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

async function getHomeData() {
  try {
    const [newsRes, financeRes, eventsRes] = await Promise.all([
      api.get<Noticia[]>('noticias/'),
      api.get<ResumoFinanceiro>('financeiro/resumo/'),
      api.get<Evento[]>('eventos/')
    ]);
    const listaEventos = Array.isArray(eventsRes.data) ? eventsRes.data : (eventsRes.data as any).results || [];
    return { 
      noticias: Array.isArray(newsRes.data) ? newsRes.data : (newsRes.data as any).results || [], 
      financeiro: financeRes.data,
      eventoDestaque: listaEventos[0] || null 
    };
  } catch (e) {
    return { noticias: [], financeiro: { total_entrada: 0, total_saida: 0, saldo: 0, status: 'AZUL' }, eventoDestaque: null };
  }
}

export default async function HomePage() {
  const { noticias, financeiro, eventoDestaque } = await getHomeData();
  const principal = noticias[0];
  const secundarias = noticias.slice(1, 4);

  return (
    <main className="min-h-screen bg-white text-gray-900 pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
          
          {/* COLUNA PRINCIPAL - ESTILO IRISH TIMES */}
          <div className="xl:col-span-8">
            {principal && (
              <article className="group border-b border-gray-100 pb-12 mb-12">
                <Link href={`/noticias/${principal.slug}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                      <Image 
                        src={principal.capa.startsWith('http') ? principal.capa : `http://127.0.0.1:8000${principal.capa}`}
                        alt={principal.titulo} fill className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#0073B7] tracking-widest mb-3 block">Destaque Estudantil</span>
                      <h2 className="text-3xl font-bold leading-tight mb-4 group-hover:underline decoration-[#0073B7]">
                        {principal.titulo}
                      </h2>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-4 font-light">
                        {principal.conteudo.replace(/<[^>]*>?/gm, '').substring(0, 250)}...
                      </p>
                      <span className="text-[10px] text-gray-400 mt-6 block font-medium uppercase tracking-widest">
                        Por {principal.autor} • {new Date(principal.data_publicacao).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            )}

            {/* Grid de Secundárias logo abaixo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {secundarias.map((news) => (
                <Link key={news.id} href={`/noticias/${news.slug}`} className="group">
                  <div className="relative aspect-video bg-gray-50 mb-4 overflow-hidden">
                    <Image src={news.capa.startsWith('http') ? news.capa : `http://127.0.0.1:8000${news.capa}`} alt={news.titulo} fill className="object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-sm font-bold leading-snug group-hover:text-[#0073B7] transition-colors uppercase tracking-tight">
                    {news.titulo}
                  </h3>
                </Link>
              ))}
            </div>
          </div>

          {/* SIDEBAR - LIMPA E TIPOGRÁFICA */}
          <aside className="xl:col-span-4 space-y-12 border-l border-gray-100 pl-8">
            
            {/* Bloco Financeiro - Simplificado */}
            <section>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 border-b border-black pb-1">Transparência</h4>
              <div className="py-4">
                <span className="text-[9px] text-gray-400 uppercase font-bold">Saldo Atual</span>
                <div className="text-4xl font-light tracking-tighter text-gray-900 mt-1">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(financeiro.saldo || 0))}
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500">
                    <span>Entradas</span>
                    <span className="text-[#8CC63F]">+ {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(financeiro.total_entrada || 0))}</span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500">
                    <span>Saídas</span>
                    <span className="text-red-500">- {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(financeiro.total_saida || 0))}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Evento - Estilo 'Próximo na Agenda' */}
            <section className="bg-gray-50 p-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0073B7] mb-6">Próximo Evento</h4>
              {eventoDestaque ? (
                <div className="space-y-4">
                  <h5 className="text-lg font-bold leading-tight">{eventoDestaque.titulo}</h5>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {eventoDestaque.local} • {new Date(eventoDestaque.data_hora).toLocaleDateString('pt-BR')}
                  </p>
                  <Link href="/eventos" className="inline-block text-[9px] font-black uppercase border-b border-black pb-0.5 hover:text-[#0073B7] hover:border-[#0073B7] transition-all">
                    Ver detalhes →
                  </Link>
                </div>
              ) : (
                <p className="text-xs italic text-gray-400">Sem eventos agendados.</p>
              )}
            </section>

            {/* Links Rápidos - Minimalismo Extremo */}
            <section>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 border-b border-gray-100 pb-1">Documentos</h4>
              <nav className="flex flex-col gap-4">
                {['Estatuto do DCE', 'Editais em Aberto', 'Transparência', 'Carteirinha'].map((item) => (
                  <Link key={item} href="#" className="text-[11px] font-bold text-gray-600 hover:text-black flex justify-between items-center group">
                    {item.toUpperCase()}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                ))}
              </nav>
            </section>
          </aside>

        </div>
      </div>
    </main>
  );
}