'use client'

import { Button } from '@heroui/button'
import Link from 'next/link'
import Image from 'next/image'
import {
  IconBrandGithub,
  IconBrandLinkedinFilled,
  IconMail,
} from '@tabler/icons-react'

export default function Footer() {
  return (
    <footer className='relative overflow-hidden'>
      <div className='h-96 w-full pointer-events-none bg-radial from-indigo-400/10 absolute blur-3xl -z-10 left-1/2 -translate-x-1/2 top-20' />
      <div className='container max-w-3xl screen-line-before screen-line-after apply-edge '>
        <div className='flex  items-center gap-2 text-center flex-col apply-edge p-4'>
          <div className='flex flex-col items-center  gap-2 screen-line-before screen-line-after py-4'>
            <Link href='/'>
              <Image
                src='/logo.svg'
                alt='logo'
                width={22}
                height={22}
                priority
                className='select-none mask-t-from-20% aspect-square invert dark:invert-0'
              />
            </Link>
            <p className='text-meta text-default-500 text-balance'>
              Feel free to use this website code for your own — view it on{' '}
              <a
                className='text-foreground underline underline-offset-2'
                href='https://github.com/meerbahadin/meera.dev'
                target='_blank'
                rel='noopener noreferrer'
              >
                GitHub
              </a>
            </p>
          </div>

          <div className='flex gap-2 '>
            <Button
              as={Link}
              href='https://github.com/meerbahadin'
              variant='bordered'
              radius='none'
              isIconOnly
              size='sm'
              startContent={<IconBrandGithub size={18} />}
            />

            <Button
              as={Link}
              href='https://www.linkedin.com/in/meerbahadin/'
              variant='bordered'
              radius='none'
              isIconOnly
              size='sm'
              startContent={<IconBrandLinkedinFilled size={18} />}
            />

            <Button
              as={Link}
              href='mailto:meerbahadin10@gmail.com'
              variant='bordered'
              radius='none'
              isIconOnly
              size='sm'
              startContent={<IconMail size={18} />}
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
