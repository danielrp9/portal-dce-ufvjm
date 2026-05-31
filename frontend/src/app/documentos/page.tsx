"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Documento } from '@/types';
import { 
  FileText, 
  ChevronRight, 
  ExternalLink,
  ShieldCheck,
  Info,
  Loader2
} from 'lucide-react';
import { getMediaUrl } from '@/utils/urls';
import api from '@/services/api';

export default function DocumentosPage() {
  const [todos, setTodos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocumentos() {
      try {
        const res = await api.get('/documentos/');
        setTodos(res.data.results || []);
      } catch (error) {
        console.error("Erro ao buscar documentos:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDocumentos();
  }, []);

  const institucionais = todos.filter(d => d.tipo === 'INSTITUCIONAL');
  const transparencia = todos.filter(d => d.tipo === 'TRANSPARENCIA');

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F6F8] gap-4">
        <Loader2 className="w-12 h-12 text-[#0073B7] animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 animate-pulse">
          Sincronizando Repositório...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F6F8] text-neutral-900 selection:bg-[#0073B7] selection:text-white font-sans antialiased pb-32 relative overflow-hidden">
      
      {/* Elementos de Fundo - Suavizados */}
      <div className="absolute top-[-5%] left-[-5%] w-[900px] h-[900px] bg-[#0073B7]/6 blur-[180px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[1000px] h-[1000px] bg-[#8CC63F]/5 blur-[200px] rounded-full pointer-events-none -z-10"></div>

      {/* BREADCRUMB */}
      <div className="w-full bg-white/60 backdrop-blur-md border-b border-neutral-200/60 mb-12 sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-6 py-5 md:px-12 lg:px-20">
          <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            <Link href="/" className="hover:text-[#0073B7] transition-colors">Início</Link>
            <ChevronRight size={10} className="text-neutral-300" />
            <span className="text-neutral-950 font-black">Documentos Oficiais</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        
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
          <section className="bg-white rounded-[3.5rem] border border-white p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] relative overflow-hidden group/parent">
            {/* Efeito de luz interna sutil */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0073B7]/5 blur-3xl rounded-full"></div>
            
            <div className="relative z-10 flex items-center gap-5 mb-12">
              <div className="w-14 h-14 bg-[#0073B7] rounded-2xl flex items-center justify-center shadow-[0_10px_20px_rgba(0,115,183,0.2)]">
                <ShieldCheck size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-neutral-950 tracking-tight uppercase">Regimentos e Atas</h2>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-[2px] bg-[#8CC63F]"></div>
                  <p className="text-[10px] font-black text-[#0073B7] uppercase tracking-[0.2em]">Base Normativa</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {institucionais.length > 0 ? (
                institucionais.map((doc) => (
                  <a 
                    key={doc.id}
                    href={getMediaUrl(doc.arquivo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-6 bg-[#F8FAFC] rounded-3xl border border-neutral-100 hover:bg-white hover:border-[#0073B7] hover:shadow-[0_20px_40px_rgba(0,115,183,0.1)] transition-all duration-500 transform hover:-translate-y-1.5"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-neutral-100 group-hover:bg-[#0073B7] transition-all duration-500 shadow-sm">
                        <FileText size={20} className="text-[#0073B7] group-hover:text-white transition-colors" />
                      </div>
                      <h4 className="text-[11px] font-black text-neutral-900 group-hover:text-[#0073B7] transition-colors uppercase tracking-[0.05em]">{doc.titulo}</h4>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-white border border-neutral-100 flex items-center justify-center group-hover:bg-[#0073B7] group-hover:text-white group-hover:border-[#0073B7] transition-all shadow-sm">
                       <ExternalLink size={14} />
                    </div>
                  </a>
                ))
              ) : (
                <div className="p-16 border-2 border-dashed border-neutral-200 rounded-[2.5rem] text-center bg-neutral-50/50">
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Nenhum documento disponível.</p>
                </div>
              )}
            </div>
          </section>

          {/* Seção: Transparência */}
          <section className="bg-white rounded-[3.5rem] border border-white p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] relative overflow-hidden group/parent">
            {/* Efeito de luz interna sutil */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8CC63F]/5 blur-3xl rounded-full"></div>

            <div className="relative z-10 flex items-center gap-5 mb-12">
              <div className="w-14 h-14 bg-[#8CC63F] rounded-2xl flex items-center justify-center shadow-[0_10px_20px_rgba(140,198,63,0.2)]">
                <Info size={28} className="text-neutral-950" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-neutral-950 tracking-tight uppercase">Relatórios e Balanços</h2>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-[2px] bg-[#0073B7]"></div>
                  <p className="text-[10px] font-black text-[#8CC63F] uppercase tracking-[0.2em]">Transparência</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {transparencia.length > 0 ? (
                transparencia.map((doc) => (
                  <a 
                    key={doc.id}
                    href={getMediaUrl(doc.arquivo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-6 bg-[#F8FAFC] rounded-3xl border border-neutral-100 hover:bg-white hover:border-[#8CC63F] hover:shadow-[0_20px_40px_rgba(140,198,63,0.1)] transition-all duration-500 transform hover:-translate-y-1.5"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-neutral-100 group-hover:bg-[#8CC63F] transition-all duration-500 shadow-sm">
                        <FileText size={20} className="text-[#8CC63F] group-hover:text-neutral-950 transition-colors" />
                      </div>
                      <h4 className="text-[11px] font-black text-neutral-900 group-hover:text-[#8CC63F] transition-colors uppercase tracking-[0.05em]">{doc.titulo}</h4>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-white border border-neutral-100 flex items-center justify-center group-hover:bg-[#8CC63F] group-hover:text-neutral-950 group-hover:border-[#8CC63F] transition-all shadow-sm">
                       <ExternalLink size={14} />
                    </div>
                  </a>
                ))
              ) : (
                <div className="p-16 border-2 border-dashed border-neutral-200 rounded-[2.5rem] text-center bg-neutral-50/50">
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
