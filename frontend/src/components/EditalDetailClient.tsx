"use client";

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { Edital, DocumentoEdital } from '@/types';
import Link from 'next/link';
import PrintButton from '@/components/PrintButton';
import { 
  FileText, 
  ExternalLink, 
  ChevronRight, 
  Download, 
  Clock, 
  Info,
  Building2
} from 'lucide-react';
import { getMediaUrl } from '@/utils/urls';

interface EditalDetailClientProps {
  slug: string;
}

export default function EditalDetailClient({ slug }: EditalDetailClientProps) {
  const [edital, setEdital] = useState<Edital | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let realSlug = slug;
    
    if ((!realSlug || realSlug === 'detalhe' || realSlug === 'fallback') && typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      if (pathParts[0] === 'editais' && pathParts[1]) {
        realSlug = pathParts[1];
      }
    }

    if (!realSlug || realSlug === 'detalhe' || realSlug === 'fallback') {
      setLoading(false);
      return;
    }

    async function fetchDetail() {
      try {
        const res = await api.get<Edital>(`editais/${realSlug}/`);
        setEdital(res.data);
      } catch (error) {
        console.error("Erro ao buscar conteúdo dinâmico do edital:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex flex-col gap-4 items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-[#8CC63F] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400">Processando Edital...</span>
      </div>
    );
  }

  if (!edital) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center font-sans gap-4">
        <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Edital não localizado</p>
        <Link href="/editais/" className="px-6 py-3 bg-neutral-950 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg">
          Voltar para Editais
        </Link>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `http://dce.ufvjm.edu.br/editais/${edital.slug}/`;
  const shareText = encodeURIComponent(`Processo Seletivo DCE: ${edital.titulo}`);

  return (
    <main className="min-h-screen bg-[#F0F2F5] text-neutral-900 selection:bg-[#0073B7] selection:text-white font-sans antialiased pb-32">
      
      {/* Breadcrumb */}
      <div className="w-full border-b border-neutral-200/60 mb-12 bg-white/60 backdrop-blur-md sticky top-0 z-30 print:hidden">
        <div className="max-w-[1440px] mx-auto px-6 py-5">
          <nav className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">
            <Link href="/" className="hover:text-[#0073B7] transition-colors">Início</Link>
            <span className="text-neutral-300">/</span>
            <Link href="/editais/" className="hover:text-[#0073B7] transition-colors">Editais</Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-950 truncate max-w-[200px]">
              {edital.titulo}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header do Edital */}
        <header className="mb-12 border-b border-neutral-200 pb-10 flex flex-col items-center text-center w-full">
          <div className="flex items-center gap-3 mb-6 select-none">
            <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
              edital.ativo 
                ? 'bg-[#8CC63F]/10 text-[#8CC63F] border-[#8CC63F]/20 shadow-[0_4px_12px_rgba(140,198,63,0.1)]' 
                : 'bg-neutral-100 text-neutral-400 border-neutral-200'
            }`}>
              {edital.ativo ? 'Processo em Aberto' : 'Processo Encerrado'}
            </div>
            <div className="px-4 py-1.5 rounded-full bg-[#0073B7]/5 text-[#0073B7] text-[8px] font-black uppercase tracking-widest border border-[#0073B7]/10 flex items-center gap-2">
              <Building2 size={10} />
              {edital.campus_display || 'Geral'}
            </div>
          </div>

          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-neutral-950 mb-6 max-w-3xl leading-snug">
            {edital.titulo}
          </h1>

          <div className="flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">
            <span className="flex items-center gap-2">
              <Clock size={12} className="text-[#8CC63F]" />
              Publicado em {new Date(edital.data_publicacao).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </header>

        {/* Conteúdo Fluido */}
        <div className="space-y-16">
          
          {/* Seção: Descrição / Informações Gerais */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-6 h-[2px] bg-[#0073B7] rounded-full"></div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0073B7]">
                Informações do Processo
              </h2>
            </div>
            
            <div 
              className="prose prose-neutral max-w-none text-neutral-800 text-sm md:text-base leading-relaxed text-justify font-sans"
              dangerouslySetInnerHTML={{ __html: edital.descricao }} 
            />
          </section>

          {/* Seção: Documentos e Atualizações (Lista Fluida) */}
          <section className="pt-12 border-t border-neutral-200">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-6 h-[2px] bg-[#8CC63F] rounded-full"></div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8CC63F]">
                Documentação e Atualizações
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              {edital.documentos && edital.documentos.length > 0 ? (
                edital.documentos.map((doc: DocumentoEdital) => (
                  <div 
                    key={doc.id}
                    className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/60 backdrop-blur-sm rounded-[2rem] border border-neutral-100 hover:border-[#0073B7] hover:shadow-[0_15px_30px_rgba(0,115,183,0.05)] transition-all duration-500"
                  >
                    <div className="flex items-center gap-5 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-400 group-hover:bg-[#0073B7]/5 group-hover:text-[#0073B7] transition-all flex-shrink-0">
                        {doc.arquivo ? <FileText size={20} /> : <ExternalLink size={20} />}
                      </div>
                      <div className="truncate">
                        <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-1 block">
                          Publicado em {new Date(doc.data_publicacao).toLocaleDateString('pt-BR')}
                        </span>
                        <h4 className="text-sm font-black text-neutral-900 group-hover:text-[#0073B7] transition-colors leading-tight uppercase tracking-tight truncate">
                          {doc.titulo}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4 md:mt-0 md:ml-6">
                      {doc.arquivo && (
                        <a 
                          href={getMediaUrl(doc.arquivo)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-950 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#0073B7] transition-all shadow-md group/btn"
                        >
                          <Download size={12} className="group-hover/btn:translate-y-0.5 transition-transform" />
                          PDF
                        </a>
                      )}
                      {doc.link && (
                        <a 
                          href={doc.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-neutral-950 text-neutral-950 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-neutral-950 hover:text-white transition-all"
                        >
                          <ExternalLink size={12} />
                          Link
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center bg-white/40 rounded-[2.5rem] border border-dashed border-neutral-200">
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Aguardando publicação de documentos.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Rodapé de Ferramentas */}
        <footer className="mt-20 pt-10 border-t border-neutral-200 flex justify-between items-center print:hidden">
          <Link 
            href="/editais/" 
            className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-neutral-400 hover:text-[#0073B7] transition-all"
          >
            <ChevronRight size={14} className="rotate-180" /> Voltar ao Acervo
          </Link>
          <div className="flex items-center gap-3">
            <PrintButton />
            <a 
              href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 bg-white text-neutral-950 border border-neutral-200 rounded-2xl hover:bg-neutral-950 hover:text-white transition-all shadow-sm active:scale-95"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412 0 12.048c0 2.12.554 4.189 1.605 6.04L0 24l6.104-1.602a11.803 11.803 0 005.94 1.603h.005c6.634 0 12.043-5.412 12.048-12.049a11.815 11.815 0 00-3.535-8.508z" />
              </svg>
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
