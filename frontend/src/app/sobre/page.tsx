import React from 'react';
import Link from 'next/link';

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-[#F4F4F2] pb-32 text-neutral-900 selection:bg-neutral-950 selection:text-white font-sans antialiased">
      
      {/* 1. BREADCRUMB EDITORIAL SUTIL */}
      <div className="w-full border-b border-neutral-200/60 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400">
            <Link href="/" className="hover:text-neutral-950 transition-colors">Início</Link>
            <span>/</span>
            <span className="text-neutral-950 font-bold">Institucional</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER DA SEÇÃO */}
        <div className="mb-16 border-b border-neutral-300 pb-5">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 mb-1">
            Conheça a Entidade
          </h3>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-950 uppercase">
            O Diretório <span className="text-[#0073B7]">Central</span>
          </h1>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
            Estrutura de Representação e Conexão Institucional
          </p>
        </div>

        {/* SEÇÃO DO MACRO-ORGANOGRAMA */}
        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-0 items-start">
            
            {/* COLUNA 01: MOVIMENTO ESTUDANTIL */}
            <div className="flex flex-col items-center lg:border-r lg:border-neutral-200 lg:pr-12">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-950 mb-12 border-b-2 border-[#0073B7] pb-1">
                MOVIMENTO ESTUDANTIL
              </h3>

              <div className="flex flex-col-reverse items-center w-full space-y-reverse space-y-4">
                {/* BASE: ESTUDANTES */}
                <div className="w-full max-w-[240px] bg-white border border-neutral-200/60 rounded-xl p-4 text-center shadow-2xs">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Estudantes</h4>
                </div>

                <span className="text-xl font-bold text-neutral-300">↑</span>

                {/* CURSO/CAMPUS: CAs/DAs */}
                <div className="w-full max-w-[280px] bg-white border border-neutral-200/60 rounded-2xl p-5 text-center shadow-2xs group hover:border-[#8CC63F] transition-colors">
                  <h4 className="text-sm font-bold uppercase tracking-tight text-neutral-950">CAs / DAs</h4>
                  <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Representação de Base</p>
                </div>

                <span className="text-xl font-bold text-neutral-300">↑</span>

                {/* O DCE (CENTRO POLÍTICO) */}
                <div className="w-full max-w-[320px] bg-white border-2 border-[#0073B7] rounded-3xl p-8 text-center shadow-md group hover:shadow-lg transition-all">
                  <h2 className="text-2xl font-bold uppercase tracking-tight text-neutral-950 italic">DCE UFVJM</h2>
                  <p className="text-[10px] font-bold text-[#0073B7] uppercase tracking-[0.2em] mt-2">Articulação Geral</p>
                </div>

                <span className="text-xl font-bold text-[#0073B7]">↑</span>

                {/* ESTADUAL: UEE-MG */}
                <div className="w-full max-w-[280px] bg-white border border-neutral-200/60 rounded-2xl p-5 text-center shadow-2xs">
                  <h4 className="text-sm font-bold uppercase tracking-tight text-neutral-950">UEE (Minas Gerais)</h4>
                </div>

                <span className="text-xl font-bold text-neutral-300">↑</span>

                {/* NACIONAL: UNE */}
                <div className="w-full max-w-[240px] bg-white border border-neutral-200/60 rounded-xl p-4 text-center shadow-2xs">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">UNE (Nacional)</h4>
                </div>
              </div>
            </div>

            {/* COLUNA 02: CONEXÃO INSTITUCIONAL (UFVJM) */}
            <div className="flex flex-col items-center lg:pl-12 relative">
              
              {/* RÓTULO DE CONEXÃO TRANSVERSAL */}
              <div className="hidden lg:block absolute left-[-45px] top-[45%] z-20">
                <div className="flex items-center gap-1">
                  <div className="w-8 h-px bg-neutral-300"></div>
                  <div className="text-[9px] font-bold bg-neutral-950 text-white px-4 py-2 rounded-full uppercase tracking-widest shadow-md">
                    Conexão
                  </div>
                  <div className="w-8 h-px bg-neutral-300"></div>
                </div>
              </div>

              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-950 mb-12 border-b-2 border-[#8CC63F] pb-1">
                ESTRUTURA UFVJM
              </h3>

              <div className="w-full max-w-md bg-white border border-neutral-200/60 rounded-3xl shadow-2xs overflow-hidden">
                <div className="p-8 md:p-10">
                  <div className="text-center pb-8 border-b border-neutral-100">
                    <h4 className="text-2xl font-bold uppercase tracking-tight text-neutral-950">UFVJM</h4>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Estrutura Formal</p>
                  </div>

                  <div className="space-y-12 mt-10 relative">
                    {/* REITORIA */}
                    <div className="flex items-center gap-5">
                      <div className="w-3 h-3 bg-neutral-950 rounded-full"></div>
                      <h5 className="text-sm font-bold uppercase tracking-wide text-neutral-950">Reitoria</h5>
                    </div>

                    {/* CONSELHOS */}
                    <div className="flex items-start gap-5">
                      <div className="w-3 h-3 bg-neutral-950 rounded-full mt-1.5"></div>
                      <div className="flex-1">
                        <h5 className="text-sm font-bold uppercase tracking-wide text-neutral-950 mb-6">Conselhos Superiores</h5>
                        
                        {/* FLUXO DE REPRESENTAÇÃO */}
                        <div className="ml-1.5 border-l-2 border-[#0073B7] pl-8 space-y-8">
                          <div className="relative">
                            <span className="absolute -left-[32px] top-1/2 -translate-y-1/2 text-[#0073B7] font-bold text-xl">↑</span>
                            <div className="bg-neutral-50 border border-neutral-200/60 rounded-xl p-4">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-950 leading-tight">
                                Representantes Discentes
                              </p>
                            </div>
                          </div>
                          
                          <div className="relative">
                            <span className="absolute -left-[32px] top-1/2 -translate-y-1/2 text-[#0073B7] font-bold text-xl">↑</span>
                            <p className="text-[11px] font-bold uppercase text-[#0073B7] tracking-widest pl-1">
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 border-t border-neutral-300 pt-12">
          <div className="md:col-span-4">
             <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-6">
               02. Papel Político-Administrativo
             </h3>
             <p className="text-xs text-neutral-500 leading-relaxed font-medium uppercase tracking-wider">
               O DCE atua em duas frentes: organiza a luta política junto ao movimento estudantil nacional e garante a voz do aluno nas decisões administrativas da UFVJM.
             </p>
          </div>
          
          <div className="md:col-span-8 space-y-8 text-base md:text-lg text-neutral-700 leading-relaxed text-justify font-light">
            <p>
              O <strong className="font-bold text-neutral-950">Diretório Central dos Estudantes</strong> é a entidade máxima de representação dos discentes da UFVJM. Sua existência é pautada pela autonomia frente à administração da universidade e pelo compromisso inabalável com a base estudantil.
            </p>
            <p>
              Na prática, isso significa que o DCE articula as demandas que nascem nos cursos (CAs) e moradias, transformando-as em pautas políticas concretas. Essas pautas são defendidas por nossos representantes nos <strong className="font-bold text-neutral-950">Conselhos Superiores (CONSU e CONSEPE)</strong>, onde temos direito a voz e voto em decisões que afetam diretamente a vida acadêmica e a assistência estudantil.
            </p>
          </div>
        </div>
      </div>

      <footer className="mt-40 text-center py-20 border-t border-neutral-200/60 mx-6">
          <div className="text-[10px] font-bold uppercase tracking-[0.6em] text-neutral-300 select-none">
            DCE UFVJM • Gestão Continuada
          </div>
      </footer>
    </main>
  );
}