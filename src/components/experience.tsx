import { cn } from '@heroui/theme'
import { EXPERIENCES } from '@/constant'
import SectionHeader from './section-header'
import type { Experience } from '@/types'

type Point = { text: string; tech: string[] }

const TechList = ({ tech }: { tech: string[] }) =>
  tech.length > 0 ? (
    <ul className='flex flex-wrap gap-1.5 pt-2'>
      {tech.map((e) => (
        <li
          key={e}
          className='px-1.5 py-0.5 text-label border border-default-50 text-default-500'
        >
          {e}
        </li>
      ))}
    </ul>
  ) : null

const Points = ({ items }: { items: Point[] }) => (
  <ul className='space-y-3'>
    {items.map((point, i) => (
      <li key={i} className='grid grid-cols-[1ch_1fr] gap-x-3'>
        <span className='text-default-400 select-none' aria-hidden='true'>
          —
        </span>
        <div>
          <p className='text-body text-default-600'>{point.text}</p>
          <TechList tech={point.tech} />
        </div>
      </li>
    ))}
  </ul>
)

const YearLabel = ({ year }: { year: Experience['year'] }) =>
  year.includes('{{current}}') ? (
    <span className='flex items-center gap-2'>
      <span>{year.split('-')[0].trim()}</span>
      <span>—</span>
      <span className='relative flex size-2' title='current'>
        <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
        <span className='relative inline-flex size-2 rounded-full bg-emerald-500' />
      </span>
    </span>
  ) : (
    <>{year}</>
  )

export default function Experiences() {
  return (
    <section
      className='container max-w-3xl pt-18 apply-edge'
      id='experiences-wrapper'
    >
      <SectionHeader
        index='01'
        title='experience'
        description='Frontend engineering, team leadership, and building scalable web applications.'
      />

      <ul className='apply-edge'>
        {EXPERIENCES.map((exp, index) => (
          <li
            key={index}
            className={cn('p-4 screen-line-after', {
              'screen-line-before': index !== 0,
            })}
          >
            <div className='grid gap-4 md:grid-cols-[10.5rem_1fr]'>
              <div className='label tabular-nums md:pt-1 whitespace-nowrap'>
                <YearLabel year={exp.year} />
              </div>

              <div className='space-y-4 min-w-0'>
                <div>
                  <h3 className='text-title font-medium capitalize'>
                    {exp.title}
                  </h3>
                  <p className='text-meta text-default-500 capitalize'>
                    {exp.company}
                  </p>
                </div>

                {exp.roles
                  ? exp.roles.map((role, roleIndex) => (
                      <div key={roleIndex} className='space-y-2'>
                        <p className='label text-default-600'>{role.title}</p>
                        <Points items={role.items} />
                      </div>
                    ))
                  : exp.items && <Points items={exp.items} />}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
