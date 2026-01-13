/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ye TypeScript ke errors (Kanjer-pana) ignore karega
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ye ESLint ki warnings ko ignore karega
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
