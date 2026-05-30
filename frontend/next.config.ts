import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Reativado para permitir que o Django sirva os arquivos estáticos da pasta 'out'
  trailingSlash: true,

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
      {
        protocol: 'https',
        hostname: '**', // Permite imagens de qualquer host HTTPS em produção
      },
    ],
  },
};

export default nextConfig;