import React from 'react';
import NoticiaDetailClient from '@/components/NoticiaDetailClient';

interface NoticiaDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [{ slug: 'detalhe' }];
}

export default async function NoticiaDetailPage({ params }: NoticiaDetailPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  return <NoticiaDetailClient slug={slug} />;
}
