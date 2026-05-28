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
    <main className="min-h-screen bg-[#F4F4F2] pb-32 text-neutral-900 selection:bg-neutral-950 selection:text-white font-sans antialiased">
      
      {/* 1. BREADCRUMB EDITORIAL SUTIL */}
      <div className="w-full border-b border-neutral-200/60 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400">
            <Link href="/" className="hover:text-neutral-950 transition-colors">Início</Link>
            <span>/</span>
            <span className="text-neutral-950 font-bold">Documentos</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER DA SEÇÃO */}
        <div className="mb-12 border-b border-neutral-300 pb-5">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 mb-1">
            Repositório Digital
          </h3>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-950 uppercase">
            Arquivo <span className="text-[#0073B7]">Central</span>
          </h1>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
            Documentação Institucional e Editais de Convocação
          </p>
        </div>

        {/* 2. ARQUIVOS INSTITUCIONAIS (GRID DE CARDS) */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
              01. Base Institucional
            </h3>
            <div className="flex-1 h-px bg-neutral-200"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {institucionais.length > 0 ? institucionais.map((doc) => (
              <a 
                key={doc.id}
                href={doc.arquivo.startsWith('http') ? doc.arquivo : `http://127.0.0.1:8000${doc.arquivo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white p-8 rounded-3xl border border-neutral-200/60 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[240px]"
              >
                <div>
                  <span className="text-[9px] font-bold text-[#0073B7] uppercase tracking-[0.2em] mb-4 block">
                    {doc.tipo}
                  </span>
                  <h3 className="text-xl font-bold leading-tight text-neutral-950 group-hover:text-neutral-700 transition-colors tracking-tight">
                    {doc.titulo}
                  </h3>
                </div>
                
                <div className="mt-8 pt-6 border-t border-neutral-50 flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 group-hover:text-neutral-950 transition-colors">
                    Visualizar Documento
                  </span>
                  <span className="text-lg text-neutral-300 group-hover:text-neutral-950 group-hover:translate-x-1 transition-all">→</span>
                </div>
              </a>
            )) : (
              <div className="col-span-full py-12 bg-white border border-dashed border-neutral-300 rounded-3xl flex items-center justify-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Nenhum documento listado</p>
              </div>
            )}
          </div>
        </section>

        {/* 3. LISTAGEM DE EDITAIS */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
              02. Editais de Convocação
            </h3>
            <div className="flex-1 h-px bg-neutral-200"></div>
          </div>

          <div className="bg-white border border-neutral-200/60 rounded-3xl overflow-hidden shadow-2xs">
            {editais.length > 0 ? (
              <div className="divide-y divide-neutral-100">
                {editais.map((doc) => (
                  <div key={doc.id} className="group flex flex-col md:flex-row md:items-center justify-between p-8 md:p-10 hover:bg-neutral-50/30 transition-all duration-300">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="w-1.5 h-1.5 bg-[#8CC63F] rounded-full"></span>
                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                          Publicado em {new Date(doc.data_upload).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-950 group-hover:text-neutral-700 transition-colors leading-tight">
                        {doc.titulo}
                      </h3>
                    </div>
                    
                    <div className="mt-8 md:mt-0 md:ml-12">
                      <a 
                        href={doc.arquivo.startsWith('http') ? doc.arquivo : `http://127.0.0.1:8000${doc.arquivo}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest bg-neutral-950 text-white px-8 py-3.5 rounded-xl hover:bg-neutral-800 transition-all shadow-2xs"
                      >
                        Baixar PDF
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5M12 3v13.5" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center">
                 <svg className="w-6 h-6 text-neutral-200 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <p className="text-neutral-400 font-bold text-[10px] uppercase tracking-widest">
                  Sem editais publicados no período
                </p>
              </div>
            )}
          </div>
        </section>

      </div>

      <footer className="mt-40 text-center py-20 border-t border-neutral-200/60 mx-6">
         <p className="text-[10px] font-bold uppercase tracking-[0.6em] text-neutral-300 select-none">
           DCE UFVJM • Repositório
         </p>
      </footer>
    </main>
  );
}
 