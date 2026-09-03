'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LazyMotion, domAnimation } from 'motion/react'
import * as motion from 'motion/react-m'
import {
  IconCode,
  IconMapPin,
  IconClock,
  IconMail,
  IconLink,
  IconPhone,
  IconBrandLinkedin,
  IconBrandGithub,
  IconBrandX,
  IconFileText,
  IconRosetteDiscountCheckFilled,
  IconChevronDown,
} from '@tabler/icons-react'

import Divider from './divider'
import HeroBackdrop from './hero-backdrop'
import { ThemeToggle } from './theme-toggle'
import {
  HERO_BACKDROP,
  PROFILE,
  SPEC_ROWS,
  SOCIALS,
  type SpecRow,
} from '@/constant/header'

const ICONS = {
  role: IconCode,
  location: IconMapPin,
  clock: IconClock,
  mail: IconMail,
  link: IconLink,
  phone: IconPhone,
} as const

const SOCIAL_ICONS = {
  linkedin: IconBrandLinkedin,
  github: IconBrandGithub,
  x: IconBrandX,
  resume: IconFileText,
} as const

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

/**
 * The live local clock. Rendered empty on the server and filled after mount —
 * a time formatted during SSR would not match the client's and would trip a
 * hydration warning.
 */
function useLocalTime() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      )
    tick()
    // Aligned to the minute rather than a 1s interval: the display only shows
    // hours and minutes, so a per-second timer would re-render for nothing.
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])

  return time
}

/** One row of the data block: icon chip, then the fact. */
function SpecItem({ row, time }: { row: SpecRow; time: string }) {
  const Icon = ICONS[row.icon]
  const value = row.icon === 'clock' ? time : row.value

  // The clock row is blank until the client fills it; reserve its height so the
  // grid does not jump on hydration.
  const body = (
    <span className='text-meta font-mono text-default-600 truncate'>
      {value}
      {row.strong && (
        <span className='text-foreground font-medium'>{row.strong}</span>
      )}
      {row.note && (
        <span className='text-default-400'>
          {value ? ' ' : ''}
          {`// ${row.note}`}
        </span>
      )}
    </span>
  )

  return (
    <div
      className={`flex items-center gap-3 min-w-0 ${
        // The role line is the longest fact on the sheet; letting it span both
        // columns is what stops the employer name from being clipped.
        row.icon === 'role' ? 'sm:col-span-2' : ''
      }`}
    >
      <span
        className='grid size-7 shrink-0 place-items-center rounded-md border border-default-50 bg-default-100/50 text-default-500'
        aria-hidden='true'
      >
        <Icon size={14} stroke={1.6} />
      </span>

      {row.href ? (
        <Link
          href={row.href}
          target={row.href.startsWith('http') ? '_blank' : undefined}
          className='min-w-0 hover:text-foreground transition-colors'
        >
          {body}
        </Link>
      ) : (
        body
      )}
    </div>
  )
}

export default function Header() {
  const time = useLocalTime()

  return (
    <LazyMotion features={domAnimation}>
      {/*
        The sheet. Content is held to the page's 768px column, but the rules and
        hatching inside bleed to the full viewport — that contrast is what makes
        it read as a technical drawing rather than a boxed card.

        pt-14 clears the fixed navbar.
      */}
      <header className='relative isolate pt-14 overflow-x-clip'>
        <motion.div
          className='container max-w-3xl px-0'
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.5 }}
        >
          {/*
            THE PLATE. The mark centred on construction grid, with the figure
            caption in the corner. border-x gives the column its continuous
            vertical rails.
          */}
          <section className='relative border-x border-b border-default-50'>
            {/*
              Inline rather than a custom @utility: a project-defined utility
              did not survive the production build on Vercel, which silently
              left these rules at Tailwind's default (near-white) colour. The
              `currentColor` trick keeps the grid tied to the theme without
              needing a generated class.
            */}
            <div
              className='absolute inset-0 opacity-60 text-default-50'
              aria-hidden='true'
              style={{
                backgroundImage:
                  'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
                backgroundSize: '68px 68px',
                backgroundPosition: 'center',
              }}
            />

            {/* The scene renders into this box — short, because the mark is a
                figure on the sheet now, not the whole hero. */}
            <div className='relative h-[14rem] sm:h-[17rem]'>
              <HeroBackdrop variant={HERO_BACKDROP} />
            </div>

            <span
              className='absolute bottom-2.5 right-3.5 label font-mono text-default-400 select-none tracking-wider'
              aria-hidden='true'
            >
              {PROFILE.figure}
            </span>

            <div className='absolute top-3 right-3'>
              <ThemeToggle />
            </div>
          </section>

          {/*
            THE NAMEPLATE. Avatar cell, then name and title in their own ruled
            rows — the avatar's cell is taller than the two text rows, which is
            what gives the block its stepped silhouette in the reference.
          */}
          <section className='grid grid-cols-[auto_1fr] border-x border-default-50'>
            <div className='border-r border-default-50 p-3 sm:p-4 flex items-end'>
              <div className='relative size-20 sm:size-[6.5rem] overflow-hidden rounded-full border border-default-50 bg-default-100'>
                <Image
                  src={PROFILE.avatar}
                  alt={PROFILE.name}
                  fill
                  sizes='104px'
                  className='object-cover'
                  // Nothing at PROFILE.avatar yet: hide the broken image and let
                  // the neutral circle behind it stand in.
                  onError={(e) => {
                    e.currentTarget.style.visibility = 'hidden'
                  }}
                />
              </div>
            </div>

            <div className='grid grid-rows-[1fr_auto] min-w-0'>
              <div className='flex items-center gap-2 border-b border-default-50 px-4 sm:px-6 pb-2 pt-6'>
                <h1 className='font-sans text-display font-semibold tracking-tight truncate'>
                  {PROFILE.name}
                </h1>
                <IconRosetteDiscountCheckFilled
                  size={20}
                  className='shrink-0 text-sky-500'
                  aria-label='verified'
                />
              </div>

              <p className='px-4 sm:px-6 py-3 text-meta font-mono text-default-500'>
                {PROFILE.title}
              </p>
            </div>
          </section>

          {/* The same Divider the rest of the page uses — one implementation,
              so the header's cut edges can never drift from the section
              dividers below. my-0 keeps it flush against the cells. */}
          <Divider className='my-0' />

          {/*
            THE DATA BLOCK. Two columns of labelled facts — the densest part of
            the sheet, and the reason it reads as a spec rather than a bio.
          */}
          <section className='border-x border-b border-default-50'>
            <div className='grid gap-x-10 gap-y-4 p-4 sm:p-6 sm:grid-cols-2'>
              {SPEC_ROWS.map((row, i) => (
                <SpecItem key={i} row={row} time={time} />
              ))}
            </div>
          </section>

          {/* THE FOOTER STRIP: social plates, then the way into the page. */}
          <section className='flex flex-wrap items-center justify-between gap-4 p-4 sm:px-6 border-x border-default-50'>
            <ul className='flex items-center gap-2'>
              {SOCIALS.map((s) => {
                const Icon = SOCIAL_ICONS[s.icon]
                return (
                  <li key={s.label}>
                    <Link
                      href={s.href}
                      target='_blank'
                      aria-label={s.label}
                      className='grid size-8 place-items-center rounded-lg border border-default-50 bg-default-100/60 text-default-500 hover:text-foreground hover:border-default-300 transition-colors'
                    >
                      <Icon size={15} stroke={1.6} />
                    </Link>
                  </li>
                )
              })}
            </ul>

            <button
              onClick={() => scrollTo('experiences-wrapper')}
              className='group inline-flex items-center gap-1.5 label font-mono text-default-500 hover:text-foreground transition-colors'
            >
              view experience
              <IconChevronDown
                size={14}
                className='group-hover:translate-y-0.5 transition-transform'
              />
            </button>
          </section>

          {/* Closing cut edge, same component. */}
          <Divider className='my-0' />
        </motion.div>
      </header>
    </LazyMotion>
  )
}
