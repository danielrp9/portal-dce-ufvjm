import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  images: {
    // Permite carregar de IPs locais sem a trava de segurança do SSR
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
    // Adicione esta linha para evitar o erro de "private ip" em desenvolvimento
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;