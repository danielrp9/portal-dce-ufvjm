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
    { name: 'Home', href: '/' },
    { name: 'Notícias', href: '/noticias' },
    { name: 'Editais', href: '/documentos' },
    { name: 'Eventos', href: '/eventos' },
    { name: 'Transparência', href: '/transparencia' },
    { name: 'Sobre o DCE', href: '/sobre' },
  ];

  const renderWeatherIcon = (condition: WeatherState['condition']) => {
    const baseClass = "w-7 h-7 rounded-full flex items-center justify-center border border-neutral-200 text-neutral-700 bg-neutral-50 shadow-2xs";
    switch (condition) {
      case 'rain':
      case 'thunderstorm':
        return (
          <div className={baseClass}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        );
      case 'clouds':
        return (
          <div className={baseClass}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
        );
      case 'clear':
      default:
        return (
          <div className={baseClass}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <nav className={`w-full z-50 bg-white/95 backdrop-blur-md transition-all duration-300 border-b border-neutral-200/60 ${scrolled ? "fixed top-0 shadow-xs" : "relative"}`}>
      
      {/* 1. TOP BAR (UTILITY) */}
      <div className="bg-neutral-950 text-neutral-300 py-2 px-6 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] font-sans">
          <div className="flex gap-6 items-center">
            <Link href="/contato" className="hover:text-white transition-colors">Contato</Link>
            <Link href="/carreiras" className="hidden sm:inline hover:text-white transition-colors">Oportunidades</Link>
          </div>
          <div className="flex gap-6 items-center">
            <span className="hidden md:inline font-normal text-neutral-500">
              {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date())}
            </span>
            <Link href="http://127.0.0.1:8000/admin" className="flex items-center gap-2 hover:text-white transition-colors">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span>Painel Administrativo</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MASTHEAD (LOGO & CONTROLES) */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between gap-4">
        
        {/* Lado Esquerdo */}
        <div className="flex items-center flex-1 lg:flex-none">
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-2 -ml-2 hover:bg-neutral-100 rounded-full transition-colors"
            aria-label="Abrir Menu"
          >
            <svg className="w-5 h-5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="hidden lg:flex">
            <div className="flex items-center gap-2.5 border border-neutral-200 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-neutral-500 bg-neutral-50/50">
              <span className="w-1.5 h-1.5 bg-neutral-950 rounded-full"></span>
              Informativo Geral
            </div>
          </div>
        </div>

        {/* Centro - Logotipo Editorial de Alto Impacto */}
        <div className="flex-1 flex justify-center lg:justify-center">
          <Link href="/">
            <h1 className="text-xl md:text-3xl font-sans font-black tracking-[0.16em] text-neutral-950 uppercase leading-none text-center select-none">
              PORTAL <span className="text-neutral-400 font-light">DCE</span>
            </h1>
          </Link>
        </div>

        {/* Direita */}
        <div className="flex-1 lg:flex-none flex justify-end items-center">
          <div className="hidden lg:flex items-center gap-3 min-w-[150px] justify-end">
            {loadingWeather ? (
              <div className="flex items-center gap-2 animate-pulse">
                <div className="text-right">
                  <div className="h-2.5 w-8 bg-neutral-200 rounded-xs mb-1 ml-auto"></div>
                  <div className="h-2 w-14 bg-neutral-100 rounded-xs"></div>
                </div>
                <div className="w-7 h-7 bg-neutral-100 rounded-full"></div>
              </div>
            ) : (
              weather && (
                <div className="flex items-center gap-3 transition-opacity duration-300">
                  <div className="text-right font-sans">
                    <p className="text-[11px] font-bold text-neutral-950 leading-none">{weather.temp}°C</p>
                    <p className="text-[9px] font-semibold text-neutral-400 uppercase tracking-tight mt-0.5 max-w-[110px] truncate">{weather.city}</p>
                  </div>
                  {renderWeatherIcon(weather.condition)}
                </div>
              )
            )}
          </div>

          <button className="lg:hidden p-2 -mr-2 hover:bg-neutral-100 rounded-full transition-colors" aria-label="Pesquisar">
            <svg className="w-5 h-5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 3. PRIMARY NAVIGATION (Desktop) */}
      <div className="hidden lg:block max-w-7xl mx-auto px-6 border-t border-neutral-100">
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center justify-center w-full gap-10">
            {menuItems.map((item) => {
              const active = item.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-[10px] font-bold uppercase tracking-[0.25em] transition-all relative py-2 group font-sans ${
                    active ? 'text-neutral-950' : 'text-neutral-400 hover:text-neutral-950'
                  }`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-neutral-950 transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              );
            })}
          </div>

          <button className="p-2 text-neutral-400 hover:text-neutral-950 transition-colors" aria-label="Search">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-neutral-950/30 backdrop-blur-xs" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-0 left-0 w-[280px] h-full bg-white p-8 flex flex-col border-r border-neutral-200/60 shadow-2xl transition-all">
            <div className="flex justify-between items-center mb-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Navegação</span>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                <svg className="w-5 h-5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <nav className="flex flex-col gap-5">
              {menuItems.map((item) => {
                const active = item.href === '/'
                  ? pathname === '/'
                  : pathname?.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-xs font-bold uppercase tracking-[0.15em] py-2 border-b border-neutral-100 ${
                      active ? 'text-neutral-950' : 'text-neutral-400 hover:text-neutral-950'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto">
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest leading-relaxed">
                DCE UFVJM<br/>
                <span className="font-semibold text-neutral-950">Gestão 2026</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}