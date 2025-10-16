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
      <div className='h-96 w-full bg-gradient-to-t from-rose-400/50  absolute blur-3xl left-1/2 -translate-x-1/2 top-20' />
      <div className='container max-w-3xl screen-line-before screen-line-after apply-edge '>
        <div className='flex   items-center gap-2 text-center flex-col apply-edge p-4'>
          <div className='flex flex-col items-center  gap-2 screen-line-before screen-line-after py-4'>
            <Link href='/'>
              <Image
                src='/logo.svg'
                alt='logo'
                width={22}
                height={22}
                priority
                className='select-none mask-t-from-20% aspect-square'
              />
            </Link>
            <p className='text-xs text-zinc-400 text-balance leading-relaxed'>
              The source code is available on{' '}
              <a
                className='text-zinc-200 font-semibold'
                href='https://github.com/meerbahadin/meera.dev'
                target='_blank'
              >
                GitHub.
              </a>{' '}
            </p>
          </div>

          <div className='flex gap-2 '>
            <Button
              as={Link}
              href='https://github.com/meerbahadin'
              variant='flat'
              isIconOnly
              size='sm'
              startContent={<IconBrandGithub size={18} />}
            />

            <Button
              as={Link}
              href='https://www.linkedin.com/in/meerbahadin/'
              variant='flat'
              isIconOnly
              size='sm'
              startContent={<IconBrandLinkedinFilled size={18} />}
            />

            <Button
              as={Link}
              href='mailto:meerbahadin10@gmail.com'
              variant='flat'
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
