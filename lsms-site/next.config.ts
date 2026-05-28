/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Vercel derleme yaparken TypeScript hatalarını görmezden gelir
    ignoreBuildErrors: true,
  },
  eslint: {
    // Vercel derleme yaparken ESLint uyarılarını görmezden gelir
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;