const nextConfig: import('next').NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'meera.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.meera.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'danyiar.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
