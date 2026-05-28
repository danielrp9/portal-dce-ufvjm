"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface WeatherState {
  temp: number;
  city: string;
  condition: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [loadingWeather, setLoadingWeather] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    async function fetchLocalWeather() {
      try {
        const ipRes = await fetch('https://ipapi.co/json/');
        const ipData = await ipRes.json();
        
        let detectCity = "Diamantina";
        let detectRegion = "MG";

        if (ipData && !ipData.error) {
          detectCity = ipData.city;
          detectRegion = ipData.region_code;
        }

        const apiKey = '229319fb84e581895dcb8e357d82e11a';
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(detectCity)}&appid=${apiKey}&units=metric&lang=pt_br`
        );
        
        if (!weatherRes.ok) {
          const errorData = await weatherRes.json();
          throw new Error(`OpenWeather Erro: ${weatherRes.status} - ${errorData.message}`);
        }
        const weatherData = await weatherRes.json();

        const mainCondition = weatherData.weather[0].main.toLowerCase();
        let condition: WeatherState['condition'] = 'clear';

        if (mainCondition.includes('rain') || mainCondition.includes('drizzle')) {
          condition = 'rain';
        } else if (mainCondition.includes('thunderstorm')) {
          condition = 'thunderstorm';
        } else if (mainCondition.includes('cloud')) {
          condition = 'clouds';
        }

        setWeather({
          temp: Math.round(weatherData.main.temp),
          city: `${detectCity}, ${detectRegion}`,
          condition: condition
        });

      } catch (error) {
        console.error("⚠️ Alerta Clima:", error);
        setWeather({
          temp: 24,
          city: "Diamantina, MG",
          condition: 'clear'
        });
      } finally {
        setLoadingWeather(false);
      }
    }

    fetchLocalWeather();
  }, []);

  const menuItems = [
    { name: 'Início', href: '/' },
    { name: 'Notícias', href: '/noticias' },
    { name: 'Documentos', href: '/documentos' },
    { name: 'Eventos', href: '/eventos' },
    { name: 'Transparência', href: '/transparencia' },
    { name: 'Sobre o DCE', href: '/sobre' },
  ];

  const renderWeatherIcon = (condition: WeatherState['condition']) => {
    const baseClass = "w-8 h-8 rounded-full flex items-center justify-center border border-white/40 text-neutral-800 bg-white/60 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.05)]";
    switch (condition) {
      case 'rain':
      case 'thunderstorm':
        return (
          <div className={baseClass}>
            <svg className="w-4 h-4 text-[#0073B7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        );
      case 'clouds':
        return (
          <div className={baseClass}>
            <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
        );
      case 'clear':
      default:
        return (
          <div className={baseClass}>
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <nav className={`w-full z-50 transition-all duration-500 ${
      scrolled 
        ? "fixed top-3 left-0 right-0 max-w-7xl mx-auto rounded-2xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_16px_40px_rgba(0,0,0,0.08)] px-2" 
        : "relative bg-white border-b border-neutral-200/60"
    }`}>
      
      {/* 1. TOP BAR (UTILITY) */}
      {!scrolled && (
        <div className="hidden md:block bg-neutral-950 text-neutral-200 py-2.5 px-6 border-b border-neutral-900">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.25em]">
            <div className="flex gap-8 items-center">
              <Link href="/contato" className="hover:text-[#8CC63F] transition-colors duration-200">Fale Conosco</Link>
              <Link href="/documentos" className="hover:text-[#0073B7] transition-colors duration-200">Editais Abertos</Link>
            </div>
            <div className="flex gap-6 items-center">
              <span className="font-medium text-neutral-400">
                {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date())}
              </span>
              <div className="h-3 w-px bg-neutral-800"></div>
              <Link href="http://127.0.0.1:8000/admin" className="flex items-center gap-2 text-white hover:text-[#8CC63F] transition-colors">
                <span className="w-1.5 h-1.5 bg-[#8CC63F] rounded-full shadow-[0_0_8px_#8CC63F] animate-pulse"></span>
                <span>Acesso Restrito</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. MASTHEAD (LOGO & CONTROLES) */}
      <div className={`max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? "py-2.5" : "py-4 md:py-8"}`}>
        
        {/* Lado Esquerdo */}
        <div className="flex items-center flex-1 lg:flex-none">
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-2 -ml-1 hover:bg-neutral-100/80 rounded-xl transition-all"
            aria-label="Menu"
          >
            <svg className="w-6 h-6 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="hidden lg:flex">
            <div className="flex items-center gap-2.5 border border-neutral-200/60 px-5 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-500 bg-neutral-50/50 shadow-inner">
              <span className="w-1.5 h-1.5 bg-[#0073B7] rounded-full shadow-[0_0_6px_#0073B7]"></span>
              Informativo Estudantil
            </div>
          </div>
        </div>

        {/* Centro - Logotipo Editorial */}
        <div className="flex-1 flex justify-center lg:justify-center">
          <Link href="/" className="group flex flex-col items-center">
            <h1 className={`font-black text-neutral-950 uppercase leading-none text-center select-none transition-all duration-300 ${scrolled ? "text-base md:text-xl tracking-[0.15em]" : "text-xl md:text-4xl tracking-[0.2em] md:tracking-[0.25em] group-hover:tracking-[0.28em]"}`}>
              PORTAL <span className="text-[#0073B7] drop-shadow-[0_2px_10px_rgba(0,115,183,0.15)]">DCE</span>
            </h1>
            {!scrolled && (
              <div className="flex items-center gap-2 md:gap-3 mt-1.5 md:mt-3 transition-all duration-300">
                <div className="h-px w-6 md:w-10 bg-[#8CC63F]"></div>
                <p className="text-[7px] md:text-[9px] font-black text-center uppercase tracking-[0.4em] md:tracking-[0.6em] text-neutral-400 group-hover:text-neutral-600 transition-colors">
                  UFVJM
                </p>
                <div className="h-px w-6 md:w-10 bg-[#8CC63F]"></div>
              </div>
            )}
          </Link>
        </div>

        {/* Direita */}
        <div className="flex-1 lg:flex-none flex justify-end items-center">
          <div className="hidden lg:flex items-center gap-5 min-w-[180px] justify-end">
            {loadingWeather ? (
              <div className="flex items-center gap-3 animate-pulse">
                <div className="text-right">
                  <div className="h-2 w-12 bg-neutral-200 rounded-full mb-1.5 ml-auto"></div>
                  <div className="h-1.5 w-20 bg-neutral-100 rounded-full"></div>
                </div>
                <div className="w-7 h-7 bg-neutral-100 rounded-full"></div>
              </div>
            ) : (
              weather && (
                <div className={`flex items-center gap-4 transition-all duration-500 animate-in fade-in ${scrolled ? "scale-90 origin-right" : ""}`}>
                  <div className="text-right">
                    <p className="text-[14px] font-black text-neutral-950 leading-none">{weather.temp}°C</p>
                    <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-tight mt-1 max-w-[130px] truncate">{weather.city}</p>
                  </div>
                  {renderWeatherIcon(weather.condition)}
                </div>
              )
            )}
          </div>

          <button className="lg:hidden p-2 -mr-1 hover:bg-neutral-100/80 rounded-xl transition-all" aria-label="Pesquisar">
            <svg className="w-5 h-5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 3. PRIMARY NAVIGATION (Desktop) */}
      <div className={`hidden lg:block max-w-7xl mx-auto px-6 border-t border-neutral-100 transition-all duration-300 ${scrolled ? "h-0 overflow-hidden border-none" : "h-14"}`}>
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center justify-center w-full gap-12">
            {menuItems.map((item) => {
              const active = item.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-[11px] font-bold uppercase tracking-[0.25em] transition-all relative py-2 group ${
                    active ? 'text-[#0073B7]' : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 h-[3px] transition-all duration-300 rounded-full ${
                    active ? 'w-full bg-[#0073B7] shadow-[0_2px_8px_rgba(0,115,183,0.4)]' : 'w-0 bg-[#8CC63F] group-hover:w-full'
                  }`}></span>
                </Link>
              );
            })}
          </div>

          <div className="w-10 flex justify-end">
            <button className="p-2 text-neutral-400 hover:text-neutral-950 transition-colors group" aria-label="Search">
              <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div className={`fixed inset-0 z-[100] lg:hidden transition-all duration-300 ${isOpen ? "visible" : "invisible pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-neutral-950/40 backdrop-blur-md transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsOpen(false)}></div>
        
        <div className={`absolute top-0 left-0 w-[310px] h-full bg-white/90 backdrop-blur-2xl p-8 flex flex-col border-r border-white/30 shadow-[24px_0_80px_rgba(0,0,0,0.15)] transition-transform duration-500 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
          
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-[#0073B7] rounded-full shadow-[0_0_8px_#0073B7]"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-950">Navegação</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
              <svg className="w-6 h-6 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const active = item.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-xs font-bold uppercase tracking-[0.18em] py-4 px-4 rounded-xl transition-all flex items-center relative ${
                    active 
                      ? 'text-[#0073B7] bg-white shadow-[0_8px_20px_rgba(0,115,183,0.08)] border border-neutral-100 font-black pl-6' 
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/3 h-1/3 w-1 bg-[#0073B7] rounded-r-md"></span>
                  )}
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-8 border-t border-neutral-100">
            <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest leading-relaxed">
              DCE UFVJM<br/>
              <span className="text-[#0073B7] font-black">Portal de Comunicação</span><br/>
              <span className="font-medium text-neutral-400">Gestão 2026</span>
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}