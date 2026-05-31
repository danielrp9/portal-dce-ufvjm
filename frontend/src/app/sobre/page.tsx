import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  History, 
  ShieldCheck, 
  Compass, 
  HeartHandshake, 
  Scale, 
  ChevronRight,
  Quote
} from 'lucide-react';

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-[#F0F2F5] text-neutral-900 selection:bg-[#0073B7] selection:text-white font-sans antialiased pb-32 relative overflow-hidden">
      
      {/* Elementos de Fundo */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#0073B7]/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-[#8CC63F]/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>

      {/* 1. BREADCRUMB REFINADO */}
      <div className="w-full bg-white/60 backdrop-blur-md border-b border-neutral-200/60 mb-12 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            <Link href="/" className="hover:text-[#0073B7] transition-colors">Início</Link>
            <ChevronRight size={10} className="text-neutral-300" />
            <span className="text-neutral-900 font-black">Sobre o DCE</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Ultra-Compacto e Legível: Sobre */}
        <div className="mb-10 relative">
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#0073B7]/5 blur-[50px] rounded-full pointer-events-none"></div>
          
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-neutral-200/60 pb-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-1 select-none">
                <div className="w-6 h-[2px] bg-[#0073B7] rounded-full"></div>
                <h3 className="text-[8px] font-black uppercase tracking-[0.3em] text-[#0073B7]">
                  Voz e Representação
                </h3>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-neutral-950 uppercase">
                Sobre o DCE UFVJM
              </h1>
            </div>
          </div>
        </div>

        {/* HERO SECTION - O QUE É O DCE */}
        <section className="mb-24 relative overflow-hidden bg-[#001529] rounded-[3rem] p-10 md:p-20 text-white shadow-[0_30px_60px_rgba(0,0,0,0.2)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] pointer-events-none rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8CC63F]/5 blur-[100px] pointer-events-none rounded-full"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8CC63F] mb-6">
                O que é o Diretório?
              </h2>
              <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-tight mb-8">
                A união que <span className="text-[#0073B7] drop-shadow-[0_0_20px_rgba(0,115,183,0.3)]">Transforma</span>
              </h1>
              <div className="space-y-6 text-lg md:text-xl text-neutral-300 font-medium leading-relaxed max-w-2xl">
                <p>
                  O <strong className="text-white">Diretório Central dos Estudantes</strong> é a entidade máxima de representação dos discentes dentro de uma universidade. 
                </p>
                <p>
                  É o órgão que unifica a voz de milhares de estudantes, garantindo que suas demandas, lutas e direitos sejam ouvidos e respeitados pela Reitoria, pelos conselhos superiores e pela sociedade.
                </p>
              </div>
            </div>
            
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: 'União de Base' },
                { icon: ShieldCheck, label: 'Defesa de Direitos' },
                { icon: Scale, label: 'Voz Política' },
                { icon: HeartHandshake, label: 'Apoio ao Aluno' }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 text-center transition-all hover:bg-white/10">
                  <item.icon size={28} className="text-[#8CC63F]" />
                  <span className="text-[10px] font-black uppercase tracking-widest leading-tight">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* POR QUE O DCE É IMPORTANTE? */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-16">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#0073B7] whitespace-nowrap">A Importância da Luta</h3>
            <div className="h-px w-full bg-neutral-200"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-[3.5rem] p-12 md:p-16 border border-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] relative group hover:shadow-[0_50px_100px_-15px_rgba(0,115,183,0.15)] transition-all duration-700 transform hover:-translate-y-3">
               <div className="w-20 h-20 bg-[#F8FAFC] rounded-2xl flex items-center justify-center mb-10 group-hover:bg-[#0073B7] group-hover:text-white transition-all duration-500 shadow-sm">
                 <Compass size={40} className="text-[#0073B7] group-hover:text-white transition-colors" />
               </div>
               <h4 className="text-3xl font-black text-neutral-950 mb-8 tracking-tighter uppercase leading-tight">Formação Política <br/><span className="text-[#0073B7]">e Cidadã</span></h4>
               <p className="text-neutral-600 leading-relaxed font-bold text-base opacity-100">
                 A universidade vai além da sala de aula. Participar do DCE ou apoiar suas causas é exercer a democracia na prática. O movimento estudantil forma líderes e cidadãos conscientes, capazes de questionar, negociar e transformar a realidade social do país.
               </p>
            </div>

            <div className="bg-white rounded-[3.5rem] p-12 md:p-16 border border-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] relative group hover:shadow-[0_50px_100px_-15px_rgba(140,198,63,0.15)] transition-all duration-700 transform hover:-translate-y-3">
               <div className="w-20 h-20 bg-[#F8FAFC] rounded-2xl flex items-center justify-center mb-10 group-hover:bg-[#8CC63F] group-hover:text-neutral-950 transition-all duration-500 shadow-sm">
                 <ShieldCheck size={40} className="text-[#8CC63F] group-hover:text-neutral-950 transition-colors" />
               </div>
               <h4 className="text-3xl font-black text-neutral-950 mb-8 tracking-tighter uppercase leading-tight">Garantia de <br/><span className="text-[#8CC63F]">Permanência</span></h4>
               <p className="text-neutral-600 leading-relaxed font-bold text-base opacity-100">
                 Sem o DCE, pautas como moradia estudantil, restaurantes universitários a preços justos e bolsas de auxílio ficariam à mercê apenas de decisões administrativas. Nós lutamos para que o filho da classe trabalhadora não apenas entre, mas consiga permanecer e se formar.
               </p>
            </div>
          </div>
        </section>

        {/* HISTÓRIA E CONTEXTO UFVJM */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32 items-start">
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-6">Nossa Trajetória</h3>
              <h4 className="text-4xl font-black text-neutral-950 tracking-tight leading-tight mb-8">
                O Movimento Estudantil e o <br/> <span className="text-[#0073B7]">DCE UFVJM</span>
              </h4>
              <div className="w-20 h-2 bg-[#8CC63F] rounded-full"></div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-12">
            <div className="flex gap-8 group">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-neutral-200 shadow-[0_10px_20px_rgba(0,0,0,0.05)] group-hover:border-[#0073B7] group-hover:shadow-[0_15px_30px_rgba(0,115,183,0.15)] transition-all duration-500">
                  <History size={24} className="text-[#0073B7]" />
                </div>
                <div className="w-[2px] h-full bg-neutral-200 mt-4"></div>
              </div>
              <div className="pb-12">
                <h5 className="text-[12px] font-black uppercase tracking-widest text-[#0073B7] mb-4">Contexto Brasileiro</h5>
                <p className="text-xl text-neutral-700 leading-relaxed font-bold">
                  Desde a resistência à Ditadura Militar até as "Diretas Já" e o "Fora Collor", o Movimento Estudantil sempre foi o motor das mudanças sociais no Brasil. Os DCEs são a base desse ecossistema, conectando cada campus à luta nacional da UNE.
                </p>
              </div>
            </div>

            <div className="flex gap-8 group">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-neutral-200 shadow-[0_10px_20px_rgba(0,0,0,0.05)] group-hover:border-[#8CC63F] group-hover:shadow-[0_15px_30px_rgba(140,198,63,0.15)] transition-all duration-500">
                  <Users size={24} className="text-[#8CC63F]" />
                </div>
                <div className="w-[2px] h-full bg-neutral-200 mt-4"></div>
              </div>
              <div className="pb-12">
                <h5 className="text-[12px] font-black uppercase tracking-widest text-[#8CC63F] mb-4">Fundação UFVJM (2005)</h5>
                <p className="text-xl text-neutral-700 leading-relaxed font-bold">
                  Com a expansão da antiga Faod para se tornar a UFVJM em 2005, o DCE tornou-se a ponte essencial entre os novos campi. De Diamantina a Unaí, o diretório unificou as vozes dos Vales do Jequitinhonha e Mucuri.
                </p>
              </div>
            </div>

            {/* FRASES DE IMPACTO */}
            <div className="bg-[#001529] p-12 md:p-16 rounded-[3.5rem] border border-white/10 relative shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#0073B7]/10 blur-3xl rounded-full"></div>
              <Quote size={60} className="text-[#8CC63F] opacity-10 absolute top-8 left-8 group-hover:scale-110 transition-transform duration-700" />
              <p className="text-2xl md:text-3xl font-black text-white leading-tight italic relative z-10 pl-6">
                "A educação não transforma o world. A educação muda pessoas. Pessoas transformam o mundo."
              </p>
              <footer className="mt-10 text-[12px] font-black uppercase tracking-[0.4em] text-[#8CC63F] pl-6 border-l-4 border-[#8CC63F]">
                — Paulo Freire
              </footer>
            </div>
          </div>
        </section>

        {/* CTA - PARTICIPAÇÃO */}
        <section className="w-full bg-[#8CC63F] rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-[0_20px_50px_rgba(140,198,63,0.3)]">
          <div className="max-w-xl text-neutral-900">
            <h4 className="text-3xl md:text-4xl font-black tracking-tight mb-4 leading-tight">Faça parte desta construção coletiva</h4>
            <p className="text-lg font-bold opacity-80 uppercase tracking-tighter">O DCE é o que os estudantes fazem dele. Participe!</p>
          </div>
          <Link 
            href="/ficha-tecnica" 
            className="px-12 py-5 bg-[#001529] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#0073B7] transition-all transform hover:scale-105 active:scale-95 shadow-xl"
          >
            Ficha Técnica
          </Link>
        </section>

      </div>
    </main>
  );
}
