'use client'

import Image from 'next/image'
import { Button } from '@heroui/button'
import {
  IconBrandGithub,
  IconBrandLinkedinFilled,
  IconMail,
} from '@tabler/icons-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='container max-w-3xl screen-line-before'>
      <div className='flex sm:justify-between sm:flex-row sm:text-start items-center gap-2 text-center flex-col border-s-1 border-e-1 border-default-50 p-4 '>
        <div className='flex flex-col items-center sm:items-start gap-2 screen-line-before screen-line-after py-4'>
          <Link href='/'>
            <Image
              src='/logo.svg'
              alt='logo'
              width={22}
              height={22}
              priority
              className='select-none opacity-75 aspect-square'
            />
          </Link>
          <p className='text-tiny text-default-400 text-balance'>
            Created by me. the source code is available on{' '}
            <a
              className='text-default-600'
              href='https://github.com/meerbahadin/meera.dev'
              target='_blank'
            >
              GitHub.
            </a>
            <br />
            Feel free to use it to build your own portfolio.
          </p>
        </div>

        <div className='flex gap-2 '>
          <Button
            variant='flat'
            isIconOnly
            size='sm'
            startContent={<IconBrandGithub size={18} />}
          />

          <Button
            variant='flat'
            isIconOnly
            size='sm'
            startContent={<IconBrandLinkedinFilled size={18} />}
          />

          <Button
            variant='flat'
            isIconOnly
            size='sm'
            startContent={<IconMail size={18} />}
          />
        </div>
      </div>
    </footer>
  )
}
