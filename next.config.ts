/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      new URL('https://cdn.simpleicons.org/**'),
      new URL('https://meera.dev/**'),
      new URL('https://danyiar.com/**'),
    ],
  },
}
