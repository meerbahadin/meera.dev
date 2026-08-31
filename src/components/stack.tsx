'use client'

import Image from 'next/image'
import { Tooltip } from '@heroui/tooltip'
import { cn } from '@heroui/theme'
import SectionHeader from './section-header'

const imageLoader = ({ src }: { src: string }) => {
  return `https://cdn.simpleicons.org/${src}`
}

interface TechItem {
  name: string
  icon: string
  category: 'frontend' | 'backend' | 'mobile' | 'database' | 'tools' | 'design'
  isLocal?: boolean
  /** Single-colour logo: rendered dark on light, inverted to white on dark. */
  mono?: boolean
}

const techStack: TechItem[] = [
  // Frontend
  { name: 'JavaScript', icon: 'javascript', category: 'frontend' },
  { name: 'TypeScript', icon: 'typescript', category: 'frontend' },
  { name: 'React', icon: 'react', category: 'frontend' },
  { name: 'Vite', icon: 'vite', category: 'frontend' },
  { name: 'SWR', icon: 'swr', mono: true, category: 'frontend' },
  { name: 'React Query', icon: 'reactquery', category: 'frontend' },
  { name: 'Next.js', icon: 'next.js', mono: true, category: 'frontend' },
  { name: 'Remix', icon: 'remix', mono: true, category: 'frontend' },
  { name: 'React Router', icon: 'reactrouter', category: 'frontend' },
  {
    name: 'Motion',
    icon: '/motion.svg',
    category: 'frontend',
    isLocal: true,
  },
  { name: 'Redux', icon: 'redux', category: 'frontend' },
  { name: 'Tailwind CSS', icon: 'tailwindcss', category: 'frontend' },
  { name: 'shadcn/ui', icon: 'shadcnui', mono: true, category: 'frontend' },
  { name: 'HeroUI', icon: 'heroui', mono: true, category: 'frontend' },
  { name: 'Chakra UI', icon: 'chakraui', mono: true, category: 'frontend' },
  { name: 'WebGL', icon: 'webgl', category: 'frontend' },

  // Mobile
  { name: 'Expo', icon: 'expo', mono: true, category: 'mobile' },
  { name: 'Supabase', icon: 'supabase', category: 'mobile' },
  { name: 'Firebase', icon: 'firebase', category: 'mobile' },

  // Backend
  { name: 'Node.js', icon: 'node.js', category: 'backend' },
  { name: 'Go', icon: 'go', category: 'backend' },
  { name: 'Socket.io', icon: 'socket.io', mono: true, category: 'backend' },
  { name: 'Bun', icon: 'bun', mono: true, category: 'backend' },

  // Database
  { name: 'MongoDB', icon: 'mongodb', category: 'database' },
  { name: 'Mysql', icon: 'mysql', mono: true, category: 'database' },
  { name: 'Redis', icon: 'redis', category: 'database' },

  // Tools
  { name: 'Cypress', icon: 'cypress', category: 'tools' },
  { name: 'Storybook', icon: 'storybook', category: 'tools' },
  { name: 'Vercel', icon: 'vercel', mono: true, category: 'tools' },
  { name: 'Git', icon: 'git', category: 'tools' },
  { name: 'GitHub', icon: 'github', mono: true, category: 'tools' },
  { name: 'Docker', icon: 'docker', category: 'tools' },

  // Design
  { name: 'Figma', icon: 'figma', category: 'design' },
]

const categoryLabels = {
  frontend: 'Frontend',
  backend: 'Backend',
  mobile: 'Mobile',
  database: 'Database',
  tools: 'Development Tools',
  design: 'Design',
}

const Stack = () => {
  // Group technologies by category
  const groupedTech = techStack.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = []
    }
    acc[tech.category].push(tech)
    return acc
  }, {} as Record<string, TechItem[]>)

  return (
    <section className='container max-w-3xl apply-edge'>
      <SectionHeader
        index='03'
        title='tech stack'
        description='Technologies and tools I build with.'
      />

      <div className='screen-line-after p-4 apply-edge'>
        <div className='space-y-7'>
          {Object.entries(groupedTech).map(([category, techs]) => (
            <div key={category} className='space-y-4'>
              {/* Category Header */}
              <div className='flex items-center gap-3'>
                <span className='label'>
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </span>
                <div className='h-px flex-1 bg-default-50' />
                <span className='label tabular-nums'>
                  {String(techs.length).padStart(2, '0')}
                </span>
              </div>

              <div className='flex gap-2 flex-wrap'>
                {techs.map((tech) => (
                  <Tooltip showArrow content={tech.name} key={tech.name}>
                    <div className='flex items-center justify-center size-11 border border-default-50 bg-default-100/40 transition-colors hover:border-default-300 hover:bg-default-100'>
                      <Image
                        alt={tech.name}
                        height={20}
                        width={20}
                        className={cn('transition-transform', {
                          'dark:invert': tech.mono,
                          'invert dark:invert-0': tech.isLocal,
                        })}
                        {...(tech.isLocal
                          ? { src: tech.icon }
                          : { loader: imageLoader, src: tech.icon })}
                      />
                    </div>
                  </Tooltip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stack
