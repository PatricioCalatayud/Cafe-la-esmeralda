/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'images.pexels.com',
          },
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
          },
        ],
        domains: ['www.cafelaesmeralda.com.ar'],
      },
};

export default nextConfig;
