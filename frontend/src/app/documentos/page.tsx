import React from 'react';
import api from '@/services/api';
import Link from 'next/link';
import { Documento } from '@/types';

interface PaginatedDocs {
  count: number;
  results: Documento[];
}

async function getDocumentosData() {
  try {
    const res = await api.get<PaginatedDocs>(`documentos/`);
    const todos = res.data.results || [];
    
    return {
      institucionais: todos.filter(d => d.tipo !== 'EDITAL'),
      editais: todos.filter(d => d.tipo === 'EDITAL')
    };
  } catch (error) {
    console.error("Erro ao carregar documentos:", error);
    return { institucionais: [], editais: [] };
  }
}

export default async function DocumentosPage() {
  const { institucionais, editais } = await getDocumentosData();

  return (
    <main className="min-h-screen bg-[#FDFDFB] pb-32 selection:bg-black selection:text-white font-serif">
      
      {/* 1. BREADCRUMB EDITORIAL SUTIL */}
      <div className="w-full border-b border-black/5 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 font-sans">
            <Link href="/" className="hover:text-black transition-colors">Início</Link>
            <span>/</span>
            <span className="text-black font-bold">Repositório Digital</span>
          </nav>
        </div>
      </div>

      {/* TÍTULO DA PÁGINA - REFORMULADO (SUTIL E ELEGANTE) */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="border-b border-black pb-4">
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black leading-none">
            Arquivo <span className="text-[#0073B7]">Central</span>
          </h1>
          <p className="mt-1 text-[10px] font-sans uppercase tracking-[0.3em] text-slate-400 font-bold">
            Documentação Institucional e Editais de Convocação
          </p>
        </div>
      </section>

      {/* 2. ARQUIVOS BASE (GRID EDITORIAL) */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="flex items-center gap-4 mb-10">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black font-sans italic">
            01. Institucional
          </h3>
          <div className="flex-1 h-px bg-black/10"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10 border border-black/10">
          {institucionais.length > 0 ? institucionais.map((doc) => (
            <a 
              key={doc.id}
              href={doc.arquivo.startsWith('http') ? doc.arquivo : `http://127.0.0.1:8000${doc.arquivo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#FDFDFB] p-10 hover:bg-[#F9F9F7] transition-all flex flex-col justify-between min-h-[260px]"
            >
              <div>
                <span className="text-[9px] font-bold text-[#0073B7] uppercase tracking-[0.2em] font-sans block mb-6">
                  [{doc.tipo}]
                </span>
                <h3 className="text-xl font-bold leading-tight text-slate-900 group-hover:text-[#0073B7] transition-colors">
                  {doc.titulo}
                </h3>
              </div>
              
              <div className="flex items-center justify-between mt-8 border-t border-black/5 pt-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-black font-sans">
                  Abrir Documento
                </span>
                <span className="text-xl transform group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </a>
          )) : (
            <p className="bg-[#FDFDFB] p-10 text-xs italic text-slate-400 font-sans">Nenhum documento listado.</p>
          )}
        </div>
      </section>

      {/* 3. LISTAGEM DE EDITAIS (ESTILO TABELA DE JORNAL) */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-10">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black font-sans italic">
            02. Editais Ativos
          </h3>
          <div className="flex-1 h-px bg-black/10"></div>
        </div>

        <div className="border-t-2 border-black">
          {editais.length > 0 ? (
            <div className="divide-y divide-black/5">
              {editais.map((doc) => (
                <div key={doc.id} className="group flex flex-col md:flex-row md:items-center justify-between py-10 hover:bg-[#F9F9F7] px-4 transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-1.5 h-1.5 bg-[#0073B7] rounded-full"></span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                        Publicado em {new Date(doc.data_upload).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 group-hover:text-[#0073B7] transition-colors leading-tight">
                      {doc.titulo}
                    </h3>
                  </div>
                  
                  <div className="mt-8 md:mt-0 md:ml-12">
                    <a 
                      href={doc.arquivo.startsWith('http') ? doc.arquivo : `http://127.0.0.1:8000${doc.arquivo}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] bg-black text-white px-8 py-3 hover:bg-[#0073B7] transition-all font-sans"
                    >
                      Download PDF
                      <span className="text-lg">↓</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-slate-300 font-bold text-base uppercase tracking-[0.2em] font-sans italic opacity-50">
                Sem editais publicados no período.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER DA PÁGINA */}
      <footer className="mt-40 text-center py-20 border-t border-black/5">
         <p className="text-[10px] font-bold uppercase tracking-[1em] text-slate-200 select-none font-sans italic">
           DCE UFVJM • Repositório
         </p>
      </footer>
    </main>
  );
} 