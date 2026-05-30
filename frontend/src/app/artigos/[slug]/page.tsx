import React from 'react';
import ArtigoDetailClient from '@/components/ArtigoDetailClient';

interface ArtigoDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [{ slug: 'detalhe' }];
}

export default async function ArtigoDetailPage({ params }: ArtigoDetailPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  return <ArtigoDetailClient slug={slug} />;
}
