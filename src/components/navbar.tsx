import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@heroui/button'

const Navbar = () => {
  return (
    <nav className='flex fixed -translate-x-1/2 top-2 left-1/2 w-full max-w-md px-4 z-50'>
      <div className='overflow-hidden flex justify-between items-center w-full p-3 bg-background/20 outline-1 outline-offset-2 outline-white/15 rounded-lg backdrop-blur-lg'>
        <Link href='/'>
          <Image
            src='/logo.svg'
            alt='logo'
            width={8}
            height={8}
            priority
            className='w-8 h-8 select-none hover:scale-110 active:scale-105 transition-transform mask-t-from-20%'
          />
        </Link>

        <div className='flex items-center gap-4'>
          {/* <Links /> */}

          <Button
            as={Link}
            href='https://wa.link/oonm1g'
            target='_blank'
            size='sm'
            color='primary'
            className='text-xs capitalize'
          >
            contact me
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
