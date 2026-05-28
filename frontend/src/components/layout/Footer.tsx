"use client";

import React from 'react';
import Link from 'next/link';
import { Instagram, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-white pt-24 pb-12 mt-20 font-sans antialiased border-t-4 border-[#8CC63F]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 text-left">
          
          {/* Coluna 1: Branding */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#8CC63F] uppercase mb-3">Voz e Representação</span>
              <h2 className="text-2xl md:text-3xl font-black tracking-[0.15em] text-white uppercase leading-none select-none">
                PORTAL <span className="text-neutral-600 font-light">DCE</span>
              </h2>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-md font-light">
              O Diretório Central dos Estudantes da UFVJM é a entidade máxima de representação discente. 
              Atuamos pela transparência, assistência estudantil e pelo fortalecimento da universidade pública em todos os campi.
            </p>
            
          <div className="flex gap-4 pt-4">
                        {/* Redes Sociais DCE */}
                        <Link 
                          href="https://www.instagram.com/dceufvjm/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:border-[#8CC63F] transition-colors cursor-pointer group"
                        >
                            <Instagram size={16} className="text-neutral-500 group-hover:text-white transition-colors" />
                        </Link>
            </div>
          </div>

          {/* Coluna 2: Campi */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white border-b border-neutral-900 pb-4">
              Presença Regional
            </h3>
            <ul className="text-[10px] space-y-4 font-bold uppercase tracking-widest">
              {['Diamantina', 'Teófilo Otoni', 'Unaí', 'Janaúba'].map((campus) => (
                <li key={campus} className="flex items-center gap-3 text-neutral-500 group cursor-default hover:text-white transition-colors">
                  <span className="w-1 h-1 bg-[#8CC63F] rounded-full"></span>
                  {campus}
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Ecossistema */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white border-b border-neutral-900 pb-4">
              Ecossistema
            </h3>
            <nav className="flex flex-col gap-4">
              {[
                { label: 'Portal UFVJM', href: 'https://portal.ufvjm.edu.br' },
                { label: 'Sistema SIGA', href: '#' },
                { label: 'E-mail Acadêmico', href: '#' },
                { label: 'Ouvidoria Geral', href: '#' }
              ].map((link, i) => (
                <a 
                  key={i} 
                  href={link.href} 
                  className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-[#0073B7] transition-all flex justify-between items-center group"
                >
                  {link.label}
                  <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">→</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Divisor */}
        <div className="w-full h-px bg-neutral-900 mt-20 mb-12" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left space-y-2">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.25em]">
              &copy; {new Date().getFullYear()} • Diretório Central dos Estudantes UFVJM
            </p>
            <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">
              Entidade de Utilidade Pública • Gestão Continuada
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-start md:border-l border-neutral-900 md:pl-10 gap-3">
             <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-none">
               Desenvolvido por <span className="text-white border-b border-neutral-800 hover:border-[#0073B7] transition-all cursor-pointer">Daniel Rodrigues Pereira</span>
             </p>
             
             {/* Ícones das Redes Sociais Pessoais */}
             <div className="flex items-center gap-4">
               <Link 
                 href="https://github.com/danielrp9" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-neutral-500 hover:text-white transition-colors"
               >
                 <Github size={14} />
               </Link>
               <Link 
                 href="https://www.linkedin.com/in/daniel-rodrigues-pereira-29b1b7243/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-neutral-500 hover:text-[#0073B7] transition-colors"
               >
                 <Linkedin size={14} />
               </Link>
               <Link 
                 href="https://www.instagram.com/daniel_rodrigues9/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-neutral-500 hover:text-[#8CC63F] transition-colors"
               >
                 <Instagram size={14} />
               </Link>
             </div>
          </div>
        </div>

        {/* Linha Final Decorativa */}
        <div className="mt-16 flex justify-center gap-2">
          <div className="w-1.5 h-1.5 bg-[#0073B7] rounded-full opacity-50"></div>
          <div className="w-1.5 h-1.5 bg-[#8CC63F] rounded-full opacity-50"></div>
          <div className="w-1.5 h-1.5 bg-neutral-800 rounded-full"></div>
        </div>
      </div>
    </footer>
  );
}