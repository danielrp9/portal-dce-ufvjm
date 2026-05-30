"use client";

import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

export default function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error("Erro ao reproduzir áudio:", error);
      });
    }
  };

  return (
    <section className="relative w-full overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-8 bg-white/70 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 border border-white/40 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.7)] group">
        
        <audio ref={audioRef} src="https://radio.dicom.ufvjm.edu.br/live" preload="none" />

        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#0073B7]/5 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-[#8CC63F]/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="flex-1 flex flex-col gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 shadow-sm">
              <span className={`w-2 h-2 bg-red-600 rounded-full ${isPlaying ? 'animate-pulse' : ''} shadow-[0_0_8px_rgba(220,38,38,0.5)]`}></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">
                {isPlaying ? 'Transmitindo' : 'Disponível'}
              </span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Destaque Cultural</span>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-neutral-950 leading-tight">
            Rádio Universitária <br/>
            <span className="text-[#0073B7] bg-clip-text text-transparent bg-gradient-to-r from-[#0073B7] to-[#00AEEF]">UFVJM</span>
          </h2>
          
          <p className="text-sm text-neutral-500 font-medium max-w-md leading-relaxed">
            Acompanhe a programação completa, notícias do campus e o melhor da música universitária diretamente pelo nosso portal oficial.
          </p>
        </div>

        <div className="w-full md:w-[480px] relative z-10">
          <div className="relative p-3 rounded-[2rem] bg-gradient-to-br from-neutral-100 to-white shadow-[0_20px_40px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,0.8)] border border-neutral-200/50 group-hover:shadow-[0_25px_50px_rgba(0,115,183,0.1)] transition-all duration-500">
            
            <div className="flex justify-center gap-1.5 mb-3 h-5 items-end px-4">
              {[...Array(18)].map((_, i) => {
                const durations = ['0.6s', '0.8s', '0.5s', '0.7s', '0.9s', '0.4s'];
                const duration = durations[i % durations.length];
                return (
                  <div 
                    key={i} 
                    className={`w-1 bg-[#0073B7]/80 rounded-full transition-all duration-300 ${isPlaying ? 'animate-bounce' : 'h-1'}`}
                    style={{ 
                      height: isPlaying ? `${30 + Math.random() * 70}%` : '4px', 
                      animationDuration: isPlaying ? duration : '0s'
                    }}
                  ></div>
                );
              })}
            </div>

            <div className="relative h-[72px] w-full bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 shadow-[inset_0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-between px-6">
              
              <div className="flex flex-col z-10">
                <span className="text-[10px] font-black tracking-widest text-[#8CC63F] uppercase">
                  {isPlaying ? "LIVE STREAMING" : "RÁDIO OFICIAL"}
                </span>
                <span className="text-sm font-bold text-white tracking-tight mt-0.5">
                  {isPlaying ? "Ouvindo Agora..." : "Clique para iniciar"}
                </span>
              </div>

              <button 
                onClick={togglePlay}
                className={`z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border shadow-lg ${
                  isPlaying 
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700' 
                    : 'bg-[#0073B7] hover:bg-[#005a92] text-white border-[#0073B7]/20 scale-105 hover:scale-110'
                }`}
                aria-label={isPlaying ? "Pausar Rádio" : "Tocar Rádio"}
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} className="ml-0.5" fill="currentColor" />}
              </button>

              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-30 pointer-events-none"></div>
            </div>

            <div className="flex justify-between items-center px-4 py-2.5 mt-1 relative z-20">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-300/80 shadow-inner"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-300/80 shadow-inner"></div>
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isPlaying ? 'bg-[#8CC63F] shadow-[0_0_8px_rgba(140,198,63,0.8)]' : 'bg-neutral-300'}`}></div>
              </div>
              
              <div className="text-[8px] font-black text-neutral-400 uppercase tracking-[0.35em] select-none">
                Broadcast Control
              </div>
              
              <div className="flex items-center gap-2 text-neutral-400">
                <Volume2 size={12} className={isPlaying ? 'text-[#0073B7]' : ''} />
                <div className="h-1 w-10 bg-neutral-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${isPlaying ? 'w-full bg-[#0073B7]' : 'w-1/3 bg-neutral-300'}`}></div>
                </div>
              </div>
            </div>

          </div>
          
          <div className={`absolute -inset-4 bg-gradient-to-r from-[#0073B7]/10 to-[#8CC63F]/10 blur-3xl -z-10 rounded-full transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-40'}`}></div>
        </div>
      </div>
    </section>
  );
}
