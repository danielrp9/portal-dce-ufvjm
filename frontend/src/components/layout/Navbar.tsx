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
    { name: 'Artigos', href: '/artigos' },
    { name: 'Editais', href: '/editais' },
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
    <nav className={`z-50 transition-all duration-700 ease-out ${
      scrolled 
        ? "fixed top-4 left-4 right-4 mx-auto max-w-[1380px] rounded-3xl bg-white border border-white/60 shadow-[0_30px_70px_-15px_rgba(0,115,183,0.12),0_10px_20px_-5px_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] px-2" 
        : "relative w-full bg-white border-b-2 border-[#0073B7]/10 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.06)]"
    }`}>
      
      {/* 1. TOP BAR (UTILITY) - Mais Vibrante */}
      {!scrolled && (
        <div className="hidden md:block bg-[#001529] text-neutral-200 py-2.5 px-8 border-b border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#0073B7]/10 to-transparent pointer-events-none"></div>
          <div className="max-w-[1440px] mx-auto flex justify-between items-center text-[9px] font-black uppercase tracking-[0.35em] relative z-10 px-4">
            <div className="flex gap-12 items-center">
              <Link href="/ficha-tecnica" className="hover:text-[#8CC63F] transition-all duration-300 hover:tracking-[0.45em]">Ficha Técnica</Link>
              <Link href="/editais" className="hover:text-[#0073B7] transition-all duration-300 hover:tracking-[0.45em] flex items-center gap-2">
                <span className="w-1 h-1 bg-[#0073B7] rounded-full shadow-[0_0_8px_#0073B7]"></span>
                Editais Ativos
              </Link>
            </div>
            <div className="flex gap-8 items-center text-neutral-400">
              <span className="font-bold">
                {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date())}
              </span>
              <div className="h-2.5 w-px bg-neutral-800"></div>
              <Link href="/admin" className="group flex items-center gap-2.5 text-white hover:text-[#8CC63F] transition-all">
                <span className="w-2 h-2 bg-[#8CC63F] rounded-full shadow-[0_0_12px_#8CC63F] group-hover:scale-125 transition-transform"></span>
                <span>Acesso Restrito</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. MASTHEAD (LOGO & CONTROLES) */}
      <div className={`max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between gap-6 transition-all duration-500 ${scrolled ? "py-2" : "py-5 md:py-8"}`}>
        
        {/* Lado Esquerdo */}
        <div className="flex items-center flex-1 lg:flex-none">
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-3 -ml-2 group hover:bg-neutral-50 rounded-2xl transition-all duration-300 relative overflow-hidden"
            aria-label="Menu"
          >
            <div className="flex flex-col gap-1.5 w-6 items-end">
              <span className="h-[2px] w-6 bg-neutral-950 rounded-full transition-all duration-300 group-hover:w-4 group-hover:bg-[#0073B7]"></span>
              <span className="h-[2px] w-4 bg-[#0073B7] rounded-full transition-all duration-300 group-hover:w-6 group-hover:bg-neutral-950"></span>
              <span className="h-[2px] w-6 bg-neutral-950 rounded-full transition-all duration-300 group-hover:w-3 group-hover:bg-[#8CC63F]"></span>
            </div>
            {/* Efeito de brilho sutil ao passar o mouse */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0073B7]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
          
          <div className="hidden lg:flex">
            <div className="flex items-center gap-3 border-2 border-[#0073B7]/5 px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.35em] text-[#0073B7] bg-[#0073B7]/5 shadow-[inset_0_2px_4px_rgba(0,115,183,0.05)]">
              <span className="w-2 h-2 bg-[#0073B7] rounded-full shadow-[0_0_15px_rgba(0,115,183,0.5)] animate-pulse"></span>
              Portal Oficial
            </div>
          </div>
        </div>

        {/* Centro - Logotipo Editorial com mais presença */}
        <div className="flex-1 flex justify-center lg:justify-center">
          <Link href="/" className="group flex flex-col items-center">
            <h1 className={`font-syne font-extrabold text-neutral-950 uppercase leading-none text-center select-none transition-all duration-500 ${scrolled ? "text-lg md:text-2xl tracking-[0.12em]" : "text-2xl md:text-4xl tracking-[0.08em] group-hover:tracking-[0.1em]"}`}>
              PORTAL <span className="text-[#0073B7] bg-clip-text text-transparent bg-gradient-to-br from-[#0073B7] via-[#00AEEF] to-[#0073B7] drop-shadow-[0_15px_30px_rgba(0,115,183,0.25)] transition-all duration-700 group-hover:brightness-110">DCE</span>
            </h1>
            {!scrolled && (
              <div className="flex items-center gap-4 mt-3.5 transition-all duration-500 opacity-100 group-hover:scale-105">
                <div className="h-[2px] w-8 md:w-12 bg-gradient-to-r from-transparent via-[#8CC63F] to-transparent rounded-full shadow-[0_0_10px_rgba(140,198,63,0.3)]"></div>
                <p className="text-[8px] md:text-[9px] font-black text-center uppercase tracking-[0.7em] md:tracking-[0.9em] text-neutral-500 group-hover:text-neutral-950 transition-all duration-500">
                  UFVJM
                </p>
                <div className="h-[2px] w-8 md:w-12 bg-gradient-to-l from-transparent via-[#8CC63F] to-transparent rounded-full shadow-[0_0_10px_rgba(140,198,63,0.3)]"></div>
              </div>
            )}
          </Link>
        </div>

        {/* Direita */}
        <div className="flex-1 lg:flex-none flex justify-end items-center">
          <div className="hidden lg:flex items-center gap-6 min-w-[200px] justify-end">
            {loadingWeather ? (
              <div className="h-10 w-28 animate-pulse"></div>
            ) : (
              weather && (
                <div className={`flex items-center gap-4 transition-all duration-700 group/w ${scrolled ? "scale-90 origin-right translate-x-2" : ""}`}>
                  <div className="text-right">
                    <p className="text-sm font-black text-neutral-950 leading-none tabular-nums group-hover/w:text-[#0073B7] transition-colors">{weather.temp}°C</p>
                    <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mt-1.5 max-w-[150px] truncate">{weather.city.split(',')[0]}</p>
                  </div>
                  <div className="transition-colors">
                    {renderWeatherIcon(weather.condition)}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* 3. PRIMARY NAVIGATION (Desktop) - Mais Evidenciada */}
      <div className={`hidden lg:block max-w-[1440px] mx-auto px-10 transition-all duration-500 ${scrolled ? "h-0 overflow-hidden opacity-0" : "h-14 opacity-100 border-t-2 border-neutral-50"}`}>
        <div className="flex justify-center items-center h-14">
          <div className="flex items-center justify-center gap-12">
            {menuItems.map((item) => {
              const active = item.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all relative py-2.5 group ${
                    active ? 'text-[#0073B7]' : 'text-neutral-500 hover:text-neutral-950'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  <span className={`absolute -bottom-[2px] left-0 h-[3px] transition-all duration-500 rounded-full ${
                    active 
                      ? 'w-full bg-gradient-to-r from-[#0073B7] to-[#00AEEF] shadow-[0_5px_15px_rgba(0,115,183,0.5)]' 
                      : 'w-0 bg-[#8CC63F] group-hover:w-full group-hover:shadow-[0_5px_15px_rgba(140,198,63,0.3)]'
                  }`}></span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div className={`fixed inset-0 z-[100] lg:hidden transition-all duration-500 ${isOpen ? "visible" : "invisible pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-neutral-950/60 backdrop-blur-xl transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsOpen(false)}></div>
        
        <div className={`absolute top-0 left-0 w-[300px] h-full bg-white flex flex-col border-r border-white/20 shadow-[40px_0_100px_rgba(0,0,0,0.2)] transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
          
          <div className="p-8 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[#0073B7] rounded-full"></div>
              <span className="text-sm font-black uppercase tracking-[0.4em] text-neutral-950">Menu</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-3 bg-white hover:bg-neutral-100 rounded-2xl transition-all active:scale-90 shadow-sm border border-neutral-200"
            >
              <svg className="w-5 h-5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-6 flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const active = item.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group relative flex items-center justify-between py-4 px-5 rounded-2xl transition-all duration-300 ${
                    active 
                      ? 'bg-[#0073B7] text-white shadow-[0_10px_20px_-5px_rgba(0,115,183,0.3)]' 
                      : 'text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50'
                  }`}
                >
                  <span className={`text-[10px] font-black uppercase tracking-[0.15em] transition-all ${active ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                    {item.name}
                  </span>
                  <svg 
                    className={`w-3.5 h-3.5 transition-all duration-500 ${active ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}
          </nav>

          <div className="p-8 border-t border-neutral-100 bg-neutral-50/30">
            <Link 
              href="/ficha-tecnica" 
              onClick={() => setIsOpen(false)}
              className="w-full py-4 bg-white border border-neutral-200 text-neutral-500 rounded-2xl text-[9px] font-black uppercase tracking-[0.25em] flex items-center justify-center gap-3 shadow-sm hover:text-[#0073B7] hover:border-[#0073B7]/30 hover:bg-[#0073B7]/5 transition-all active:scale-[0.98] group"
            >
              <span className="w-1.5 h-1.5 bg-neutral-300 rounded-full group-hover:bg-[#8CC63F] transition-colors"></span>
              <span>Ficha Técnica</span>
              <svg className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
