import React from 'react';
import NoticiaDetailClient from '@/components/NoticiaDetailClient';

// Troca o nome da pasta física gerada no build de '[slug]' para 'detalhe'
// Isso evita que os colchetes quebrem o carregador de templates do Django
export async function generateStaticParams() {
  return [{ slug: 'detalhe' }];
}

interface NoticiaDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function NoticiaDetailPage({ params }: NoticiaDetailPageProps) {
  const resolvedParams = await params;
  
  // Mantém a consistência de fallback seguro
  const currentSlug = resolvedParams?.slug || 'detalhe';

  return <NoticiaDetailClient slug={currentSlug} />;
}