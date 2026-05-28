"use client";

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white text-neutral-950 pt-20 pb-10 mt-20 border-t border-neutral-200/60 font-sans antialiased">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 text-left">
          
          {/* Coluna 1: Branding (Manchete do Rodapé) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-2">Publicação Oficial</span>
              <h2 className="text-xl md:text-2xl font-black tracking-[0.16em] text-neutral-950 uppercase leading-none select-none">
                PORTAL <span className="text-neutral-400 font-light">DCE</span>
              </h2>
            </div>
            <p className="text-xs md:text-sm text-neutral-500 leading-relaxed max-w-sm font-light">
              Diretório Central dos Estudantes da UFVJM. Representatividade, 
              transparência e compromisso com a base estudantil nos quatro campi.
            </p>
          </div>

          {/* Coluna 2: Campi (Listagem Editorial) */}
          <div className="space-y-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-950 border-b border-neutral-100 pb-3">
              Presença Regional
            </h3>
            <ul className="text-[10px] text-neutral-400 space-y-3.5 font-bold uppercase tracking-widest">
              {['Diamantina', 'Teófilo Otoni', 'Unaí', 'Janaúba'].map((campus) => (
                <li key={campus} className="flex items-center gap-2.5 group cursor-default text-neutral-400 hover:text-neutral-950 transition-colors">
                  <span className="w-1 h-1 bg-neutral-300 group-hover:bg-neutral-950 rounded-full transition-colors"></span>
                  {campus}
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Links Externos (Ecossistema) */}
          <div className="space-y-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-950 border-b border-neutral-100 pb-3">
              Ecossistema
            </h3>
            <nav className="flex flex-col gap-3.5">
              {[
                { label: 'Portal UFVJM', href: 'https://portal.ufvjm.edu.br' },
                { label: 'Sistema SIGA', href: '#' },
                { label: 'E-mail Acadêmico', href: '#' },
                { label: 'Ouvidoria', href: '#' }
              ].map((link, i) => (
                <a 
                  key={i} 
                  href={link.href} 
                  className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-950 transition-all flex justify-between items-center group"
                >
                  {link.label}
                  <span className="opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">→</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Divisor de Estilo Jornal */}
        <div className="w-full h-px bg-neutral-100 mt-16 mb-10" />

        {/* Bottom Bar: Créditos e Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left space-y-1.5">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">
              &copy; {new Date().getFullYear()} • Diretório Central dos Estudantes UFVJM
            </p>
            <p className="text-[9px] font-medium text-neutral-300 uppercase tracking-widest">
              Gestão "O Futuro é Agora" • CNPJ: 00.000.000/0001-00
            </p>
          </div>
          
          <div className="flex items-center border-l-0 md:border-l border-neutral-100 md:pl-6">
             <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">
               Desenvolvido por <span className="text-neutral-950 border-b border-neutral-200 hover:border-neutral-950 transition-all cursor-pointer">Daniel Rodrigues Pereira</span>
             </p>
          </div>
        </div>

        {/* Linha Final Decorativa */}
        <div className="mt-10 flex justify-center gap-1.5">
          <div className="w-1 h-1 bg-neutral-200 rounded-full"></div>
          <div className="w-1 h-1 bg-neutral-200 rounded-full"></div>
          <div className="w-1 h-1 bg-neutral-200 rounded-full"></div>
        </div>
      </div>
    </footer>
  );
}