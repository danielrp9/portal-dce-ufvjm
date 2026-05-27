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
  
  // Estados para localização e clima dinâmicos
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [loadingWeather, setLoadingWeather] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efeito para geolocalizar o usuário por IP e buscar o clima da cidade dele
  useEffect(() => {
    async function fetchLocalWeather() {
      try {
        // 1. Detecta a localização usando o ipapi.co (HTTPS nativo e seguro)
        const ipRes = await fetch('https://ipapi.co/json/');
        const ipData = await ipRes.json();
        
        // Define uma localização base caso a API de IP falhe
        let detectCity = "Diamantina";
        let detectRegion = "MG";

        if (ipData && !ipData.error) {
          detectCity = ipData.city;
          detectRegion = ipData.region_code;
        }

        // SEU TESTE: Se quiser forçar São Paulo para testar, descomente as duas linhas abaixo:
        // detectCity = "São Paulo";
        // detectRegion = "SP";

        // 2. Sua chave inserida diretamente e configurada em PT-BR
        const apiKey = '229319fb84e581895dcb8e357d82e11a'; 
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(detectCity)}&appid=${apiKey}&units=metric&lang=pt_br`
        );
        
        // Se a chave ainda não estiver ativa, este bloco vai capturar e pular para o catch
        if (!weatherRes.ok) {
          const errorData = await weatherRes.json();
          throw new Error(`OpenWeather Erro: ${weatherRes.status} - ${errorData.message}`);
        }
        
        const weatherData = await weatherRes.json();

        // 3. Mapeia o id do clima para as categorias visuais simplificadas
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
        // Exibe o motivo real da falha no console para sua auditoria técnica
        console.error("⚠️ Alerta Clima:", error);
        
        // Fallback robusto para manter o visual do portal sempre estável
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
    switch (condition) {
      case 'rain':
      case 'thunderstorm':
        return (
          <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center shadow-inner transition-all">
            <svg className="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        );
      case 'clouds':
        return (
          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center shadow-inner transition-all">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
        );
      case 'clear':
      default:
        return (
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-inner transition-all">
            <svg className="w-5 h-5 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          </div>
        );
    }
  };

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
        
        {/* Lado Esquerdo */}
        <div className="flex items-center flex-1 lg:flex-none">
          <div className="hidden lg:flex">
            <button className="flex items-center gap-3 bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-tighter hover:bg-[#0073B7] transition-colors font-sans">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              Informativo DCE
            </button>
          </div>
          
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

        {/* Direita: Weather (Desktop) */}
        <div className="flex-1 lg:flex-none flex justify-end items-center">
          <div className="hidden lg:flex flex-col items-end gap-1 min-w-[140px]">
            {loadingWeather ? (
              <div className="flex items-center gap-3 animate-pulse">
                <div className="text-right">
                  <div className="h-3 w-8 bg-slate-200 rounded-xs mb-1 ml-auto"></div>
                  <div className="h-2 w-16 bg-slate-200 rounded-xs"></div>
                </div>
                <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
              </div>
            ) : (
              weather && (
                <div className="flex items-center gap-3 transition-opacity duration-300">
                   <div className="text-right font-sans">
                      <p className="text-[11px] font-black text-black leading-none">{weather.temp}°C</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter line-clamp-1">{weather.city}</p>
                   </div>
                   {renderWeatherIcon(weather.condition)}
                </div>
              )
            )}
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
              const active = item.href === '/' 
                ? pathname === '/' 
                : pathname?.startsWith(item.href);

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

      {/* MOBILE MENU OVERLAY */}
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
              {menuItems.map((item) => {
                const active = item.href === '/' 
                  ? pathname === '/' 
                  : pathname?.startsWith(item.href);

                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-xl font-serif font-black italic border-b border-black/5 pb-2 ${
                      active ? 'text-[#0073B7]' : 'text-black hover:text-[#0073B7]'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
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