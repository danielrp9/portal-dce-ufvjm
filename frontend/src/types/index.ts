export interface Noticia {
  id: number;
  titulo: string;
  slug: string;
  autor: string;
  capa: string;
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
}

export interface Documento {
  id: number;
  titulo: string;
  arquivo: string;
  tipo: 'EDITAL' | 'TRANSPARENCIA' | 'INSTITUCIONAL';
  data_upload: string;
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