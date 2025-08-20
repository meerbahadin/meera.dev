import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@heroui/button'
import { Links } from './links'

const Navbar = () => {
  return (
    <nav className='flex fixed -translate-x-1/2 top-2 left-1/2 w-full max-w-3xl px-4 z-50'>
      <div className='flex justify-between items-center w-full p-3 bg-gradient-to-br from-white/5 via-transparent to-white/10 outline-1 outline-offset-2 outline-white/20 rounded-xl backdrop-blur-lg'>
        <Link href='/'>
          <Image
            src='/logo.svg'
            alt='logo'
            width={16}
            height={16}
            priority
            className='w-8 h-8 select-none hover:scale-110 active:scale-105 transition-transform'
          />
        </Link>

        <div className='flex items-center gap-4'>
          <Links />

          <Button
            as={Link}
            href='https://wa.link/oonm1g'
            size='sm'
            color='primary'
            className='text-sm'
          >
            Contact Me
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
