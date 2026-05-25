import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Noticia } from '@/types';
import he from 'he'; // Importa o decodificador profissional

interface NewsGridProps {
  noticias: any; 
}

// Função para limpar HTML e decodificar acentos/entidades
function formatSummary(html: string) {
  if (!html) return "";
  
  // 1. Remove as tags HTML (como <p>, <strong>, etc)
  const cleanText = html.replace(/<[^>]*>?/gm, '');
  
  // 2. Decodifica entidades como &uacute; para ú, &atilde; para ã, etc.
  const decodedText = he.decode(cleanText);
  
  return decodedText;
}

export default function NewsGridUFVJM({ noticias }: NewsGridProps) {
  const listaNoticias: Noticia[] = Array.isArray(noticias) ? noticias : (noticias?.results || []);

  if (listaNoticias.length === 0) {
    return <p className="text-center py-10 text-gray-400 font-bold uppercase tracking-widest">Nenhuma notícia publicada.</p>;
  }

  const principal = listaNoticias[0];
  const secundarias = listaNoticias.slice(1, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Notícia Principal - Paleta UFVJM */}
      <div className="lg:col-span-2 group">
        <Link href={`/noticias/${principal.slug}`}>
          <div className="relative h-64 md:h-[480px] w-full overflow-hidden bg-gray-100 mb-6 border-b-8 border-[#8CC63F]">
            <Image 
              src={principal.capa.startsWith('http') ? principal.capa : `http://127.0.0.1:8000${principal.capa}`} 
              alt={principal.titulo}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </div>
          <h2 className="text-4xl font-black leading-tight text-gray-900 group-hover:text-[#0073B7] transition-colors uppercase italic">
            {principal.titulo}
          </h2>
          
          {/* TEXTO CORRIGIDO: Aceita qualquer acentuação agora */}
          <p className="mt-5 text-gray-700 text-lg leading-relaxed font-medium">
            {formatSummary(principal.conteudo).substring(0, 300)}...
          </p>

          <div className="mt-6 flex items-center gap-3 text-[10px] font-black uppercase text-[#0073B7] tracking-widest">
            <span>{principal.autor}</span>
            <span className="text-gray-300">|</span>
            <span>{new Date(principal.data_publicacao).toLocaleDateString('pt-BR')}</span>
          </div>
        </Link>
      </div>

      {/* Secundárias - Lateral */}
      <div className="flex flex-col gap-8 border-t-2 border-gray-100 lg:border-t-0 lg:border-l-2 lg:pl-10 pt-10 lg:pt-0">
        <h3 className="font-black text-white bg-[#0073B7] w-fit px-3 py-1 uppercase text-[10px] tracking-widest mb-4 italic">Mais lidas</h3>
        {secundarias.map((item: Noticia) => (
          <div key={item.id} className="group border-b border-gray-100 pb-6 last:border-0">
            <Link href={`/noticias/${item.slug}`}>
              <h4 className="text-xl font-bold leading-tight text-gray-900 group-hover:text-[#0073B7] transition-colors uppercase italic">
                {item.titulo}
              </h4>
              <span className="text-[10px] text-[#8CC63F] mt-3 block font-black uppercase tracking-widest">
                {new Date(item.data_publicacao).toLocaleDateString('pt-BR')}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}