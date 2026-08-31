import Image from 'next/image'
import { IconArrowUpRight, IconBrandGithub } from '@tabler/icons-react'
import { RECENT_WORKS } from '@/constant'
import SectionHeader from './section-header'

export default function RecentWork() {
  return (
    <section className='container max-w-3xl apply-edge' id='recent-work'>
      <SectionHeader
        index='02'
        title='recent work'
        description='Selected projects and collaborations.'
      />

      <div className='grid md:grid-cols-2 apply-edge screen-line-after'>
        {RECENT_WORKS.map((project, index) => (
          <article
            key={index}
            className='group relative border-default-50 p-4 border-b last:border-b-0 md:odd:not-last:border-r'
          >
            <div className='aspect-video overflow-hidden relative border border-default-50 bg-default-100'>
              <Image
                src={project.image}
                alt={`${project.title} preview`}
                fill
                sizes='(min-width: 768px) 50vw, 100vw'
                className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
              />
            </div>

            <div className='pt-3 space-y-2'>
              <div className='flex items-baseline justify-between gap-2'>
                <h3 className='text-title font-medium'>{project.title}</h3>
                {project.isLive && (
                  <span className='label text-default-500 flex items-center gap-1.5 shrink-0'>
                    <span className='size-1.5 rounded-full bg-emerald-500' />
                    live
                  </span>
                )}
              </div>

              <p className='text-meta text-default-500 line-clamp-2'>
                {project.description}
              </p>

              <div className='flex items-center gap-4 pt-1'>
                <a
                  href={project.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='label inline-flex items-center gap-1 text-default-600 hover:text-foreground transition-colors'
                >
                  visit
                  <IconArrowUpRight size={12} stroke={2} />
                </a>
                {project.github && (
                  <a
                    href={project.github}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='label inline-flex items-center gap-1 text-default-600 hover:text-foreground transition-colors'
                  >
                    <IconBrandGithub size={12} stroke={2} />
                    source
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
