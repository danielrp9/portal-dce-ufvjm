import React from 'react';
import EditalDetailClient from '@/components/EditalDetailClient';

interface EditalDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [{ slug: 'detalhe' }];
}

export default async function EditalDetailPage({ params }: EditalDetailPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  return <EditalDetailClient slug={slug} />;
}
