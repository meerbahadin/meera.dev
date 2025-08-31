import React from 'react'

type Props = {
  title: string
  description: string
}

const SectionHeader = ({ title, description }: Props) => {
  return (
    <div className='screen-line-before screen-line-after apply-edge px-4'>
      <p className='text-2xl screen-line-after py-1 capitalize'>{title}</p>
      <p className='text-zinc-400 text-balance py-1'>{description}</p>
    </div>
  )
}

export default SectionHeader
