"use client";

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white text-slate-950 pt-20 pb-10 mt-20 border-t-4 border-black">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          
          {/* Coluna 1: Branding (Manchete do Rodapé) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-[0.4em] text-slate-400 uppercase mb-2 font-sans">Publicação Oficial</span>
              <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tighter uppercase italic leading-none">
                PORTAL<span className="not-italic"> DO </span> <span className="text-[#0073B7]">DCE</span>
              </h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md font-serif italic">
              Diretório Central dos Estudantes da UFVJM. Representatividade, 
              transparência e compromisso com a base estudantil nos quatro campi.
            </p>
          </div>

          {/* Coluna 2: Campi (Listagem Editorial) */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-black border-b border-black/10 pb-3 font-sans">
              Presença Regional
            </h3>
            <ul className="text-[10px] text-slate-500 space-y-4 font-bold uppercase tracking-widest font-sans">
              {['Diamantina', 'Teófilo Otoni', 'Unaí', 'Janaúba'].map((campus) => (
                <li key={campus} className="flex items-center gap-3 group cursor-default">
                  <span className="w-1 h-1 bg-black group-hover:bg-[#0073B7] transition-colors"></span>
                  {campus}
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Links Externos (Ecossistema) */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-black border-b border-black/10 pb-3 font-sans">
              Ecossistema
            </h3>
            <nav className="flex flex-col gap-4">
              {[
                { label: 'Portal UFVJM', href: 'https://portal.ufvjm.edu.br' },
                { label: 'Sistema SIGA', href: '#' },
                { label: 'E-mail Acadêmico', href: '#' },
                { label: 'Ouvidoria', href: '#' }
              ].map((link, i) => (
                <a 
                  key={i} 
                  href={link.href} 
                  className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-black transition-all flex justify-between items-center group font-sans"
                >
                  {link.label}
                  <span className="opacity-0 group-hover:opacity-100 transition-all">→</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Divisor de Estilo Jornal */}
        <div className="w-full h-px bg-black/10 mt-20 mb-10" />

        {/* Bottom Bar: Créditos e Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left space-y-2">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] font-sans">
              &copy; {new Date().getFullYear()} • Diretório Central dos Estudantes UFVJM
            </p>
            <p className="text-[8px] font-medium text-slate-300 uppercase tracking-widest font-sans">
              Gestão "O Futuro é Agora" • CNPJ: 00.000.000/0001-00
            </p>
          </div>
          
          <div className="flex items-center border-l-0 md:border-l border-black/10 md:pl-8">
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-sans leading-none">
               Desenvolvido por <span className="text-black border-b border-black/20 hover:border-black transition-all cursor-pointer">Daniel Rodrigues Pereira</span>
             </p>
          </div>
        </div>

        {/* Linha Final Decorativa */}
        <div className="mt-10 flex justify-center gap-2">
          <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
          <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
          <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
        </div>
      </div>
    </footer>
  );
}