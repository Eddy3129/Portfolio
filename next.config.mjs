/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      new URL('https://**.graphassets.com/**')
    ],
  },
};

export default nextConfig;
