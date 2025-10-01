import { cn } from '@heroui/theme'
import { EXPERIENCES } from '@/constant'
import SectionHeader from './section-header'

export default function Experiences() {
  return (
    <section
      className='container max-w-3xl pt-18 apply-edge'
      id='experiences-wrapper'
    >
      <SectionHeader
        title='experience'
        description='A journey through frontend engineering, team leadership, and building
          scalable web applications'
      />

      <ul className='space-y-4 apply-edge'>
        {EXPERIENCES.map((exp, index) => (
          <li
            key={index}
            className={cn('flex flex-col gap-2 p-4 screen-line-after', {
              'screen-line-before': index !== 0,
            })}
          >
            <div className='space-y-2'>
              <h3 className='font-medium text-xl capitalize text-white'>
                {exp.title}
              </h3>

              <div className='flex items-center justify-between w-full'>
                <p className='text-sm text-zinc-400 capitalize'>
                  {exp.company}
                </p>
                <span className='text-xs text-zinc-400 shrink-0'>
                  {exp.year.includes('{{current}}') ? (
                    <span className='flex items-center gap-2'>
                      <span>{exp.year.split('-')[0]}</span>
                      <span>-</span>
                      <span className='relative flex size-3'>
                        <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75' />
                        <span className='relative inline-flex size-3 rounded-full bg-green-500' />
                      </span>
                    </span>
                  ) : (
                    exp.year
                  )}
                </span>
              </div>
            </div>

            <div className='space-y-4'>
              {exp.roles
                ? exp.roles.map((role, roleIndex) => (
                    <div key={roleIndex} className='space-y-2'>
                      <p className='font-medium'>{role.title}</p>
                      <ul className='space-y-2 ml-4 list-disc marker:text-zinc-600'>
                        {role.items.map((point, pointIndex) => (
                          <li key={pointIndex}>
                            <p className='text-sm leading-relaxed'>
                              {point.text}
                            </p>
                            {point.tech?.length > 0 && (
                              <ul className='flex flex-wrap gap-2'>
                                <div className='flex flex-wrap gap-2'>
                                  {point.tech.map((e) => (
                                    <span
                                      key={e}
                                      className='px-2 py-1 text-xs rounded-md bg-default-100 text-default-600 text-muted-foreground dark:inset-shadow-[1px_1px_1px,0px_0px_1px] dark:inset-shadow-white/20'
                                    >
                                      {e}
                                    </span>
                                  ))}
                                </div>
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                : exp.items && (
                    <ul className='space-y-2 ml-4 list-disc marker:text-zinc-600'>
                      {exp.items.map((point, pointIndex) => (
                        <li key={pointIndex}>
                          <p className='text-sm leading-relaxed'>
                            {point.text}
                          </p>
                          {point.tech?.length > 0 && (
                            <ul className='flex flex-wrap gap-2'>
                              {point.tech?.length > 0 && (
                                <ul className='flex flex-wrap gap-2'>
                                  <div className='flex flex-wrap gap-2'>
                                    {point.tech.map((e) => (
                                      <span
                                        key={e}
                                        className='px-2 py-1 text-xs rounded-md bg-default-100 text-muted-foreground dark:inset-shadow-[1px_1px_1px,0px_0px_1px] dark:inset-shadow-white/20'
                                      >
                                        {e}
                                      </span>
                                    ))}
                                  </div>
                                </ul>
                              )}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
