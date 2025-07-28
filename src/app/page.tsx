'use client'

import Image from 'next/image'
import WaveBackground from '@/components/wave-background'
import { Links } from '@/components/links'
import { motion } from 'motion/react'
import { useState } from 'react'

export default function Home() {
  const [isLogoHovered, setIsLogoHovered] = useState(false)

  return (
    <>
      <div className='min-h-screen w-full relative grid isolate'>
        <div className='w-full h-full absolute -z-10 pointer-events-none '>
          <WaveBackground
            noiseIntensity={0.08}
            hueShift={-140}
            saturation={isLogoHovered ? 1 : 0}
            warpAmount={isLogoHovered ? 0 : 2}
            speed={0.6}
          />
        </div>
        <div className='container max-w-3xl'>
          <div className='flex justify-between items-center p-3 mt-4 bg-white/5 outline-1 outline-offset-2 outline-white/20 rounded-xl backdrop-blur-lg'>
            <motion.div
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className='cursor-pointer'
            >
              <Image
                src='/logo.svg'
                alt='Next.js logo'
                width={16}
                height={16}
                priority
                className='w-8 h-8 select-none'
              />
            </motion.div>

            <Links />
          </div>

          <div className='mt-10 space-y-4'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className='capitalize text-lg'>meer bahadin</p>
              <p className='text-sm capitalize text-gray-300'>developer</p>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {`Hello, World! I'm Meer Bahadin — a Frontend Developer passionate
              about building fast, accessible, and intuitive user interfaces. I
              started my journey as a Full Stack Developer and now bring over 5
              years of experience crafting high-quality web and mobile
              applications using JavaScript, Node.js, React, Next.js, and
              TypeScript. While my focus is on frontend development, I
              occasionally dive into React Native for mobile projects as well.
              Beyond work, I enjoy exploring new technologies and bringing ideas
              to life through side projects and experiments on the web.`}
            </motion.p>
          </div>
        </div>
      </div>
    </>
  )
}
