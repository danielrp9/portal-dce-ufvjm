"use client";

import React from 'react';
import Link from 'next/link';
import { Instagram, Linkedin, Github, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-neutral-950 text-white pt-24 pb-12 overflow-hidden font-sans antialiased">
      {/* Detalhe de borda superior imersiva */}
      <div className="absolute top-0 left-0 w-full h-1.5 flex">
        <div className="flex-1 bg-[#0073B7]"></div>
        <div className="flex-1 bg-[#8CC63F]"></div>
        <div className="flex-1 bg-[#003366]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 text-left">
          
          {/* Coluna 1: Branding */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-[0.4em] text-[#8CC63F] uppercase mb-3">Voz e Representação Discente</span>
              <h2 className="text-2xl md:text-3xl font-black tracking-[0.15em] text-white uppercase leading-none select-none">
                PORTAL <span className="text-neutral-500 font-light">DCE</span>
              </h2>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-md font-medium opacity-80">
              O Diretório Central dos Estudantes da UFVJM é a entidade máxima de representação discente. 
              Atuamos pela transparência, assistência estudantil e pelo fortalecimento da universidade pública em todos os campi.
            </p>
            
            <div className="flex gap-4 pt-4">
              <Link 
                href="https://www.instagram.com/dceufvjm/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#8CC63F] hover:text-neutral-950 transition-all duration-300 group shadow-lg"
              >
                <Instagram size={20} className="transition-transform group-hover:scale-110" />
              </Link>
            </div>
          </div>

          {/* Coluna 2: Presença Regional */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/50 border-b border-white/5 pb-4">
              Presença Regional
            </h3>
            <ul className="text-[10px] space-y-4 font-black uppercase tracking-[0.15em]">
              {['Diamantina', 'Teófilo Otoni', 'Unaí', 'Janaúba'].map((campus) => (
                <li key={campus} className="flex items-center gap-3 text-neutral-400 group cursor-default hover:text-white transition-colors">
                  <span className="w-1.5 h-1.5 bg-[#8CC63F] rounded-full shadow-[0_0_8px_rgba(140,198,63,0.4)]"></span>
                  {campus}
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Ecossistema */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/50 border-b border-white/5 pb-4">
              Ecossistema
            </h3>
            <nav className="flex flex-col gap-4">
              {[
                { label: 'Portal UFVJM', href: 'https://portal.ufvjm.edu.br' },
                { label: 'e-Campus', href: 'https://ecampus.ufvjm.edu.br/' },
                { label: 'Ouvidoria', href: 'https://portal.ufvjm.edu.br/ouvidoria' },
                { label: 'Editais', href: 'https://portal.ufvjm.edu.br/editais/categorias/graduacao/assistencia-estudantil' }
              ].map((link, i) => (
                <a 
                  key={i} 
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-[#0073B7] transition-all flex justify-between items-center group"
                >
                  {link.label}
                  <ExternalLink size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </a>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Divisor com gradiente */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-20 mb-12" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left space-y-2">
            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.25em]">
              &copy; {new Date().getFullYear()} • Diretório Central dos Estudantes UFVJM
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></span>
              <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">
                Entidade de Utilidade Pública • Defesa do Ensino Superior
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end md:border-l border-white/5 md:pl-10 gap-4">
             <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none">
               Desenvolvido por <span className="text-white hover:text-[#0073B7] transition-colors cursor-pointer">Daniel Rodrigues Pereira</span>
             </p>
             
             {/* Redes Sociais Pessoais */}
             <div className="flex items-center gap-5">
               <Link 
                 href="https://github.com/danielrp9" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-neutral-500 hover:text-white transition-all transform hover:scale-110"
               >
                 <Github size={16} />
               </Link>
               <Link 
                 href="https://www.linkedin.com/in/daniel-rodrigues-pereira-29b1b7243/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-neutral-500 hover:text-[#0073B7] transition-all transform hover:scale-110"
               >
                 <Linkedin size={16} />
               </Link>
               <Link 
                 href="https://www.instagram.com/daniel_rodrigues9/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-neutral-500 hover:text-[#8CC63F] transition-all transform hover:scale-110"
               >
                 <Instagram size={16} />
               </Link>
             </div>
          </div>
        </div>

        {/* Linha Final de Assinatura */}
        <div className="mt-16 flex justify-center items-center gap-4">
          <div className="h-px w-8 bg-white/5"></div>
          <div className="flex gap-2">
            <div className="w-1 h-1 bg-[#0073B7] rounded-full"></div>
            <div className="w-1 h-1 bg-[#8CC63F] rounded-full"></div>
            <div className="w-1 h-1 bg-[#003366] rounded-full"></div>
          </div>
          <div className="h-px w-8 bg-white/5"></div>
        </div>
      </div>
    </footer>
  );
}
