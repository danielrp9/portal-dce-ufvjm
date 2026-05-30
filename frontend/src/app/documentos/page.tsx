import React from 'react';
import Link from 'next/link';
import { Documento } from '@/types';
import { 
  FileText, 
  ChevronRight, 
  ExternalLink,
  ShieldCheck,
  Info
} from 'lucide-react';
import { getMediaUrl } from '@/utils/urls';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

async function getDocumentos(): Promise<Documento[]> {
  try {
    const res = await fetch(`${API_URL}/api/documentos/`, {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) throw new Error('Falha ao buscar documentos');
    
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Erro ao buscar documentos no servidor:", error);
    return [];
  }
}

export default async function DocumentosPage() {
  const todos = await getDocumentos();
  const institucionais = todos.filter(d => d.tipo === 'INSTITUCIONAL');
  const transparencia = todos.filter(d => d.tipo === 'TRANSPARENCIA');

  return (
    <main className="min-h-screen bg-[#F0F2F5] text-neutral-900 selection:bg-[#0073B7] selection:text-white font-sans antialiased pb-32 relative overflow-hidden">
      
      {/* Elementos de Fundo */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#0073B7]/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-[#8CC63F]/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>

      {/* BREADCRUMB */}
      <div className="w-full bg-white/60 backdrop-blur-md border-b border-neutral-200/60 mb-12 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            <Link href="/" className="hover:text-[#0073B7] transition-colors">Início</Link>
            <ChevronRight size={10} className="text-neutral-300" />
            <span className="text-neutral-900 font-black">Documentos Oficiais</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Ultra-Compacto e Legível: Documentos */}
        <div className="mb-10 relative">
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#0073B7]/5 blur-[50px] rounded-full pointer-events-none"></div>
          
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-neutral-200/60 pb-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-1 select-none">
                <div className="w-6 h-[2px] bg-[#0073B7] rounded-full"></div>
                <h3 className="text-[8px] font-black uppercase tracking-[0.3em] text-[#0073B7]">
                  Repositório Oficial
                </h3>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-neutral-950 uppercase">
                Documentos Institucionais
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Seção: Base Normativa */}
          <section className="bg-white/40 backdrop-blur-md p-10 rounded-[3.5rem] border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-[#0073B7]/5 rounded-[1.2rem] flex items-center justify-center border border-[#0073B7]/10">
                <ShieldCheck size={24} className="text-[#0073B7]" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-neutral-950 tracking-tight">Regimentos e Atas</h2>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Base Normativa</p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {institucionais.length > 0 ? (
                institucionais.map((doc) => (
                  <a 
                    key={doc.id}
                    href={getMediaUrl(doc.arquivo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-6 bg-white rounded-3xl border border-neutral-100 hover:border-[#0073B7] hover:shadow-[0_20px_40px_rgba(0,115,183,0.06)] transition-all duration-500 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center border border-neutral-100 group-hover:bg-[#0073B7]/5 transition-colors duration-500">
                        <FileText size={20} className="text-neutral-400 group-hover:text-[#0073B7] transition-colors" />
                      </div>
                      <h4 className="text-sm font-black text-neutral-900 group-hover:text-[#0073B7] transition-colors uppercase tracking-tight">{doc.titulo}</h4>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-[#0073B7] group-hover:text-white transition-all">
                       <ExternalLink size={12} />
                    </div>
                  </a>
                ))
              ) : (
                <div className="p-16 border-2 border-dashed border-neutral-200 rounded-[2.5rem] text-center bg-neutral-50/30">
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Nenhum documento disponível.</p>
                </div>
              )}
            </div>
          </section>

          {/* Seção: Transparência */}
          <section className="bg-white/40 backdrop-blur-md p-10 rounded-[3.5rem] border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-[#8CC63F]/5 rounded-[1.2rem] flex items-center justify-center border border-[#8CC63F]/10">
                <Info size={24} className="text-[#8CC63F]" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-neutral-950 tracking-tight">Relatórios e Balanços</h2>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Transparência</p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {transparencia.length > 0 ? (
                transparencia.map((doc) => (
                  <a 
                    key={doc.id}
                    href={getMediaUrl(doc.arquivo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-6 bg-white rounded-3xl border border-neutral-100 hover:border-[#8CC63F] hover:shadow-[0_20px_40px_rgba(140,198,63,0.06)] transition-all duration-500 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center border border-neutral-100 group-hover:bg-[#8CC63F]/5 transition-colors duration-500">
                        <FileText size={20} className="text-neutral-400 group-hover:text-[#8CC63F] transition-colors" />
                      </div>
                      <h4 className="text-sm font-black text-neutral-900 group-hover:text-[#8CC63F] transition-colors uppercase tracking-tight">{doc.titulo}</h4>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-[#8CC63F] group-hover:text-neutral-950 transition-all">
                       <ExternalLink size={12} />
                    </div>
                  </a>
                ))
              ) : (
                <div className="p-16 border-2 border-dashed border-neutral-200 rounded-[2.5rem] text-center bg-neutral-50/30">
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Nenhum relatório disponível.</p>
                </div>
              )}
            </div>
          </section>

        </div>

      </div>
    </main>
  );
}
