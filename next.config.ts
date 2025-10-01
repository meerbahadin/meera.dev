import { remarkCodeHike } from '@code-hike/mdx'
import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

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
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm, [remarkCodeHike, { theme: 'css-variables' }]],
  },
})

export default withMDX(nextConfig)
