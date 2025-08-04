export default function Experiences() {
  const experiences = [
    {
      year: 'Apr 2025 - {{current}}', // will be replaced by a green dot
      title: 'Frontend Engineering Manager',
      company: 'ruyat.tech',
      items: [
        {
          text: 'Led the development of a payment solution app with biometric authentication and KYC integration.',
          tech: ['React', 'Vite', 'WebAuthn', 'Tailwind CSS'],
        },
        {
          text: 'Created a lightweight internal face liveness detection library using Google ML Kit.',
          tech: ['Google ML Kit'],
        },
      ],
    },
    {
      year: 'Sep 2021 - Apr 2025',
      title: 'Frontend Developer → Senior → Lead',
      company: 'netspot solutions',
      roles: [
        {
          title: 'Senior Frontend Developer (Jan 2023 - Jan 2024)',
          items: [
            {
              text: 'Contributed to multiple production apps across the company.',
              tech: [],
            },
            {
              text: 'Built a centralized account management system with SSO and user-based roles.',
              tech: [],
            },
            {
              text: "Developed the company's marketing website using Next.js, Lottie, and custom SVG animations.",
              tech: ['Next.js', 'Lottie', 'SVG'],
            },
          ],
        },
        {
          title: 'Lead Frontend Developer (Oct 2023 - Apr 2025)',
          items: [
            {
              text: 'Created a custom support application using Next.js with App Router and Server-Side Rendering (SSR) for ultra-fast performance.',
              tech: ['Next.js', 'Tailwind CSS', 'Hero UI', 'App Router', 'SSR'],
            },
            {
              text: 'Built a Kanban-style feedback system for tracking feature requests using Next.js and Dnd Kit.',
              tech: ['Dnd Kit', 'Tailwind', 'App Router', 'SSR'],
            },
            {
              text: 'Led a frontend team of 5+ developers, reviewing pull requests and monitoring application health and performance.',
              tech: [],
            },
            {
              text: 'Developed a WebAuthn-based passkey server for biometric authentication using Node.js and MongoDB.',
              tech: ['Node.js', 'MongoDB', 'WebAuthn'],
            },
            {
              text: "Updated the company's main website with animated SVGs and optimized 3D scenes using Spline and React Three Fiber.",
              tech: [
                'Spline',
                'Framer Motion',
                'React Three Fiber',
                'Next.js',
                'App Router',
                'SSR',
              ],
            },
          ],
        },
        {
          title: 'Frontend Developer (Sep 2021 - Feb 2023)',
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
                'Framer Motion',
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
    <div className='space-y-4 container max-w-3xl py-12'>
      <h2 className='text-lg font-medium capitalize'>experience</h2>
      <div className='space-y-3'>
        {experiences.map((exp, index) => (
          <div
            key={index}
            className='flex flex-col gap-3 p-5 bg-black/50 rounded-xl backdrop-blur-xl border border-zinc-900'
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
                      <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75'></span>
                      <span className='relative inline-flex size-3 rounded-full bg-green-500'></span>
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
                                  className='text-xs text-zinc-400 bg-zinc-800/50 px-2 py-0.5 rounded'
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
                              className='text-xs text-zinc-400 bg-zinc-800/50 px-2 py-0.5 rounded'
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
    </div>
  )
}
