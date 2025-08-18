import { cn } from '@heroui/theme'

export default function Experiences() {
  const experiences = [
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

  return (
    <section className='container max-w-3xl pt-18' id='experiences-wrapper'>
      <div className='space-y-2 screen-line-before screen-line-after border-s-1 border-e-1 border-default-50 p-4'>
        <p className='text-2xl screen-line-after screen-line-before'>
          Experience
        </p>
        <p className='text-zinc-400 text-balance'>
          A journey through frontend engineering, team leadership, and building
          scalable web applications
        </p>
      </div>
      <div className='space-y-4 border-s-1 border-e-1 border-default-50'>
        {experiences.map((exp, index) => (
          <div
            key={index}
            className={cn(
              'flex flex-col gap-3 p-5  via-transparent to-zinc-950 screen-line-after',
              { 'screen-line-before': index !== 0 }
            )}
          >
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1'>
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

            <div className='space-y-2'>
              {exp.roles
                ? exp.roles.map((role, roleIndex) => (
                    <div key={roleIndex} className='space-y-2'>
                      <p className='text-white font-medium'>{role.title}</p>
                      {role.items.map((point, pointIndex) => (
                        <div key={pointIndex} className='flex flex-col gap-1'>
                          <div className='flex items-start gap-2'>
                            <span className='text-zinc-400 text-xs mt-1.5'>
                              •
                            </span>
                            <p className='text-sm text-zinc-300 leading-relaxed'>
                              {point.text}
                            </p>
                          </div>
                          {point.tech?.length > 0 && (
                            <div className='ml-5 flex flex-wrap gap-2'>
                              {point.tech.map((tech, techIndex) => (
                                <span
                                  key={techIndex}
                                  className='text-xs text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded'
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))
                : exp.items?.map((point, pointIndex) => (
                    <div key={pointIndex} className='flex flex-col gap-1'>
                      <div className='flex items-start gap-2'>
                        <span className='text-zinc-400 text-xs mt-1.5'>•</span>
                        <p className='text-sm text-zinc-300 leading-relaxed'>
                          {point.text}
                        </p>
                      </div>
                      {point.tech?.length > 0 && (
                        <div className='ml-5 flex flex-wrap gap-2'>
                          {point.tech.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className='text-xs text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded'
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
