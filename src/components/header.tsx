'use client'

import { Button } from '@heroui/button'

// By adding only the specific animation features we need, we reduce the bundle size of the motion component.
import { LazyMotion, domAnimation } from 'motion/react'
import * as motion from 'motion/react-m'
import { IconChevronDown, IconArrowUpRight } from '@tabler/icons-react'

// check out my gradflow project at: https://grad-flow.vercel.app/
import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
import HeroBackdrop from './hero-backdrop'
import { HEADER_VARIANT, HERO_BACKDROP } from '@/constant/header'

const NAME = 'Meer Bahadin'

const META = [
  { label: 'role', value: 'Frontend & Mobile' },
  { label: 'exp', value: '5+ years' },
  { label: 'stack', value: 'React · Next.js · Expo' },
  { label: 'status', value: 'Available' },
]

const INTRO = [
  `Hi, I'm Meer Bahadin — a frontend developer building fast, accessible, high-quality web applications with React, Next.js and TypeScript, and mobile apps with React Native and Expo.`,
  `I care most about the interactive edge of the craft — smooth motion, WebGL, and interfaces that feel considered.`,
]

const CONTENTS = [
  { n: '01', title: 'Experience', note: 'Where I have worked', id: 'experiences-wrapper' },
  { n: '02', title: 'Recent Work', note: 'What I have shipped', id: 'recent-work' },
  { n: '03', title: 'Tech Stack', note: 'What I build with', id: 'tech-stack' },
  { n: '04', title: "Let's Work Together", note: 'How to reach me', id: 'contact' },
]

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

/** On the shader the copy sits on a dark image in BOTH themes, so it is pinned light. */
const onShader = HERO_BACKDROP === 'shader'
const dim = onShader ? 'text-zinc-400' : 'text-default-500'
const body = onShader ? 'text-zinc-300' : 'text-default-600'
const strong = onShader ? 'text-zinc-100' : 'text-foreground'
const hairline = onShader ? 'border-white/15' : 'border-default-50'

const WorkButton = () => (
  <Button
    aria-label='view work experience'
    variant='bordered'
    radius='none'
    className={
      onShader
        ? 'border-white/30 text-zinc-100 data-[hover=true]:bg-white/10'
        : undefined
    }
    endContent={<IconChevronDown className='animate-pulse' size={16} />}
    onPress={() => scrollTo('experiences-wrapper')}
  >
    Work Experience
  </Button>
)

const Intro = () => (
  <div className='space-y-3 max-w-prose'>
    {INTRO.map((p) => (
      <p key={p} className={`text-lead ${body}`}>
        {p}
      </p>
    ))}
  </div>
)

const Credit = () =>
  onShader ? (
    <p className={`label ${dim} text-balance`}>
      Background made with{' '}
      <Link
        href='https://gradflow.meerbahadin.dev/'
        target='_blank'
        className={`${strong} underline underline-offset-2 transition-colors`}
      >
        GradFlow
      </Link>
    </p>
  ) : null

export default function Header() {
  const v = HEADER_VARIANT
  const compact = v === 'compact'

  return (
    <LazyMotion features={domAnimation}>
      <header
        className={`relative isolate ${compact ? 'min-h-[68svh]' : 'min-h-svh'} ${
          onShader ? 'text-zinc-100' : ''
        }`}
      >
        {/*
          The backdrop is NOT wrapped in a fading motion.div: lazily-loaded
          backdrops (the 3D logo) mount after that animation has already run,
          and would stay stuck at opacity 0. Each backdrop owns its own entrance.
        */}
        <HeroBackdrop variant={HERO_BACKDROP} />

        <div
          className={`container max-w-3xl flex flex-col pb-8 pt-16 ${
            compact ? 'min-h-[68svh] justify-end' : 'min-h-svh justify-between'
          }`}
        >
          {!compact && (
            <div className='flex items-center justify-between'>
              <span className={`label ${dim}`}>meera.dev</span>
              <ThemeToggle />
            </div>
          )}

          <motion.div
            className='space-y-5 justify-self-end w-full'
            initial={{ opacity: 0.5, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
          >
            {v === 'aside' ? (
              /*
                Scene occupies the upper half of the hero; the copy sits beneath
                it, centred on the same axis, so the two read as one column.
              */
              <div className='flex flex-col items-center text-center min-h-[78svh]'>
                {/* Reserved space the 3D mark renders into. */}
                <div
                  className='w-full flex-1 min-h-[19rem] sm:min-h-[22rem]'
                  aria-hidden='true'
                />

                <div className='space-y-4 sm:space-y-5 max-w-2xl'>
                  <div className='space-y-2'>
                    <p className={`label ${dim}`}>
                      frontend & mobile developer · 5+ years
                    </p>
                    <h1 className='capitalize text-display font-medium'>
                      {NAME}
                    </h1>
                  </div>

                  <div className='space-y-3'>
                    {INTRO.map((p) => (
                      <p key={p} className={`text-lead ${body}`}>
                        {p}
                      </p>
                    ))}
                  </div>

                  <dl className={`grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 border-t ${hairline} pt-4`}>
                    {META.map((m) => (
                      <div key={m.label}>
                        <dt className={`label ${dim}`}>{m.label}</dt>
                        <dd className={`text-meta ${body}`}>{m.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            ) : v === 'terminal' ? (
              <div className={`border ${hairline} divide-y divide-default-50`}>
                <div className='flex items-center gap-2 px-3 py-1.5'>
                  <span className='size-2 rounded-full bg-default-300' />
                  <span className={`label ${dim}`}>~/meera.dev</span>
                </div>
                <div className='p-4 space-y-3'>
                  <p className='text-meta'>
                    <span className='text-emerald-500'>$</span>{' '}
                    <span className={body}>whoami</span>
                  </p>
                  <h1 className='capitalize text-display font-medium'>{NAME}</h1>
                  <dl className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                    {META.map((m) => (
                      <div key={m.label}>
                        <dt className={`label ${dim}`}>{m.label}</dt>
                        <dd className={`text-meta ${body}`}>{m.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className='text-meta pt-1'>
                    <span className='text-emerald-500'>$</span>{' '}
                    <span className={body}>cat about.txt</span>
                  </p>
                  <Intro />
                  <p className='text-meta'>
                    <span className='text-emerald-500'>$</span>{' '}
                    <span className='inline-block w-2 h-4 align-middle bg-default-500 animate-pulse' />
                  </p>
                </div>
              </div>
            ) : v === 'index' ? (
              <div className='space-y-6'>
                <div className='space-y-1'>
                  <h1 className='capitalize text-display font-medium'>{NAME}</h1>
                  <p className={`label ${dim}`}>
                      frontend & mobile developer · 5+ years
                    </p>
                </div>
                <Intro />
                <ul className={`border-t ${hairline}`}>
                  {CONTENTS.map((c) => (
                    <li key={c.n}>
                      <button
                        onClick={() => scrollTo(c.id)}
                        className={`w-full flex items-baseline gap-4 py-2.5 border-b ${hairline} text-left group`}
                      >
                        <span className={`label ${dim} tabular-nums`}>{c.n}</span>
                        <span className='text-title'>{c.title}</span>
                        <span className='h-px flex-1 bg-default-50 self-center' />
                        <span className={`label ${dim} hidden sm:block`}>{c.note}</span>
                        <IconArrowUpRight
                          size={14}
                          className={`${dim} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform`}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : v === 'marquee' ? (
              <div className='space-y-6'>
                <h1
                  className='font-medium uppercase leading-[0.85] tracking-tighter'
                  style={{ fontSize: 'clamp(2.5rem, 13vw, 9rem)' }}
                >
                  Meer
                  <br />
                  Bahadin
                </h1>
                <div className={`grid gap-4 sm:grid-cols-4 border-t ${hairline} pt-4`}>
                  {META.map((m) => (
                    <div key={m.label}>
                      <p className={`label ${dim}`}>{m.label}</p>
                      <p className={`text-meta ${body}`}>{m.value}</p>
                    </div>
                  ))}
                </div>
                <Intro />
              </div>
            ) : v === 'card' ? (
              // -mx cancels the container's inline padding so the card's borders land
              // exactly on the backdrop grid lines rather than inset from them.
              <div className={`border ${hairline} tick-corners p-6 sm:p-8 space-y-5 -mx-[1.2rem]`}>
                <div className='flex items-start justify-between gap-4'>
                  <div className='space-y-1'>
                    <h1 className='capitalize text-display font-medium'>{NAME}</h1>
                    <p className={`label ${dim}`}>
                      frontend & mobile developer · 5+ years
                    </p>
                  </div>
                  <span className={`label ${dim} tabular-nums shrink-0`}>2026</span>
                </div>
                <div className={`border-t ${hairline} pt-5`}>
                  <Intro />
                </div>
                <dl className={`grid grid-cols-2 sm:grid-cols-4 gap-3 border-t ${hairline} pt-5`}>
                  {META.map((m) => (
                    <div key={m.label}>
                      <dt className={`label ${dim}`}>{m.label}</dt>
                      <dd className={`text-meta ${body}`}>{m.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : v === 'split' ? (
              <>
                <h1 className='capitalize text-display font-medium'>{NAME}</h1>
                <div className='grid gap-6 md:grid-cols-[1fr_auto] md:items-end'>
                  <Intro />
                  <dl className={`grid grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-1 md:border-l ${hairline} md:pl-4 shrink-0`}>
                    {META.map((m) => (
                      <div key={m.label}>
                        <dt className={`label ${dim}`}>{m.label}</dt>
                        <dd className={`text-meta ${body}`}>{m.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </>
            ) : (
              <>
                <div className='space-y-1'>
                  <h1 className='capitalize text-display font-medium'>{NAME}</h1>
                  <p className={`label ${dim}`}>
                      frontend & mobile developer · 5+ years
                    </p>
                </div>
                <Intro />
              </>
            )}

            <div
              className={`flex items-center gap-3 flex-wrap ${
                v === 'aside' ? 'justify-center pt-6' : ''
              }`}
            >
              <WorkButton />
              {compact && <ThemeToggle />}
            </div>

            <Credit />
          </motion.div>
        </div>
      </header>
    </LazyMotion>
  )
}
