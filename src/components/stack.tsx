'use client'

import Image from 'next/image'
import { Tooltip } from '@heroui/tooltip'

const imageLoader = ({ src }: { src: string }) => {
  return `https://cdn.simpleicons.org/${src}`
}

interface TechItem {
  name: string
  icon: string
  category: 'frontend' | 'backend' | 'mobile' | 'database' | 'tools' | 'design'
  isLocal?: boolean
}

const techStack: TechItem[] = [
  // Frontend
  { name: 'JavaScript', icon: 'javascript', category: 'frontend' },
  { name: 'TypeScript', icon: 'typescript', category: 'frontend' },
  { name: 'React', icon: 'react', category: 'frontend' },
  { name: 'Vite', icon: 'vite', category: 'frontend' },
  { name: 'SWR', icon: 'swr/white', category: 'frontend' },
  { name: 'React Query', icon: 'reactquery', category: 'frontend' },
  { name: 'Next.js', icon: 'next.js/white', category: 'frontend' },
  { name: 'Remix', icon: 'remix/white', category: 'frontend' },
  { name: 'React Router', icon: 'reactrouter', category: 'frontend' },
  {
    name: 'Motion',
    icon: '/motion.svg',
    category: 'frontend',
    isLocal: true,
  },
  { name: 'Redux', icon: 'redux', category: 'frontend' },
  { name: 'Tailwind CSS', icon: 'tailwindcss', category: 'frontend' },
  { name: 'shadcn/ui', icon: 'shadcnui/white', category: 'frontend' },
  { name: 'HeroUI', icon: 'heroui/white', category: 'frontend' },
  { name: 'Chakra UI', icon: 'chakraui/white', category: 'frontend' },
  { name: 'WebGL', icon: 'webgl', category: 'frontend' },

  // Mobile
  { name: 'Expo', icon: 'expo/white', category: 'mobile' },
  { name: 'Appwrite', icon: 'appwrite', category: 'mobile' },
  { name: 'Firebase', icon: 'firebase', category: 'mobile' },

  // Backend
  { name: 'Node.js', icon: 'node.js', category: 'backend' },
  { name: 'Go', icon: 'go', category: 'backend' },
  { name: 'Socket.io', icon: 'socket.io/white', category: 'backend' },
  { name: 'Bun', icon: 'bun/white', category: 'backend' },

  // Database
  { name: 'MongoDB', icon: 'mongodb', category: 'database' },
  { name: 'Mysql', icon: 'mysql/white', category: 'database' },
  { name: 'Redis', icon: 'redis', category: 'database' },

  // Tools
  { name: 'Cypress', icon: 'cypress', category: 'tools' },
  { name: 'Storybook', icon: 'storybook', category: 'tools' },
  { name: 'Vercel', icon: 'vercel/white', category: 'tools' },
  { name: 'Git', icon: 'git', category: 'tools' },
  { name: 'GitHub', icon: 'github/white', category: 'tools' },
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

const categoryColors = {
  frontend: 'bg-blue-500/10 text-blue-400',
  backend: 'bg-green-500/10 text-green-400',
  mobile: 'bg-purple-500/10 text-purple-400',
  database: 'bg-orange-500/10 text-orange-400',
  tools: 'bg-gray-500/10 text-gray-400',
  design: 'bg-pink-500/10 text-pink-400',
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
    <section className='container max-w-3xl'>
      <div className='space-y-3 screen-line-before screen-line-after p-4 border-s-1 border-e-1 border-default-50'>
        <p className='text-2xl screen-line-before screen-line-after'>
          Tech Stack
        </p>
        <p className='text-zinc-400 text-balance leading-relaxed'>
          Technologies and tools I use to build modern, scalable applications
        </p>
      </div>

      <div className='screen-line-after p-4 border-s-1 border-e-1 border-default-50'>
        <div className='space-y-8'>
          {Object.entries(groupedTech).map(([category, techs]) => (
            <div key={category} className='space-y-4'>
              {/* Category Header */}
              <div className='flex items-center gap-3'>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    categoryColors[category as keyof typeof categoryColors]
                  }`}
                >
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </span>
                <div className='h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent' />
              </div>

              <div className='flex gap-4 flex-wrap'>
                {techs.map((tech) => (
                  <Tooltip content={tech.name} key={tech.name}>
                    <div className='flex items-center justify-center w-12 h-12 rounded-lg bg-zinc-900/50 border border-zinc-800'>
                      <Image
                        alt={tech.name}
                        height={20}
                        width={20}
                        className='transition-transform'
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
