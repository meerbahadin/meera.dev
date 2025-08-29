import createMDX from '@next/mdx'

const nextConfig: import('next').NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  images: {
    remotePatterns: [
      new URL('https://cdn.simpleicons.org/**'),
      new URL('https://meera.dev/**'),
      new URL('https://danyiar.com/**'),
    ],
  },
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

export default withMDX(nextConfig)
