import { cn } from '@heroui/theme'
import { experiences } from '@/constant'

export default function Experiences() {
  return (
    <section
      className='container max-w-3xl pt-18 apply-edge'
      id='experiences-wrapper'
    >
      <div className='space-y-2 screen-line-before screen-line-after apply-edge p-4'>
        <p className='text-2xl screen-line-after screen-line-before'>
          Experience
        </p>
        <p className='text-zinc-400 text-balance'>
          A journey through frontend engineering, team leadership, and building
          scalable web applications
        </p>
      </div>
      <ul className='space-y-4 apply-edge'>
        {experiences.map((exp, index) => (
          <li
            key={index}
            className={cn('flex flex-col gap-2 p-4 screen-line-after', {
              'screen-line-before': index !== 0,
            })}
          >
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start'>
              <div>
                <h3 className='font-medium text-xl capitalize text-white'>
                  {exp.title}
                </h3>
                <p className='text-sm text-zinc-400 capitalize'>
                  {exp.company}
                </p>
              </div>
              <span className='text-sm text-zinc-400 shrink-0'>
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

            <div className='space-y-4'>
              {exp.roles
                ? exp.roles.map((role, roleIndex) => (
                    <div key={roleIndex} className='space-y-2'>
                      <p className='font-medium'>{role.title}</p>
                      <ul className='space-y-2 ml-4 list-disc marker:text-zinc-600'>
                        {role.items.map((point, pointIndex) => (
                          <li key={pointIndex} className='space-y-1'>
                            <p className='text-sm leading-relaxed'>
                              {point.text}
                            </p>
                            {point.tech?.length > 0 && (
                              <ul className='flex flex-wrap gap-2'>
                                {point.tech.map((tech, techIndex) => (
                                  <li key={techIndex}>
                                    <span className='text-xs text-zinc-200 bg-zinc-800 px-2 py-0.5 rounded'>
                                      {tech}
                                    </span>
                                  </li>
                                ))}
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
                        <li key={pointIndex} className='space-y-1 '>
                          <p className='text-sm leading-relaxed'>
                            {point.text}
                          </p>
                          {point.tech?.length > 0 && (
                            <ul className='flex flex-wrap gap-2'>
                              {point.tech.map((tech, techIndex) => (
                                <li key={techIndex}>
                                  <span className='text-xs text-zinc-200 bg-zinc-800 px-2 py-0.5 rounded'>
                                    {tech}
                                  </span>
                                </li>
                              ))}
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
