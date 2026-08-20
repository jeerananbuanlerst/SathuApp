/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'qzjtscqztphllkfyrgbw.supabase.co', // โดเมน Supabase ของคุณ
      },
    ],
  },
};

export default nextConfig;