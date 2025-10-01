'use client'

import { Button } from '@heroui/button'
import {
  IconMail,
  IconBrandGithub,
  IconBrandLinkedin,
} from '@tabler/icons-react'
import SectionHeader from './section-header'

export default function LetsWorkTogether() {
  return (
    <section className='container max-w-3xl apply-edge'>
      <SectionHeader
        title="let's work together"
        description={`Ready to bring your ideas to life? I'm available for freelance projects and opportunities`}
      />

      <div className='p-4 apply-edge screen-line-after'>
        <div className='bg-gradient-to-br outline-1 outline-default-50 p-6 rounded-2xl relative overflow-hidden isolate'>
          <div className='space-y-6'>
            <div className='space-y-4'>
              <h3 className='text-xl font-semibold text-white'>
                Have a project in mind?
              </h3>
              <p className='text-zinc-300 leading-relaxed max-w-2xl'>
                {`I'm always excited to work on interesting projects and collaborate with talented teams.
              Whether you need a complete web application, want to improve your existing frontend,
              or need help with performance optimization, I'd love to hear from you.`}
              </p>
            </div>

            <div className='flex gap-2 items-center'>
              <Button
                as='a'
                href='mailto:meerbahadin@gmail.com'
                color='primary'
                startContent={<IconMail size={20} />}
              >
                Get in touch
              </Button>

              <Button
                as='a'
                href='https://github.com/meerbahadin'
                target='_blank'
                rel='noopener noreferrer'
                isIconOnly
                aria-label='GitHub profile'
              >
                <IconBrandGithub size={20} />
              </Button>

              <Button
                as='a'
                href='https://linkedin.com/in/meerbahadin'
                target='_blank'
                rel='noopener noreferrer'
                isIconOnly
                aria-label='LinkedIn profile'
              >
                <IconBrandLinkedin size={20} />
              </Button>
            </div>
          </div>

          <div className='grid gap-6 pt-8'>
            <div className='space-y-2'>
              <h4 className='font-semibold text-white'>
                What I can help with:
              </h4>
              <ul className='space-y-2 text-sm text-zinc-300'>
                <li className='flex items-center gap-2'>
                  <span className='text-blue-400'>•</span>
                  Frontend development with React, Next.js, and TypeScript
                </li>
                <li className='flex items-center gap-2'>
                  <span className='text-blue-400'>•</span>
                  Performance optimization and SEO improvements
                </li>
                <li className='flex items-center gap-2'>
                  <span className='text-blue-400'>•</span>
                  Interactive animations and WebGL experiences
                </li>
                <li className='flex items-center gap-2'>
                  <span className='text-blue-400'>•</span>
                  Mobile-first responsive design
                </li>
              </ul>
            </div>

            <div className='space-y-2'>
              <h4 className='font-semibold text-white'>Project types:</h4>
              <ul className='space-y-2 text-sm text-zinc-300'>
                <li className='flex items-center gap-2'>
                  <span className='text-green-400'>•</span>
                  Web applications and PWAs
                </li>
                <li className='flex items-center gap-2'>
                  <span className='text-green-400'>•</span>
                  Portfolio and marketing websites
                </li>
                <li className='flex items-center gap-2'>
                  <span className='text-green-400'>•</span>
                  E-commerce platforms
                </li>
                <li className='flex items-center gap-2'>
                  <span className='text-green-400'>•</span>
                  Dashboard and admin interfaces
                </li>

                <li className='flex items-center gap-2'>
                  <span className='text-green-400'>•</span>
                  Mobile App (iOS & Android) using React Native
                </li>
              </ul>
            </div>
          </div>

          <div className='text-center pt-6'>
            <p className='text-sm text-zinc-400 text-balance'>
              Typically respond within 24 hours. Available for projects starting
              immediately
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
