/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'andreferreira-nextlevel-food-demo.s3.eu-central-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
// https://andreferreira-nextlevel-food-demo.s3.eu-central-1.amazonaws.com