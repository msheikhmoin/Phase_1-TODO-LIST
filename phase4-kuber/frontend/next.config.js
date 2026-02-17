/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  distDir: "out",
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;