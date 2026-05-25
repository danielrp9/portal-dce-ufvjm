import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', 
  distDir: 'out', // Garante o nome da pasta de saída
  
  // CORREÇÃO ESSENCIAL: Altera o nome da pasta '_next' para 'assets' para o Django/WhiteNoise lerem sem travas
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