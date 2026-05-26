import React from 'react';
import api from '@/services/api';
import { Noticia } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import PrintButton from '@/components/PrintButton'; 

// Força o arquivo a ser compilado de forma estática no build
export const dynamic = 'force-static';

// OBRIGATÓRIO PARA 'output: export': Garante que o Turbopack valide a árvore de arquivos estáticos
export const dynamicParams = false;

interface NoticiaDetailPageProps {
  params: Promise<{ slug: string }>;
}

interface DjangoPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Executa no build para registrar os slugs existentes
export async function generateStaticParams() {
  try {
    const res = await api.get<DjangoPaginatedResponse<Noticia> | Noticia[]>('noticias/');
    const noticias: Noticia[] = Array.isArray(res.data) 
      ? res.data 
      : (res.data && 'results' in res.data ? res.data.results : []);
    
    if (noticias.length === 0) {
      return [{ slug: 'fallback' }];
    }

    return noticias.map((noticia) => ({
      slug: noticia.slug,
    }));
  } catch (error) {
    console.error('Erro ao gerar caminhos estáticos para notícias:', error);
    return [{ slug: 'fallback' }];
  }
}

async function getNoticiaDetail(slug: string): Promise<Noticia | null> {
  if (slug === 'fallback') return null;
  try {
    const res = await api.get<Noticia>(`noticias/${slug}/`);
    return res.data;
  } catch (e) { 
    return null; 
  }
}

export default async function NoticiaDetailPage({ params }: NoticiaDetailPageProps) {
  const resolvedParams = await params;
  if (!resolvedParams?.slug) return null;

  const noticia = await getNoticiaDetail(resolvedParams.slug);
  if (!noticia) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans gap-4">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Matéria não encontrada</p>
        <Link href="/noticias" className="px-6 py-3 bg-[#0073B7] text-white text-[9px] font-black uppercase tracking-widest rounded-sm">Voltar para notícias</Link>
      </div>
    );
  }

  const shareUrl = `http://dce.ufvjm.edu.br/noticias/${noticia.slug}`;
  const shareText = encodeURIComponent(`Portal do DCE: ${noticia.titulo}`);

  return (
    <main className="min-h-screen bg-white pb-32">
      {/* 1. BREADCRUMB */}
      <div className="w-full bg-white border-b border-gray-100 print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-slate-400">
          <Link href="/" className="hover:text-[#0073B7]">Início</Link>
          <span>/</span>
          <Link href="/noticias" className="text-[#0073B7] font-black">Notícias</Link>
          <div className="h-3 w-px bg-slate-200 mx-2"></div>
          <span className="text-slate-300 font-medium truncate max-w-[200px]">{noticia.titulo}</span>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 pt-16 md:pt-24">
        <header className="mb-12">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 uppercase italic mb-8">{noticia.titulo}</h1>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase text-slate-400">
                <span className="text-[#0073B7]">Informativo Oficial</span>
                <span className="w-px h-3 bg-slate-200"></span>
                <span>Por {noticia.autor || 'Redação DCE'}</span>
            </div>
        </header>

        {noticia.capa && (
          <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-16 shadow-lg border border-slate-100">
            <Image src={noticia.capa.startsWith('http') ? noticia.capa : `http://127.0.0.1:8000${noticia.capa}`} alt={noticia.titulo} fill className="object-cover" priority />
          </div>
        )}

        <div 
          className="prose prose-slate prose-lg max-w-none text-slate-800 leading-[1.9]"
          dangerouslySetInnerHTML={{ __html: noticia.conteudo }} 
        />

        {/* --- RODAPÉ DE FERRAMENTAS --- */}
        <footer className="mt-32 pt-16 border-t border-slate-100 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center text-[10px] font-black text-white italic">
                {(noticia.autor || 'DC').substring(0,2).toUpperCase()}
            </div>
            <p className="text-[11px] font-black text-slate-950 uppercase">DCE UFVJM</p>
          </div>

          <div className="flex items-center gap-3">
            <PrintButton />

            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                <a href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`} target="_blank" className="p-3 bg-green-50 text-green-600 hover:bg-[#25D366] hover:text-white transition-all rounded-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412 0 12.048c0 2.12.554 4.189 1.605 6.04L0 24l6.104-1.602a11.803 11.803 0 005.94 1.603h.005c6.634 0 12.043-5.412 12.048-12.049a11.815 11.815 0 00-3.535-8.508z" /></svg>
                </a>
                <Link href="/noticias" className="ml-2 px-6 py-3 bg-[#0073B7] text-white text-[9px] font-black uppercase tracking-widest rounded-sm">Voltar</Link>
            </div>
          </div>
        </footer>
      </article>
    </main>
  );
}