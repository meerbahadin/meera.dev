import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Fira_Code } from 'next/font/google'

const fira = Fira_Code({
  subsets: ['latin'],
})

import './globals.css'

export const metadata: Metadata = {
  title: 'Meer - Front End Developer',
  description: `Hi, I'm Meer, A front-end developer specializing in React, Next.js. welcome to my corner of the Internet, where I showcase my work, craft, unfinished or imperfect projects, and the many other things I'm exploring.`,
  metadataBase: new URL('https://www.meera.dev/'),
  openGraph: {
    type: 'website',
    url: 'https://www.meera.dev/',
    title: 'Meer - Front End Developer',
    description: `Hi, I'm Meer, A front-end developer specializing in React, Next.js. welcome to my corner of the Internet, where I showcase my work, craft, unfinished or imperfect projects, and the many other things I'm exploring.`,
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Meer - Front End Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meer - Front End Developer',
    description: `Hi, I'm Meer, A front-end developer specializing in React, Next.js. welcome to my corner of the Internet, where I showcase my work, craft, unfinished or imperfect projects, and the many other things I'm exploring.`,
    images: ['/og.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      className={`dark text-foreground bg-background ${fira.className} antialiased`}
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
