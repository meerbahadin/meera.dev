import dynamic from 'next/dynamic'
import ComponentPreview from '@/components/component-preview'
import { componentPreviewItems } from '@/constant/component-preview'
import { notFound } from 'next/navigation'
import { Button } from '@heroui/button'
import { IconBrandGithub } from '@tabler/icons-react'
import Link from 'next/link'

const getDynamicComponent = (c: string) =>
  dynamic(
    () =>
      import(`@/components/shaders/${c}`).catch(() => {
        return { default: () => null }
      }),
    {
      loading: () => null,
    }
  )

const getDependencyInstallCommand = (dependencies: string[]) => {
  return `bun i ${dependencies.join(' ')}`
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (!id || typeof id !== 'string') {
    return notFound()
  }

  const item = componentPreviewItems.find((item) => item.id === id)

  if (!item) {
    return notFound()
  }

  const DynamicComponent = getDynamicComponent(id)

  return (
    <main className='overflow-x-hidden'>
      <section className='container max-w-3xl apply-edge pt-20 '>
        <div className='space-y-2 screen-line-before screen-line-after p-4 container max-w-3xl apply-edge'>
          <h1 className='text-2xl screen-line-after screen-line-before'>
            {item.title}
          </h1>
          <p className='text-zinc-400 text-balance'>{item.description}</p>

          {item.tags && item.tags.length > 0 && (
            <div className='flex flex-wrap justify-between items-center gap-2'>
              <div className='flex flex-wrap gap-2 items-center'>
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className='px-2 capitalize py-1 text-xs rounded-md bg-zinc-800/50 text-zinc-400 border border-zinc-700/50'
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Button
                as={Link}
                target='_blank'
                href={`https://github.com/meerbahadin/meera.dev/blob/main/src/components/shaders/${item.id}.tsx`}
                size='sm'
                variant='flat'
                startContent={<IconBrandGithub />}
              >
                source code
              </Button>
            </div>
          )}
        </div>

        <div className='p-2 screen-line-before screen-line-after apply-edge'>
          <ComponentPreview component={<DynamicComponent />} hasReTrigger />
        </div>

        {item.dependency && item.dependency.length > 0 && (
          <div className='space-y-4 screen-line-before screen-line-after p-4 container max-w-3xl apply-edge'>
            <h3 className='text-lg font-medium text-zinc-200 screen-line-before screen-line-after'>
              Installation
            </h3>

            <div className='space-y-3'>
              <div>
                <h4 className='text-sm font-medium text-zinc-300 mb-2'>
                  Dependencies
                </h4>
                <div className='flex flex-wrap gap-2 mb-3'>
                  {item.dependency.map((dep) => (
                    <span
                      key={dep}
                      className='px-2 py-1 text-xs rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/30'
                    >
                      {dep}
                    </span>
                  ))}
                </div>
              </div>

              <div className='bg-zinc-900/50 border border-zinc-800 rounded-lg p-4'>
                <div className='flex items-center justify-between mb-3'>
                  <span className='text-sm font-medium text-zinc-300'>
                    Install command:
                  </span>
                </div>
                <code className='text-sm text-zinc-200 bg-zinc-900 rounded-md font-mono block p-3'>
                  {getDependencyInstallCommand(item.dependency)}
                </code>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
