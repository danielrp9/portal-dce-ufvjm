import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Noticia } from '@/types';
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
            className="group flex flex-col bg-white border border-black/5 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            <Link href={`/noticias/${item.slug}`} className="flex flex-col h-full">
              
              {/* Imagem de Capa do Card */}
              <div className="aspect-video relative overflow-hidden bg-slate-100 border-b border-black/5">
                {item.capa ? (
                  <Image 
                    src={item.capa.startsWith('http') ? item.capa : `http://127.0.0.1:8000${item.capa}`} 
                    alt={item.titulo} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-103" 
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center font-sans text-[10px] text-slate-400">
                    Sem Imagem
                  </div>
                )}
              </div>

              {/* Conteúdo Textual Protegido contra Vazamentos */}
              <div className="p-5 flex flex-col flex-1">
                <span className="text-[9px] font-black text-[#0073B7] uppercase tracking-widest font-sans mb-2 block">
                  {new Date(item.data_publicacao).toLocaleDateString('pt-BR')}
                </span>
                
                <h4 className="text-base font-bold leading-tight text-slate-900 group-hover:text-[#0073B7] transition-colors mb-2 line-clamp-2 font-serif">
                  {item.titulo}
                </h4>
                
                <p className="text-xs text-slate-500 leading-relaxed font-sans line-clamp-2 mt-auto">
                  {formatSummary(item.conteudo)}
                </p>
              </div>

            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}