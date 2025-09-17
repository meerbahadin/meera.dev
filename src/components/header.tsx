'use client'

import { Button } from '@heroui/button'

// By adding only the specific animation features we need, we reduce the bundle size of the motion component.
import { LazyMotion, domAnimation } from 'motion/react'
import * as motion from 'motion/react-m'
import { IconChevronDown } from '@tabler/icons-react'

// check out my gradflow project at: https://grad-flow.vercel.app/
import Silk from './silk'
import Link from 'next/link'

export default function Header() {
  return (
    <LazyMotion features={domAnimation}>
      <header className='relative isolate'>
        <motion.div
          className='w-full h-full absolute -z-10 left-0 mask-b-from-75%'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Silk
            config={{
              color1: { r: 0, g: 0, b: 0 },
              color2: { r: 73, g: 136, b: 238 },
              color3: { r: 14, g: 26, b: 72 },
              speed: 0.4,
              scale: 1,
              noise: 0.1,
            }}
          />
        </motion.div>

        <div className='container max-w-3xl flex flex-col justify-end min-h-screen pb-8 pt-4'>
          <motion.div
            className='mt-8 space-y-4 text-center justify-self-end'
            initial={{ opacity: 0.5, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
          >
            <div>
              <p className='capitalize text-3xl'>meer bahadin</p>
              <p className='capitalize text-zinc-300'>frontend developer</p>
            </div>
            <p className='leading-relaxed text-sm md:text-lg text-zinc-200'>
              {`Hi, I'm Meer Bahadin — a frontend developer passionate about building fast, accessible, high-quality web applications. With 5+ years of experience, I now focus mainly on web and mobile apps using React, Next.js, and TypeScript.`}
            </p>

            <p className='leading-relaxed text-sm md:text-lg text-zinc-200'>
              {`I'm passionate about frontend development, especially building smooth, interactive experiences with web animation, Motion library, and WebGL.`}
            </p>

            <Button
              aria-label='view work eperience'
              variant='light'
              endContent={
                <IconChevronDown className='animate-pulse' size={18} />
              }
              onPress={() => {
                const element = document.getElementById('experiences-wrapper')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Work Experience
            </Button>

            <p className='text-xs text-balance'>
              Want to create stunning gradients like this? Check out{' '}
              <Link
                href='https://grad-flow.vercel.app/'
                target='_blank'
                className='text-white/70 hover:text-white underline transition-colors font-semibold'
              >
                GradFlow
              </Link>
            </p>
          </motion.div>
        </div>
      </header>
    </LazyMotion>
  )
}
