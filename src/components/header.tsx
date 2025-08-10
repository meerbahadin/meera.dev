'use client'

import { useState } from 'react'
import { Button } from '@heroui/button'
import ValeBackground from '@/components/backgrounds/vale'

// By adding only the specific animation features we need, we reduce the bundle size of the motion component.
import { LazyMotion, domAnimation } from 'motion/react'
import * as motion from 'motion/react-m'
import { IconChevronDown } from '@tabler/icons-react'

export default function Header() {
  const [isLogoHovered, setIsLogoHovered] = useState(false)

  return (
    <LazyMotion features={domAnimation}>
      <header className='relative isolate'>
        <motion.div
          className='w-full h-full absolute -z-10 left-0 mask-b-from-85%'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <ValeBackground
            speed={isLogoHovered ? 1.0 : 0.2}
            saturation={isLogoHovered ? 10 : 0}
          />
        </motion.div>

        <div className='container max-w-3xl flex flex-col justify-end h-dvh pb-8 pt-4'>
          <motion.div
            className='mt-8 space-y-4 text-center justify-self-end'
            initial={{ opacity: 0.5, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
          >
            <div>
              <p className='capitalize text-3xl'>meer bahadin</p>
              <p className='capitalize text-default-500'>frontend developer</p>
            </div>
            <p className='leading-relaxed text-lg text-zinc-300'>
              {`Hi, I'm Meer Bahadin — a frontend developer passionate about building fast, accessible, high-quality web applications. With 5+ years of experience, I now focus mainly on web and mobile apps using React, Next.js, and TypeScript.`}
            </p>

            <p className='leading-relaxed text-lg text-zinc-300'>
              {`I'm passionate about frontend development, especially building smooth, interactive experiences with web animation, Motion library, and WebGL.`}
            </p>

            <Button
              variant='flat'
              endContent={
                <IconChevronDown className='animate-pulse' size={18} />
              }
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
              onPress={() => {
                const element = document.getElementById('experiences-wrapper')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Work Experience
            </Button>
          </motion.div>
        </div>
      </header>
    </LazyMotion>
  )
}
