'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@heroui/button'

const Navbar = () => {
  return (
    <nav className='fixed top-0 left-1/2 -translate-x-1/2 w-full z-50 border-b border-default-50 bg-background/60 backdrop-blur-xl'>
      <div className='container max-w-3xl w-full flex justify-between items-center py-2'>
        <Link href='/' aria-label='home'>
          <Image
            src='/logo.svg'
            alt='logo'
            width={8}
            height={8}
            priority
            className='w-7 h-7 select-none hover:scale-110 active:scale-105 transition-transform mask-t-from-20% invert dark:invert-0'
          />
        </Link>

        <Button
          as={Link}
          href='https://wa.link/oonm1g'
          target='_blank'
          size='sm'
          radius='none'
          color='primary'
        >
          Contact me
        </Button>
      </div>
    </nav>
  )
}

export default Navbar
