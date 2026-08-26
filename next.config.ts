import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  experimental: {
    // 型検査は TS6 の JS API を使う（tsc は TS7 側にあり Next から見つからないため）
    useTypeScriptCli: false,
  },
};

export default nextConfig;
