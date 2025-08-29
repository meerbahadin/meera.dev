import { IconLink, IconBrandGithub } from '@tabler/icons-react'
import Image from 'next/image'

export default function RecentWork() {
  const projects = [
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
  ]

  return (
    <section
      className='container max-w-3xl apply-edge'
      id='experiences-wrapper'
    >
      <div className='space-y-6 screen-line-before screen-line-after apply-edge p-4'>
        <div className='space-y-2'>
          <p className='text-2xl screen-line-after screen-line-before'>
            Recent Work
          </p>
          <p className='text-zinc-400 text-balance'>
            Showcasing my latest projects and collaborations in web development
          </p>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          {projects.map((project, index) => (
            <div
              key={index}
              className='group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/70'
            >
              <div className='aspect-video overflow-hidden relative'>
                <Image
                  src={project.image}
                  alt={`${project.title} preview`}
                  fill
                  className='object-cover transition-transform duration-300 group-hover:scale-105'
                />
              </div>

              <div className='p-4 space-y-3'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-semibold text-white'>
                    {project.title}
                  </h3>
                  {project.isLive && (
                    <div className='flex items-center gap-1.5'>
                      <div className='h-2 w-2 rounded-full bg-green-500 animate-pulse'></div>
                      <span className='text-xs text-green-400 font-medium'>
                        Live
                      </span>
                    </div>
                  )}
                </div>

                <p className='text-sm text-zinc-400 line-clamp-2'>
                  {project.description}
                </p>

                <div className='flex items-center gap-2 pt-2'>
                  <a
                    href={project.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors'
                  >
                    <IconLink size={12} />
                    Visit Site
                  </a>
                  {project.github && (
                    <a
                      href={project.github}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-600 rounded-md transition-colors'
                    >
                      <IconBrandGithub size={12} />
                      Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
