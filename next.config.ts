import createMDX from '@next/mdx'

const nextConfig: import('next').NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

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

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

export default withMDX(nextConfig)
