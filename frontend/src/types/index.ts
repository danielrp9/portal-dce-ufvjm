export interface Noticia {
  id: number;
  titulo: string;
  slug: string;
  autor: string;
  capa: string;
  conteudo: string;
  campus: string;
  campus_display?: string;
  tags: string;
  data_publicacao: string;
}

export interface Artigo {
  id: number;
  titulo: string;
  slug: string;
  autor: string;
  resumo: string;
  conteudo: string;
  data_publicacao: string;
}

export interface Evento {
  id: number;
  titulo: string;
  banner: string;
  descricao: string;
  local: string;
  data_hora: string;
  link_ingresso?: string;
  ativo: boolean;
}

export interface Documento {
  id: number;
  titulo: string;
  arquivo: string;
  tipo: 'TRANSPARENCIA' | 'INSTITUCIONAL';
  data_upload: string;
}

export interface DocumentoEdital {
  id: number;
  titulo: string;
  arquivo?: string;
  link?: string;
  data_publicacao: string;
}

export interface Edital {
  id: number;
  titulo: string;
  slug: string;
  descricao: string;
  campus: string;
  campus_display?: string;
  data_publicacao: string;
  ativo: boolean;
  documentos: DocumentoEdital[];
}

export interface ResumoFinanceiro {
  total_entrada: number;
  total_saida: number;
  saldo: number;
  status: 'AZUL' | 'VERMELHO';
}

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: 'ENTRADA' | 'SAIDA';
  data: string;
  categoria?: string;
  comprovante?: string;
}