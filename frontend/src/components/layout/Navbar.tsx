"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Notícias', href: '/noticias' },
    { name: 'Editais', href: '/documentos' },
    { name: 'Eventos', href: '/eventos' },
    { name: 'Transparência', href: '/transparencia' },
    { name: 'Sobre o DCE', href: '/sobre' },
  ];

  return (
    <nav className={`w-full z-50 bg-white transition-all duration-300 ${scrolled ? "fixed top-0 shadow-md" : "relative"}`}>
      
      {/* 1. TOP BAR (UTILITY) */}
      <div className="bg-black text-white py-2 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[9px] md:text-[10px] font-bold uppercase tracking-widest font-sans">
          <div className="flex gap-4 md:gap-6 items-center">
            <Link href="/contato" className="hover:opacity-70">Contato</Link>
            <Link href="/carreiras" className="hidden sm:inline hover:opacity-70">Oportunidades</Link>
          </div>
          <div className="flex gap-4 md:gap-6 items-center">
             <span className="hidden md:inline font-sans">{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date())}</span>
             <Link href="http://127.0.0.1:8000/admin" className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="hidden xs:inline">Login Painel</span>
                <span className="xs:hidden">Login</span>
             </Link>
          </div>
        </div>
      </div>

      {/* 2. MASTHEAD (LOGO & WEATHER/MENU) */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 flex lg:grid lg:grid-cols-3 items-center justify-between border-b border-black/5">
        
        {/* Lado Esquerdo: Newsletter (Desktop) / Hamburguer (Mobile) */}
        <div className="flex items-center flex-1 lg:flex-none">
          {/* Desktop: Informativo */}
          <div className="hidden lg:flex">
            <button className="flex items-center gap-3 bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-tighter hover:bg-[#0073B7] transition-colors font-sans">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              Informativo DCE
            </button>
          </div>
          
          {/* Mobile: Botão Menu Hamburguer */}
          <button 
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors"
            aria-label="Abrir Menu"
          >
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Centro: Logo Serifado */}
        <div className="flex-1 flex justify-center lg:justify-center">
          <Link href="/">
            <h1 className="text-xl md:text-3xl lg:text-5xl font-serif font-black tracking-tighter text-black uppercase italic leading-none whitespace-nowrap">
               PORTAL<span className="not-italic"> DO </span> DCE
            </h1>
          </Link>
        </div>

        {/* Direita: Weather (Desktop) / Search (Mobile) */}
        <div className="flex-1 lg:flex-none flex justify-end items-center">
          {/* Desktop Weather */}
          <div className="hidden lg:flex flex-col items-end gap-1">
            <div className="flex items-center gap-3">
               <div className="text-right font-sans">
                  <p className="text-[11px] font-black text-black leading-none">24°C</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Diamantina, MG</p>
               </div>
               <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-inner">
                  <svg className="w-5 h-5 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
               </div>
            </div>
          </div>

          {/* Mobile Search Icon */}
          <button className="lg:hidden p-2 -mr-2 hover:bg-slate-50 rounded-full transition-colors" aria-label="Pesquisar">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 3. PRIMARY NAVIGATION (Desktop) */}
      <div className="hidden lg:block max-w-7xl mx-auto px-6 border-b-2 border-black">
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center justify-center w-full gap-10">
            {menuItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`text-[11px] font-bold uppercase tracking-widest transition-all relative py-2 group font-sans ${
                    active ? 'text-[#0073B7]' : 'text-slate-600 hover:text-black'
                  }`}
                >
                  {item.name}
                  <span className={`absolute -bottom-[2px] left-0 h-[2px] bg-black transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              );
            })}
          </div>

          <button className="p-2" aria-label="Search">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY (Drawer) */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-0 left-0 w-[280px] h-full bg-white shadow-2xl p-8 flex flex-col transition-transform duration-300">
            <div className="flex justify-between items-center mb-10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-black/10 pb-1 font-sans">Menu do Portal</span>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <nav className="flex flex-col gap-6">
              {menuItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-xl font-serif font-black italic border-b border-black/5 pb-2 ${
                    pathname === item.href ? 'text-[#0073B7]' : 'text-black hover:text-[#0073B7]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="mt-auto">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed font-sans">
                DCE UFVJM<br/>
                Gestão 2026 - O Futuro é Agora
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}