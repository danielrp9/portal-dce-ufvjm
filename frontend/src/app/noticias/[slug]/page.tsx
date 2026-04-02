import React from 'react';
import api from '@/services/api';
import { Noticia } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

// Importação segura por caminho relativo
import PrintButton from '../../../components/PrintButton'; 

export const dynamic = 'force-dynamic';

async function getNoticiaDetail(slug: string) {
  try {
    const res = await api.get<Noticia>(`noticias/${slug}/`);
    return res.data;
  } catch (e) {
    return null;
  }
}

export default async function NoticiaDetailPage(props: { 
  params: Promise<{ slug: string }> 
}) {
  const resolvedParams = await props.params;
  
  if (!resolvedParams?.slug) {
    return null;
  }

  const noticia = await getNoticiaDetail(resolvedParams.slug);

  if (!noticia) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-20 text-center">
        <h1 className="text-xl font-black text-slate-200 mb-8 uppercase tracking-[0.3em]">Conteúdo Não Localizado</h1>
        <Link href="/noticias" className="px-8 py-3 bg-[#0073B7] text-white text-[10px] font-black uppercase tracking-widest rounded-sm">
          Voltar
        </Link>
      </div>
    );
  }

  const shareUrl = `http://dce.ufvjm.edu.br/noticias/${noticia.slug}`;
  const shareText = encodeURIComponent(`Confira esta notícia no Portal do DCE: ${noticia.titulo}`);

  return (
    <main className="min-h-screen bg-white pb-32 selection:bg-[#0073B7]/10 print:pb-0 print:bg-white">
      
      {/* 1. BREADCRUMB */}
      <div className="w-full bg-white border-b border-gray-100 print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-slate-400">
            <Link href="/" className="hover:text-[#0073B7] transition-colors">Início</Link>
            <span>/</span>
            <Link href="/noticias" className="text-[#0073B7] font-black">Notícias</Link>
            <div className="h-3 w-px bg-slate-200 mx-2"></div>
            <span className="text-slate-300 font-medium uppercase truncate max-w-[200px]">
              {noticia.titulo}
            </span>
          </nav>
        </div>
      </div>

      {/* HEADER EXCLUSIVO PARA IMPRESSÃO PDF */}
      <div className="hidden print:block border-b-4 border-slate-950 pb-6 mb-10 max-w-4xl mx-auto">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter italic text-slate-950">Portal do <span className="text-[#0073B7]">DCE</span></h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Diretório Central dos Estudantes • UFVJM</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-950">{new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </div>

      <article className="w-full">
        {/* 2. HEADER DA MATÉRIA */}
        <header className="max-w-4xl mx-auto px-6 pt-16 md:pt-24 pb-12 print:pt-0 print:pb-8">
          <div className="flex flex-wrap items-center gap-4 mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 print:text-black">
            <span className="text-[#0073B7] border-b-2 border-[#0073B7] pb-0.5 print:border-black print:text-black">Informativo Oficial</span>
            <span className="w-px h-3 bg-slate-200 print:bg-slate-300"></span>
            <span className="text-slate-900 font-black">Por {noticia.autor}</span>
            <span className="hidden md:block w-px h-3 bg-slate-200 print:bg-slate-300"></span>
            <span>{new Date(noticia.data_publicacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tighter text-slate-900 uppercase italic print:not-italic print:text-3xl print:leading-tight">
            {noticia.titulo}
          </h1>
        </header>

        {/* 3. IMAGEM DE CAPA */}
        {noticia.capa && (
          <div className="max-w-4xl mx-auto px-6 mb-16 print:mb-10 print:break-inside-avoid">
            <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden shadow-lg border border-slate-100 print:shadow-none print:border-slate-200">
              <Image
                src={noticia.capa.startsWith('http') ? noticia.capa : `http://127.0.0.1:8000${noticia.capa}`}
                alt={noticia.titulo}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* 4. CONTEÚDO */}
        <div className="max-w-4xl mx-auto px-6">
          <div 
            className="prose prose-slate prose-lg md:prose-xl max-w-none text-slate-800 leading-[1.9] font-normal 
            [&>p]:mb-12 [&>h2]:text-2xl [&>h2]:font-black [&>h2]:uppercase [&>h2]:tracking-tighter [&>h2]:text-slate-900 [&>h2]:mb-6 [&>h2]:mt-16 
            print:text-black print:text-sm print:leading-relaxed print:text-justify"
            dangerouslySetInnerHTML={{ __html: noticia.conteudo }} 
          />

          <div className="hidden print:block mt-20 pt-10 border-t border-slate-100 text-[9px] font-black uppercase text-slate-900 break-all">
            Link original: {shareUrl}
          </div>

          {/* 5. RODAPÉ DE FERRAMENTAS - COMPLETO E ESTILIZADO */}
          <footer className="mt-32 pt-16 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-12 print:hidden">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-slate-950 flex items-center justify-center text-[10px] font-black text-white italic shadow-lg shadow-slate-200">
                {noticia.autor.substring(0,2).toUpperCase()}
              </div>
              <div className="space-y-0.5">
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Publicado por</p>
                <p className="text-[11px] font-black text-slate-950 uppercase tracking-tight">Comunicação DCE UFVJM</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4">
              
              {/* BLOCO DE AÇÕES (Imprimir + Social + Voltar) */}
              <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                
                {/* BOTÃO DE IMPRESSÃO (Estilizado como os sociais) */}
                <PrintButton />

                {/* WHATSAPP */}
                <a 
                  href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-green-50 text-green-600 hover:bg-[#25D366] hover:text-white transition-all rounded-sm border border-green-100 shadow-sm flex items-center justify-center"
                  title="Compartilhar no WhatsApp"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412 0 12.048c0 2.12.554 4.189 1.605 6.04L0 24l6.104-1.602a11.803 11.803 0 005.94 1.603h.005c6.634 0 12.043-5.412 12.048-12.049a11.815 11.815 0 00-3.535-8.508z" />
                  </svg>
                </a>
                
                {/* FACEBOOK */}
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-50 text-blue-600 hover:bg-[#1877F2] hover:text-white transition-all rounded-sm border border-blue-100 shadow-sm flex items-center justify-center"
                  title="Compartilhar no Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* VOLTAR */}
                <Link 
                  href="/noticias" 
                  className="ml-2 px-6 py-3 bg-[#0073B7] text-white text-[9px] font-black uppercase tracking-widest rounded-sm hover:bg-slate-950 transition-all shadow-lg shadow-blue-100"
                >
                  Voltar
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </article>

      <footer className="mt-40 text-center print:mt-10">
         <p className="text-[9px] font-black uppercase tracking-[1em] text-slate-200 italic print:text-black print:opacity-30">
           UFVJM • 2026
         </p>
      </footer>
    </main>
  );
}