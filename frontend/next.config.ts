import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Força o Next.js a gerar uma pasta com arquivos estáticos (HTML/CSS/JS)
  
  // CORREÇÃO DE ROTAS ESTÁTICAS: Faz o Next gerar pastas individuais para cada rota (ex: out/noticias/index.html)
  // Isso resolve permanentemente o conflito de roteamento híbrido no Django
  trailingSlash: true,
  
  assetPrefix: '/static/', 

  reactCompiler: true, 
  images: {
    unoptimized: true, 
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;