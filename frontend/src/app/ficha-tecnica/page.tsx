import React from 'react';
import Link from 'next/link';
import { 
  Server, 
  Code2, 
  Database, 
  GitBranch,
  ChevronRight,
  MonitorSmartphone,
  Layers,
  Sparkles,
  Wrench,
  Bug
} from 'lucide-react';

export default function FichaTecnicaPage() {
  const versions = [
    {
      version: "2.0.0",
      date: "31/05/2026",
      status: "Atual",
      categories: [
        {
          title: "Novidades",
          icon: Sparkles,
          color: "text-amber-500",
          items: [
            "Implementação de espaço dedicado para artigos de opinião e editoriais.",
            "Criação de página específica para agenda de eventos do DCE.",
            "Adição de filtros de busca e tags de identificação na seção de notícias (por campus e assunto).",
            "Inclusão de filtros por exercício na transparência financeira."
          ]
        },
        {
          title: "Melhorias",
          icon: Wrench,
          color: "text-[#0073B7]",
          items: [
            "Reescrita completa do núcleo do sistema (Versão 2.0).",
            "Remodelagem total da interface com foco em alto contraste e diretrizes de acessibilidade.",
            "Separação técnica entre os módulos de Documentos e Editais para maior precisão administrativa.",
            "Automação do processo de fechamento de exercício financeiro, garantindo a integridade de saldos e dívidas entre exercícios e prevenindo inconsistências de dados."
          ]
        }
      ]
    },
    {
      version: "1.0.0",
      date: "01/01/2025",
      status: "Legado",
      categories: [
        {
          title: "Novidades",
          icon: Sparkles,
          color: "text-amber-500",
          items: [
            "Lançamento inicial do portal do DCE UFVJM.",
            "Módulo de notícias e transparência financeira básica.",
            "Repositório central de arquivos."
          ]
        }
      ]
    }
  ];

  const technologies = [
    {
      category: "Frontend",
      icon: MonitorSmartphone,
      items: ["Next.js 15 (App Router)", "React 19", "TypeScript", "Tailwind CSS", "Lucide Icons"]
    },
    {
      category: "Backend",
      icon: Code2,
      items: ["Python 3.12", "Django 5.1", "Django REST Framework", "Simple JWT (Auth)"]
    },
    {
      category: "Banco de Dados",
      icon: Database,
      items: ["PostgreSQL", "Cloudinary (Storage)"]
    },
    {
      category: "Infraestrutura",
      icon: Server,
      items: ["Servidores PROTIC UFVJM", "Docker (Containerização)", "Vercel (Frontend Edge)"]
    }
  ];

  return (
    <main className="min-h-screen bg-[#F0F2F5] text-neutral-900 selection:bg-[#0073B7] selection:text-white font-sans antialiased pb-32">
      
      {/* 1. BREADCRUMB */}
      <div className="w-full bg-white border-b border-neutral-200 mb-12 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            <Link href="/" className="hover:text-[#0073B7] transition-colors">Início</Link>
            <ChevronRight size={10} className="text-neutral-300" />
            <span className="text-neutral-900 font-black">Ficha Técnica</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-[2px] bg-[#0073B7]"></div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0073B7]">
              Documentação Técnica
            </h3>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral-950 uppercase mb-6">
            Ficha <span className="text-[#0073B7]">Técnica</span>
          </h1>
          <p className="text-lg text-neutral-500 max-w-2xl font-bold leading-relaxed">
            Especificações da arquitetura, stack tecnológica e histórico de evolução do Portal DCE UFVJM.
          </p>
        </div>

        {/* 2. INFRAESTRUTURA */}
        <section className="mb-20">
          <div className="bg-[#001529] rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0073B7]/20 blur-[80px] rounded-full"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center border border-white/10 shadow-inner">
                <Server size={40} className="text-[#8CC63F]" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8CC63F] mb-3">Hospedagem Institucional</h4>
                <h2 className="text-2xl md:text-3xl font-black mb-4 uppercase tracking-tight">
                  Servidores <span className="text-[#0073B7]">PROTIC UFVJM</span>
                </h2>
                <p className="text-neutral-300 font-bold leading-relaxed opacity-90">
                  O sistema está lotado na infraestrutura da Pró-Reitoria de Tecnologia da Informação e Comunicação, garantindo integração com a rede acadêmica oficial.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. TECH STACK GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {technologies.map((tech, idx) => (
            <div key={idx} className="bg-white rounded-[2rem] p-8 border border-neutral-200 shadow-lg hover:shadow-xl transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#F8FAFC] rounded-2xl flex items-center justify-center border border-neutral-100 group-hover:bg-[#0073B7] group-hover:text-white transition-all shadow-sm">
                  <tech.icon size={24} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{tech.category}</h4>
              </div>
              <ul className="space-y-3">
                {tech.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[11px] font-black text-neutral-900 uppercase tracking-tight">
                    <div className="w-1.5 h-1.5 bg-[#8CC63F] rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 4. HISTÓRICO DE VERSÕES (ESTILO E-CAMPUS) */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-12">
            <GitBranch size={24} className="text-[#0073B7]" />
            <h3 className="text-xl font-black uppercase tracking-widest text-neutral-950">Novidades da versão</h3>
            <div className="h-px flex-1 bg-neutral-200"></div>
          </div>

          <div className="space-y-12">
            {versions.map((v, idx) => (
              <div key={idx} className="relative pl-8 md:pl-12 border-l-4 border-neutral-200 pb-4 last:border-0">
                <div className="absolute -left-[14px] top-0 w-6 h-6 bg-white border-4 border-[#0073B7] rounded-full shadow-sm"></div>
                
                <div className="mb-8">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                    <h4 className="text-2xl font-black text-neutral-950">Versão {v.version}</h4>
                    <span className="hidden md:block text-neutral-300">|</span>
                    <p className="text-sm font-black text-neutral-400 uppercase tracking-widest">Data {v.date}</p>
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      v.status === 'Atual' ? 'bg-[#8CC63F] text-neutral-950' : 'bg-neutral-200 text-neutral-50'
                    }`}>
                      {v.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-10">
                  {v.categories.map((cat, cIdx) => (
                    <div key={cIdx} className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-neutral-100 shadow-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-neutral-50 rounded-bl-[4rem] flex items-center justify-center group-hover:bg-white transition-colors">
                        <cat.icon size={32} className={`${cat.color} opacity-20`} />
                      </div>
                      
                      <div className="flex items-center gap-4 mb-8">
                        <cat.icon size={20} className={cat.color} />
                        <h5 className={`text-sm font-black uppercase tracking-[0.3em] ${cat.color}`}>{cat.title}</h5>
                      </div>

                      <ul className="space-y-4">
                        {cat.items.map((item, iIdx) => (
                          <li key={iIdx} className="flex items-start gap-4 text-[13px] font-bold text-neutral-600 leading-relaxed">
                            <ChevronRight size={16} className={`${cat.color} mt-0.5 shrink-0`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. ARQUITETURA */}
        <section className="bg-neutral-950 rounded-[3rem] p-10 md:p-16 text-white mb-24 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0073B7]/10 to-transparent pointer-events-none"></div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Layers size={40} className="text-[#8CC63F] mb-8" />
              <h4 className="text-3xl font-black mb-6 uppercase tracking-tight leading-tight">Arquitetura <br/><span className="text-[#0073B7]">Desacoplada</span></h4>
              <p className="text-neutral-400 font-bold leading-relaxed text-sm">
                O portal utiliza comunicação via API REST entre o motor Django (Backend) e a interface Next.js (Frontend), permitindo independência tecnológica e otimização específica para cada camada do sistema.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center">
                  <div className="text-3xl font-black text-[#8CC63F] mb-1 tracking-tighter">98+</div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Performance</p>
               </div>
               <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center">
                  <div className="text-3xl font-black text-[#0073B7] mb-1 tracking-tighter">100%</div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Acessível</p>
               </div>
            </div>
          </div>
        </section>

        {/* FOOTER DA FICHA */}
        <div className="text-center pt-12 border-t border-neutral-200">
          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.5em] mb-6">
            DCE UFVJM • Gestão 2026
          </p>
          <div className="flex justify-center gap-8">
             <Link href="/sobre" className="text-[10px] font-black uppercase tracking-widest text-[#0073B7] hover:underline">Sobre o DCE</Link>
             <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-[#0073B7] hover:underline">Início</Link>
          </div>
        </div>

      </div>
    </main>
  );
}
