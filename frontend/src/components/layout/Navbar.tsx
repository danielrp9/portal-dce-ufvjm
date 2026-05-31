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
    <nav className={`w-full z-50 transition-all duration-700 ease-out ${
      scrolled 
        ? "fixed top-4 left-0 right-0 max-w-7xl mx-auto rounded-3xl bg-white/85 backdrop-blur-3xl border border-white/60 shadow-[0_30px_70px_-15px_rgba(0,115,183,0.12),0_10px_20px_-5px_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(255,255,255,0.8)] px-2" 
        : "relative bg-white border-b-2 border-[#0073B7]/10 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.06)]"
    }`}>
      
      {/* 1. TOP BAR (UTILITY) - Mais Vibrante */}
      {!scrolled && (
        <div className="hidden md:block bg-[#001529] text-neutral-200 py-2.5 px-6 border-b border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#0073B7]/10 to-transparent pointer-events-none"></div>
          <div className="max-w-7xl mx-auto flex justify-between items-center text-[9px] font-black uppercase tracking-[0.35em] relative z-10">
            <div className="flex gap-12 items-center">
              <Link href="/ficha-tecnica" className="hover:text-[#8CC63F] transition-all duration-300 hover:tracking-[0.45em]">Ficha Técnica</Link>
              <Link href="/editais" className="hover:text-[#0073B7] transition-all duration-300 hover:tracking-[0.45em] flex items-center gap-2">
                <span className="w-1 h-1 bg-[#0073B7] rounded-full shadow-[0_0_8px_#0073B7]"></span>
                Editais Abertos
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
      <div className={`max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between gap-6 transition-all duration-500 ${scrolled ? "py-2" : "py-5 md:py-8"}`}>
        
        {/* Lado Esquerdo */}
        <div className="flex items-center flex-1 lg:flex-none">
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-3 -ml-2 hover:bg-neutral-100 rounded-2xl transition-all shadow-sm active:scale-90 border border-transparent hover:border-neutral-200"
            aria-label="Menu"
          >
            <svg className="w-6 h-6 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
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
      <div className={`hidden lg:block max-w-7xl mx-auto px-10 transition-all duration-500 ${scrolled ? "h-0 overflow-hidden opacity-0" : "h-14 opacity-100 border-t-2 border-neutral-50"}`}>
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
        
        <div className={`absolute top-0 left-0 w-[320px] h-full bg-white/95 backdrop-blur-3xl p-10 flex flex-col border-r border-white/20 shadow-[40px_0_100px_rgba(0,0,0,0.2)] transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
          
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-[#0073B7] to-[#00AEEF] rounded-full shadow-[0_0_15px_rgba(0,115,183,0.5)]"></div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-neutral-950">Navegação</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-3 hover:bg-neutral-100 rounded-2xl transition-all active:scale-90 shadow-sm border border-neutral-100">
              <svg className="w-6 h-6 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="flex flex-col gap-3">
            {menuItems.map((item) => {
              const active = item.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-xs font-black uppercase tracking-[0.25em] py-5 px-6 rounded-2xl transition-all flex items-center relative group ${
                    active 
                      ? 'text-[#0073B7] bg-white shadow-[0_15px_30px_rgba(0,115,183,0.1)] border border-neutral-100 pl-8' 
                      : 'text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50/80 hover:pl-8'
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/4 h-1/2 w-1.5 bg-gradient-to-b from-[#0073B7] to-[#00AEEF] rounded-r-full shadow-[0_0_10px_rgba(0,115,183,0.4)]"></span>
                  )}
                  <span className="relative z-10 transition-all group-hover:tracking-[0.3em]">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-10 border-t border-neutral-100/80">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#F9FAFB] rounded-2xl flex items-center justify-center border border-neutral-100 shadow-sm">
                 <span className="text-xl">🎓</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-neutral-950 uppercase tracking-[0.1em]">DCE UFVJM</p>
                <p className="text-[9px] font-bold text-[#0073B7] uppercase tracking-[0.05em]">Voz dos Estudantes</p>
              </div>
            </div>
            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest leading-relaxed">
              Gestão <span className="text-neutral-600 font-black">2026</span><br/>
              Portal de Comunicação
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
