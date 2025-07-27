import Image from 'next/image'
import DarkVeil from './components/space'

export default function Home() {
  return (
    <>
      <div className='min-h-screen w-full relative grid isolate'>
        {/* <div
          className='absolute inset-0 -z-10 pointer-events-none'
          style={{
            background:
              'radial-gradient(125% 125% at 50% 100%, #000000 40%, #2b0707 100%)',
          }}
        /> */}

        <div
          style={{
            width: '100%',
            height: '100dvh',
            position: 'absolute',
          }}
        >
          <DarkVeil />
        </div>
        <div className='gap-4 z-50  p-10 container mx-auto max-w-3xl '>
          <div className='flex justify-between items-center'>
            <Image
              src='/logo.svg'
              alt='Next.js logo'
              width={40}
              height={40}
              priority
            />

            <div>
              <p className='capitalize text-lg'>meer bahadin</p>
              <p className='text-sm capitalize text-gray-400'>
                senior front-end developer
              </p>
            </div>
          </div>

          <div className='mt-20'>
            <p>
              Full stack developer - UI / UX Designer, focused on Javascript,
              Nodejs, React. I work as a full stack developer. You’ve found my
              personal website on the internet.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
