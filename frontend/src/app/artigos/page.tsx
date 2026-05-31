"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ArtigosList from '@/components/ArtigosList';

export default function ArtigosPage() {
  return (
    <main className="min-h-screen bg-[#F0F2F5] text-neutral-900 selection:bg-[#0073B7] selection:text-white font-sans antialiased pb-32 relative overflow-hidden">
      
      {/* Elementos de Fundo */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#8CC63F]/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#0073B7]/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>

      {/* Breadcrumb */}
      <div className="w-full border-b border-neutral-200/60 mb-12 bg-white/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-5">
          <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            <Link href="/" className="hover:text-[#0073B7] transition-colors">Início</Link>
            <ChevronRight size={10} className="text-neutral-300" />
            <span className="text-neutral-950">Artigos e Opinião</span>
          </nav>
        </div>
      </div>

      <Suspense fallback={<div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0073B7]"></div></div>}>
        <ArtigosList />
      </Suspense>
      
    </main>
  );
}
