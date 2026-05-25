"use client";

import React from 'react';
import { Printer } from 'lucide-react';

export default function PrintButton() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <button
      onClick={handlePrint}
      type="button"
      className="p-3 bg-slate-50 text-slate-600 hover:bg-slate-950 hover:text-white transition-all rounded-sm flex items-center justify-center gap-2 print:hidden"
      aria-label="Imprimir notícia"
    >
      <Printer className="w-4 h-4" />
      <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Imprimir</span>
    </button>
  );
}