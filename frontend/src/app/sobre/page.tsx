import React from 'react';
import Link from 'next/link';

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-[#FDFDFB] pb-32 selection:bg-black selection:text-white font-serif">
      
      {/* 1. BREADCRUMB EDITORIAL SUTIL */}
      <div className="w-full border-b border-black/5 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 font-sans">
            <Link href="/" className="hover:text-black transition-colors">Início</Link>
            <span>/</span>
            <span className="text-black font-bold">Institucional</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* TÍTULO DA PÁGINA PADRONIZADO */}
        <div className="mb-16 border-b border-black pb-4">
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black leading-none">
            O Diretório <span className="text-[#0073B7]">Central</span>
          </h1>
          <p className="mt-1 text-[10px] font-sans uppercase tracking-[0.3em] text-slate-400 font-bold">
            Estrutura de Representação e Conexão Institucional
          </p>
        </div>

        {/* SEÇÃO DO MACRO-ORGANOGRAMA (MOVIMENTO + INSTITUIÇÃO) */}
        <section className="mb-32 font-sans">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-0 items-start">
            
            {/* COLUNA 01: MOVIMENTO ESTUDANTIL (FLUXO ASCENDENTE) */}
            <div className="flex flex-col items-center lg:border-r lg:border-black/10 lg:pr-12">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-black mb-12 italic border-b-2 border-black pb-1">
                MOVIMENTO ESTUDANTIL
              </h3>

              <div className="flex flex-col-reverse items-center w-full space-y-reverse space-y-4">
                {/* BASE: ESTUDANTES */}
                <div className="w-full max-w-[240px] border-2 border-black p-3 text-center bg-[#F9F9F7]">
                  <h4 className="text-sm font-black uppercase text-black">Estudantes</h4>
                </div>

                <span className="text-xl font-black text-black">↑</span>

                {/* CURSO/CAMPUS: CAs/DAs */}
                <div className="w-full max-w-[280px] border-2 border-black p-4 text-center bg-white">
                  <h4 className="text-sm font-black uppercase italic text-black">CAs / DAs</h4>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">Representação de Base</p>
                </div>

                <span className="text-xl font-black text-black">↑</span>

                {/* O DCE (CENTRO POLÍTICO) */}
                <div className="w-full max-w-[320px] border-2 border-[#0073B7] p-6 text-center bg-white shadow-sm">
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 italic">DCE UFVJM</h2>
                  <p className="text-[10px] font-black text-[#0073B7] uppercase tracking-widest mt-2">Articulação Geral</p>
                </div>

                <span className="text-xl font-black text-black">↑</span>

                {/* ESTADUAL: UEE-MG */}
                <div className="w-full max-w-[280px] border-2 border-black p-4 text-center bg-white">
                  <h4 className="text-sm font-black uppercase text-black">UEE (Estadual - MG)</h4>
                </div>

                <span className="text-xl font-black text-black">↑</span>

                {/* NACIONAL: UNE */}
                <div className="w-full max-w-[240px] border-2 border-black p-3 text-center bg-[#F9F9F7]">
                  <h4 className="text-sm font-black uppercase text-black">UNE (Nacional)</h4>
                </div>
              </div>
            </div>

            {/* COLUNA 02: CONEXÃO INSTITUCIONAL (UFVJM) */}
            <div className="flex flex-col items-center lg:pl-12 relative">
              
              {/* RÓTULO DE CONEXÃO TRANSVERSAL */}
              <div className="hidden lg:block absolute left-[-42px] top-[45%] z-20">
                <div className="flex items-center gap-1">
                  <div className="w-6 h-px bg-black"></div>
                  <div className="text-[9px] font-black bg-black text-white px-3 py-1.5 uppercase tracking-widest shadow-lg">
                    Conexão
                  </div>
                  <div className="w-6 h-px bg-black"></div>
                </div>
              </div>

              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-black mb-12 italic border-b-2 border-black pb-1">
                ESTRUTURA UFVJM
              </h3>

              <div className="w-full max-w-md border-2 border-black p-1 bg-white">
                <div className="border border-black p-8 space-y-10">
                  <div className="text-center pb-6 border-b-2 border-black/5">
                    <h4 className="text-xl font-black uppercase tracking-tighter text-black">UFVJM</h4>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Estrutura Formal</p>
                  </div>

                  <div className="space-y-10 relative">
                    {/* REITORIA */}
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-black transform rotate-45"></div>
                      <h5 className="text-sm font-black uppercase italic text-black">Reitoria</h5>
                    </div>

                    {/* CONSELHOS */}
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-black mt-1.5 transform rotate-45"></div>
                      <div className="flex-1">
                        <h5 className="text-sm font-black uppercase italic text-black mb-6">Conselhos Superiores</h5>
                        
                        {/* FLUXO DE REPRESENTAÇÃO DENTRO DOS CONSELHOS */}
                        <div className="ml-2 border-l-4 border-[#0073B7] pl-6 space-y-6">
                          <div className="relative">
                            <span className="absolute -left-[30px] top-1/2 -translate-y-1/2 text-[#0073B7] font-black text-lg">↑</span>
                            <div className="bg-[#0073B7]/5 border border-[#0073B7]/20 p-3">
                              <p className="text-[10px] font-black uppercase text-slate-900 leading-tight">
                                Representantes Discentes
                              </p>
                            </div>
                          </div>
                          
                          <div className="relative">
                            <span className="absolute -left-[30px] top-1/2 -translate-y-1/2 text-[#0073B7] font-black text-lg">↑</span>
                            <p className="text-[11px] font-black uppercase text-[#0073B7] tracking-tight">
                              DCE (Articulação Direta)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* TEXTO INSTITUCIONAL EXPLICATIVO */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 border-t-2 border-black pt-12">
          <div className="md:col-span-4">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black font-sans italic mb-6">
               02. Papel Político-Administrativo
             </h3>
             <p className="text-sm text-slate-600 leading-relaxed font-sans italic font-medium">
               O DCE atua em duas frentes: organiza a luta política junto ao movimento estudantil nacional e garante a voz do aluno nas decisões administrativas da UFVJM.
             </p>
          </div>
          
          <div className="md:col-span-8 space-y-8 text-lg text-slate-800 leading-relaxed text-justify">
            <p>
              O <strong>Diretório Central dos Estudantes</strong> é a entidade máxima de representação dos discentes da UFVJM. Sua existência é pautada pela autonomia frente à administração da universidade e pelo compromisso com a base estudantil.
            </p>
            <p>
              Na prática, isso significa que o DCE articula as demandas que nascem nos cursos (CAs) e moradias (DAEMs), transformando-as em pautas políticas. Essas pautas são defendidas por nossos representantes nos <strong>Conselhos Superiores (CONSU e CONSEPE)</strong>, onde temos direito a voz e voto em decisões que afetam diretamente a vida acadêmica e a assistência estudantil.
            </p>
          </div>
        </div>
      </div>

      <footer className="mt-40 text-center py-20 border-t border-black/5 mx-6">
          <div className="text-[10px] font-bold uppercase tracking-[1em] text-slate-200 select-none font-sans italic">
            DCE UFVJM • Gestão 2026
          </div>
      </footer>
    </main>
  );
}