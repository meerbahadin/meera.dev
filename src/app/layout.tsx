import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Meer - Front End Developer',
  description: `Hi, I'm Meer, A front-end developer specializing in React, Next.js. welcome to my corner of the Internet, where I showcase my work, craft, unfinished or imperfect projects, and the many other things I'm exploring.`,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className='dark text-foreground bg-background'>
      <body>{children}</body>
    </html>
  )
}
