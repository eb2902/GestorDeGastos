// next.config.ts o next.config.js
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // En lugar de 'proxy', usamos 'rewrites' que es el estándar soportado
  async rewrites() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
      },
    ];
  },
};

export default nextConfig;