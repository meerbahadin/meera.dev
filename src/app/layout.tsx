import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Meer | Front-End Developer',
  description: `Hi, I'm Meer — a front-end developer specializing in React, Next.js, Tailwind CSS. welcome to my corner of the Internet, where I showcase my work, craft, unfinished or imperfect projects, and the many other things I'm exploring.`,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className='dark text-foreground bg-background'>{children}</body>
    </html>
  )
}
