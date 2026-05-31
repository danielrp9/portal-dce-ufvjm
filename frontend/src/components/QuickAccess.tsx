import React from 'react';
import Link from 'next/link';
import { 
  Landmark, 
  MessageSquareQuote, 
  GraduationCap, 
  Users, 
  HeartHandshake, 
  Calendar 
} from 'lucide-react';

const quickLinks = [
  {
    title: 'Pró-reitorias',
    href: 'https://portal.ufvjm.edu.br/a-universidade/pro-reitorias',
    icon: Landmark,
    description: 'Gestão e Administração'
  },
  {
    title: 'Ouvidoria',
    href: 'https://portal.ufvjm.edu.br/ouvidoria',
    icon: MessageSquareQuote,
    description: 'Sugestões e Reclamações'
  },
  {
    title: 'e-Campus',
    href: 'https://ecampus.ufvjm.edu.br/',
    icon: GraduationCap,
    description: 'Portal do Discente'
  },
  {
    title: 'Conselhos',
    href: 'https://portal.ufvjm.edu.br/conselhos',
    icon: Users,
    description: 'Órgãos Deliberativos'
  },
  {
    title: 'Assistência Estudantil',
    href: 'https://portal.ufvjm.edu.br/editais/categorias/graduacao/assistencia-estudantil',
    icon: HeartHandshake,
    description: 'Apoio e Permanência'
  },
  {
    title: 'Calendário Acadêmico',
    href: 'https://portal.ufvjm.edu.br/prograd/ensino/calendario-academico',
    icon: Calendar,
    description: 'Datas e Prazos'
  }
];

const QuickAccess: React.FC = () => {
  return (
    <section className="w-full relative py-10 md:py-16 mt-8 overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-gradient-to-br from-[#001529] via-[#000d1a] to-black shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/5">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full -mr-48 -mt-48 pointer-events-none opacity-40"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#8CC63F]/5 blur-[100px] rounded-full -ml-48 -mb-48 pointer-events-none opacity-40"></div>
      
      <div className="relative z-10 px-6 md:px-12">
        <div className="mb-8 md:mb-12 text-center lg:text-left">
          <div className="inline-block px-3 py-1 rounded-full bg-[#8CC63F]/10 border border-[#8CC63F]/20 mb-3">
            <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-[#8CC63F]">
              Atalhos Institucionais
            </h2>
          </div>
          <h3 className="text-xl md:text-4xl font-black text-white tracking-tight leading-tight">
            Acesso Rápido a Serviços
          </h3>
          <p className="mt-3 text-xs md:text-sm text-blue-200/60 max-w-xl font-medium leading-relaxed">
            Conecte-se rapidamente às principais plataformas e sistemas essenciais da UFVJM.
          </p>
        </div>

        {/* Grid Responsiva com proporções ajustadas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-5">
          {quickLinks.map((link, index) => (
            <Link 
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center p-6 md:p-8 bg-white/5 hover:bg-white/[0.08] rounded-[2rem] border border-white/10 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(0,115,183,0.3)] min-h-[220px] relative overflow-hidden"
            >
              {/* Efeito de luz sutil no hover */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#0073B7]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
              
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0073B7] group-hover:text-white transition-all duration-500 border border-white/5 shadow-inner">
                <link.icon className="w-7 h-7 text-[#8CC63F] group-hover:text-white transition-colors duration-500" />
              </div>
              
              <div className="flex flex-col items-center text-center w-full relative z-10">
                <h4 className="text-white text-[11px] font-black uppercase tracking-[0.2em] leading-snug">
                  {link.title}
                </h4>
                
                <div className="h-[2px] w-6 group-hover:w-12 bg-[#8CC63F] transition-all duration-500 rounded-full mt-3 shadow-[0_0_15px_rgba(140,198,63,0.6)]"></div>
                
                <span className="mt-4 text-[9px] text-blue-300/60 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 max-w-[120px]">
                  {link.description}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickAccess;
