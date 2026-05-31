import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Noticia } from '@/types';
import { getMediaUrl } from '@/utils/urls';
import he from 'he';

interface NewsGridProps {
  noticias: any; 
}

function formatSummary(html: string) {
  if (!html) return "";
  const cleanText = html.replace(/<[^>]*>?/gm, '');
  return he.decode(cleanText);
}

export default function NewsGridUFVJM({ noticias }: NewsGridProps) {
  const listaNoticias: Noticia[] = Array.isArray(noticias) ? noticias : (noticias?.results || []);

  // Filtra as notícias secundárias (da segunda até a quarta) para a listagem inferior
  const secundarias = listaNoticias.slice(1, 4);

  if (secundarias.length === 0) return null;

  return (
    <div className="w-full">
      {/* Título editorial sutil */}
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] font-sans text-slate-400 mb-6">
        Outras Publicações Recentes
      </h3>

      {/* Grid horizontal uniforme de 3 colunas, posicionando-se abaixo de tudo de forma correta */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {secundarias.map((item: Noticia) => (
          <article 
            key={item.id} 
            className="group flex flex-col bg-white border border-neutral-200/60 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(0,115,183,0.1)] transition-all duration-500"
          >
            <Link href={`/noticias/${item.slug}`} className="flex flex-col h-full">
              
              {/* Imagem de Capa do Card */}
              <div className="aspect-video relative overflow-hidden bg-neutral-100">
                {item.capa ? (
                  <Image 
                    src={getMediaUrl(item.capa)} 
                    alt={item.titulo} 
                    fill 
                    className="object-cover transition-all duration-1000 ease-out group-hover:scale-105" 
                  />

                ) : (
                  <div className="w-full h-full bg-neutral-100 flex items-center justify-center font-sans text-[10px] text-neutral-400">
                    SEM IMAGEM
                  </div>
                )}
                {/* Overlay de gradiente sutil na imagem */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Conteúdo Textual */}
              <div className="p-7 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-6 h-[2px] bg-[#8CC63F]"></span>
                  <span className="text-[9px] font-black text-[#0073B7] uppercase tracking-[0.2em] font-sans">
                    {new Date(item.data_publicacao).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                
                <h4 className="text-xl font-black leading-tight text-neutral-950 group-hover:text-[#0073B7] transition-colors mb-4 line-clamp-2 uppercase tracking-tight">
                  {item.titulo}
                </h4>
                
                <p className="text-sm text-neutral-500 leading-relaxed font-medium line-clamp-2 mt-auto">
                  {formatSummary(item.conteudo)}
                </p>

                <div className="mt-6 pt-6 border-t border-neutral-100 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#0073B7]">Ler Notícia</span>
                  <div className="w-8 h-8 rounded-full bg-[#0073B7]/5 flex items-center justify-center text-[#0073B7]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>

            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}