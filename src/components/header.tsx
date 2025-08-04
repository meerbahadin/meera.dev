'use client'

import Image from 'next/image'
import { Links } from '@/components/links'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Button } from '@heroui/button'
import ValeBackground from '@/components/backgrounds/vale'
import { Tooltip } from '@heroui/tooltip'
import Link from 'next/link'

export default function Header() {
  const [isLogoHovered, setIsLogoHovered] = useState(false)

  return (
    <header className='relative isolate'>
      <motion.div
        className='w-full h-full absolute -z-10 left-0 mask-b-from-85%'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ValeBackground
          speed={isLogoHovered ? 1.0 : 0.2}
          saturation={isLogoHovered ? 10 : 0}
        />
      </motion.div>

      <div className='container max-w-3xl  flex flex-col justify-between h-dvh pb-8 pt-4'>
        <div className='flex justify-between sticky items-center p-3 bg-gradient-to-br from-white/5 via-transparent to-white/10 outline-1 outline-offset-2 outline-white/20 rounded-xl backdrop-blur-lg'>
          <motion.div
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className='cursor-pointer'
          >
            <Tooltip
              content='woww!'
              placement='right'
              color='foreground'
              showArrow
            >
              <Image
                src='/logo.svg'
                alt='Next.js logo'
                width={16}
                height={16}
                priority
                className='w-8 h-8 select-none'
              />
            </Tooltip>
          </motion.div>

          <div className='flex items-center gap-4'>
            <Links />

            <Button
              as={Link}
              href='mailto:meerbahadin10@gmail.com'
              className='capitalize'
              size='sm'
              color='primary'
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
            >
              contact me
            </Button>
          </div>
        </div>

        <div className='mt-8 space-y-4 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className='capitalize text-3xl'>meer bahadin</p>
            <p className='text-sm capitalize text-default-500'>
              frontend developer
            </p>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {`Hi, I'm Meer Bahadin — a frontend developer who loves creating fast,
            accessible, and user-friendly interfaces. I got my start as a full
            stack developer, and over the past 5+ years, I've built a wide range
            of web and mobile apps using JavaScript, Node.js, React, Next.js,
            and TypeScript. These days, I mostly focus on frontend work, but I
            still enjoy jumping into React Native when a mobile project calls
            for it. Outside of work, I'm always tinkering with new tech and
            turning ideas into side projects just for the fun of it. Lately,
            I've been diving into WebGL and exploring creative coding — blending
            visuals, performance, and interactivity in new ways on the web.`}
          </motion.p>
        </div>
      </div>
    </header>
  )
}
