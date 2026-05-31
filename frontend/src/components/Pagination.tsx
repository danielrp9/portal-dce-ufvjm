"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-16">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-3 rounded-xl border border-neutral-200 bg-white text-neutral-500 hover:border-[#0073B7] hover:text-[#0073B7] disabled:opacity-30 disabled:hover:border-neutral-200 disabled:hover:text-neutral-500 transition-all shadow-sm"
      >
        <ChevronLeft size={20} strokeWidth={3} />
      </button>

      <div className="flex gap-2">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black transition-all shadow-sm border ${
              currentPage === page
                ? 'bg-[#0073B7] border-[#0073B7] text-white'
                : 'bg-white border-neutral-200 text-neutral-500 hover:border-[#0073B7] hover:text-[#0073B7]'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-3 rounded-xl border border-neutral-200 bg-white text-neutral-500 hover:border-[#0073B7] hover:text-[#0073B7] disabled:opacity-30 disabled:hover:border-neutral-200 disabled:hover:text-neutral-500 transition-all shadow-sm"
      >
        <ChevronRight size={20} strokeWidth={3} />
      </button>
    </div>
  );
}
