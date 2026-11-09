/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 90], // Next 16 only serves listed qualities; 90 for the avatar
    remotePatterns: [
      new URL('https://**.graphassets.com/**')
    ],
  },
};

export default nextConfig;
