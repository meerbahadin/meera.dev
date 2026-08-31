'use client'

import { Button } from '@heroui/button'
import {
  IconMail,
  IconBrandGithub,
  IconBrandLinkedin,
} from '@tabler/icons-react'
import SectionHeader from './section-header'

const SERVICES = [
  'Frontend architecture with React, Next.js and TypeScript',
  'Interactive animation and WebGL experiences',
  'Performance, accessibility and SEO work on existing apps',
  'React Native apps for iOS and Android',
]

export default function LetsWorkTogether() {
  return (
    <section className='container max-w-3xl apply-edge'>
      <SectionHeader
        index='04'
        title="let's work together"
        description='Available for freelance projects and select full-time roles.'
      />

      <div className='p-4 apply-edge screen-line-after'>
        <div className='grid gap-6 md:grid-cols-[1fr_auto] md:items-start'>
          <div className='space-y-4 max-w-prose'>
            <p className='text-lead text-default-600'>
              {`I'm always interested in hearing about projects that need careful frontend work — whether that's a new application, an existing one that needs to feel faster, or something more experimental.`}
            </p>

            <ul className='space-y-1.5'>
              {SERVICES.map((service) => (
                <li key={service} className='grid grid-cols-[1ch_1fr] gap-x-3'>
                  <span
                    className='text-default-400 select-none'
                    aria-hidden='true'
                  >
                    —
                  </span>
                  <span className='text-body text-default-600'>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className='flex gap-2 items-center md:flex-col md:items-stretch'>
            <Button
              as='a'
              href='mailto:meerbahadin10@gmail.com'
              color='primary'
              radius='none'
              startContent={<IconMail size={18} />}
            >
              Get in touch
            </Button>

            <div className='flex gap-2'>
              <Button
                as='a'
                href='https://github.com/meerbahadin'
                target='_blank'
                rel='noopener noreferrer'
                variant='bordered'
                radius='none'
                isIconOnly
                aria-label='GitHub profile'
              >
                <IconBrandGithub size={18} />
              </Button>

              <Button
                as='a'
                href='https://linkedin.com/in/meerbahadin'
                target='_blank'
                rel='noopener noreferrer'
                variant='bordered'
                radius='none'
                isIconOnly
                aria-label='LinkedIn profile'
              >
                <IconBrandLinkedin size={18} />
              </Button>
            </div>
          </div>
        </div>

        <p className='label pt-6'>Typically responds within 24 hours</p>
      </div>
    </section>
  )
}
