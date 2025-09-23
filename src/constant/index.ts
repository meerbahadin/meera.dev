import { Experience, RecentWork } from '@/types'

export const EXPERIENCES: Experience[] = [
  {
    year: 'Apr 2025 - {{current}}', // will be replaced by a green dot
    title: 'Frontend Engineering Manager',
    company: 'ruyat tech',
    items: [
      {
        text: 'Led the development of a comprehensive digital wallet platform—including mobile app, business dashboard, and KYC identity verification—and personally built the web application frontend.',
        tech: [
          'React',
          'Vite',
          'WebAuthn',
          'Tailwind CSS',
          'Google Mediapipe',
          'Tanstack Query',
        ],
      },
      {
        text: 'Created a lightweight internal face liveness detection library using google mediapipe',
        tech: ['Google Mediapipe'],
      },
    ],
  },
  {
    year: 'Sep 2021 - Mar 2025',
    title: 'Frontend Developer → Senior → Lead',
    company: 'netspot solutions',
    roles: [
      {
        title: 'Lead Frontend Developer (Feb 2024 - Mar 2025)',
        items: [
          {
            text: 'Developed a custom support application using Next.js with the App Router and Server-Side Rendering (SSR) to deliver ultra-fast, SEO-friendly performance.',
            tech: ['Next.js', 'Tailwind CSS', 'Hero UI', 'App Router', 'SSR'],
          },
          {
            text: 'Built a Kanban-style feedback system using Next.js and DnD Kit to track features and issues with intuitive drag-and-drop functionality.',
            tech: ['Dnd Kit', 'Tailwind', 'App Router'],
          },
          {
            text: 'Developed a WebAuthn-based passkey server for biometric authentication using Node.js and MongoDB.',
            tech: ['Node.js', 'MongoDB', 'WebAuthn', 'Backend'],
          },
          {
            text: 'Refactored and enhanced the company website with animated SVGs and optimized interactive 3D scenes using Spline and React Three Fiber.',
            tech: [
              'Spline',
              'Motion',
              'React Three Fiber',
              'Next.js',
              'App Router',
              'SSR',
            ],
          },
          {
            text: 'Led a frontend team of 5+ developers, reviewing pull requests and monitoring application health and performance.',
            tech: [],
          },
        ],
      },
      {
        title: 'Senior Frontend Developer (Feb 2023 - Jan 2024)',
        items: [
          {
            text: 'Built the frontend of a centralized account management system with SSO, user role support, KYC verification, face liveness detection, and advanced webcam integration—enabling seamless authentication across multiple connected apps.',
            tech: ['Next.js', 'Tailwind Css', 'Google Mediapipe'],
          },
          {
            text: "Developed the company's marketing website using Next.js, Lottie, and custom SVG animations.",
            tech: ['Next.js', 'Lottie', 'SVG'],
          },
          {
            text: 'Contributed to multiple production apps across the company.',
            tech: [],
          },
        ],
      },

      {
        title: 'Frontend Developer (Sep 2021 - Jan 2023)',
        items: [
          {
            text: 'Rewrote the 4G LTE mobile-first self-care application using Next.js with Progressive Web App (PWA) architecture for 500K+ users.',
            tech: [
              'Next.js',
              'Chakra UI',
              'useSWR',
              'next-auth',
              'Firebase Cloud Messaging',
            ],
          },
          {
            text: 'Developed a warehouse management app to track and manage orders from warehouse to point-of-sale, featuring role-based access and smooth UI animations.',
            tech: [
              'Next.js',
              'Chakra UI',
              'useSWR',
              'next-auth',
              ' Motion',
              'FCM',
            ],
          },
        ],
      },
    ],
  },
  {
    year: 'Oct  2020 - Sep 2021',
    title: 'Full Stack Developer',
    company: 'click',
    items: [
      {
        text: 'Built a fast, responsive blog website using Next.js with Incremental Static Regeneration (ISR).',
        tech: ['Next.js', 'ISR'],
      },
      {
        text: 'Developed a fully custom backend for blog management using Node.js and MongoDB.',
        tech: ['Node.js', 'MongoDB'],
      },
      {
        text: 'Contributed to an existing marketplace platform by adding new features and implementing advanced filtering using PHP and MySQL.',
        tech: ['PHP', 'MySQL'],
      },
      {
        text: 'Delivered two real estate websites for separate clients with tailored solutions.',
        tech: [],
      },
    ],
  },
]

export const RECENT_WORKS: RecentWork[] = [
  {
    title: 'My Portfolio',
    description:
      'Personal portfolio website showcasing my work and skills in frontend engineering',
    url: 'https://meera.dev',
    image: 'https://meera.dev/og.jpg',
    github: 'https://github.com/meerbahadin/meera.dev',
    isLive: true,
  },
  {
    title: "Danyiar's Portfolio",
    description: 'A beautifully crafted portfolio website Danyiar',
    url: 'https://danyiar.com',
    image: 'https://danyiar.com/og/meta.jpg',
    github: '',
    isLive: true,
  },
  {
    title: 'GradFlow',
    description: 'An advanced gradient generator built with WebGL and React',
    url: 'https://gradflow.meera.dev',
    image: 'https://gradflow.meera.dev/og.jpg',
    github: 'https://github.com/meerbahadin/grad-flow',
    isLive: true,
  },
]
