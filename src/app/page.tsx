import Image from 'next/image'
import Galaxy from './components/space'

export default function Home() {
  return (
    <>
      <div className='min-h-screen w-full relative grid place-content-center isolate'>
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
          <Galaxy
            mouseRepulsion={true}
            mouseInteraction={true}
            density={1}
            saturation={0.8}
            glowIntensity={0.2}
            hueShift={240}
            speed={0.1}
            starSpeed={0.2}
            rotationSpeed={0.1}
          />
        </div>
        <div className='flex flex-col items-center text-center  gap-4 z-50'>
          <Image
            src='/logo.svg'
            alt='Next.js logo'
            width={40}
            height={40}
            priority
          />

          <div>
            <p className='capitalize '>meer bahadin</p>
            <p className='text-sm capitalize text-gray-400'>
              front-end developer
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
