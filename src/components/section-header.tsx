import React from 'react'

type Props = {
  index: string
  title: string
  description: string
}

const SectionHeader = ({ index, title, description }: Props) => {
  return (
    <div className='screen-line-before screen-line-after apply-edge px-4'>
      <div className='flex items-baseline gap-3 screen-line-after py-2'>
        <span className='label tabular-nums text-default-500'>{index}</span>
        <h2 className='text-section uppercase tracking-tight'>{title}</h2>
        <span className='h-px flex-1 bg-default-50' aria-hidden='true' />
      </div>
      <p className='text-meta text-default-500 text-balance py-2 max-w-prose'>
        {description}
      </p>
    </div>
  )
}

export default SectionHeader
