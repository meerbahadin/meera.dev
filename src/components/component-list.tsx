'use client'

import { componentPreviewItems } from '@/constant/component-preview'
import { Button } from '@heroui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const Categories = {
  all: 'All',
  shader: 'Shaders',
  component: 'Components',
} as const

type CategoryKey = keyof typeof Categories

const ComponentList = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all')
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const filteredComponents = componentPreviewItems.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  )

  return (
    <section className='container max-w-3xl apply-edge pt-20 '>
      <div className='space-y-2 screen-line-before screen-line-after p-4 container max-w-3xl apply-edge'>
        <h1 className='text-2xl screen-line-after screen-line-before'>
          Components
        </h1>
        <p className='text-zinc-400 text-balance'>
          A curated collection of reusable components and visually striking
          shader backgrounds, transformed into React Component.
        </p>
      </div>

      <div className='flex gap-2 py-2 px-4 screen-line-before screen-line-after apply-edge mt-2'>
        {Object.entries(Categories).map(([key, label]) => (
          <Button
            key={key}
            onPress={() => setSelectedCategory(key as CategoryKey)}
            color='primary'
            size='sm'
            variant={selectedCategory === key ? 'solid' : 'light'}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-2 screen-line-after apply-edge'>
        {filteredComponents.map((item) => (
          <Link key={item.id} href={`/components/${item.id}`}>
            <div
              className='group cursor-pointer p-2'
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className='space-y-2'>
                <div className='relative aspect-video overflow-hidden rounded-xl border border-default-100'>
                  <Image
                    alt={item.title}
                    className={`object-cover transition-all duration-300`}
                    src={item.image}
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  />

                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
                      hoveredItem === item.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className='absolute bottom-3 left-3 right-3'>
                      <div className='flex flex-wrap gap-1'>
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className='px-2 py-1 bg-black/50 backdrop-blur-sm text-xs text-white rounded-md'
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <h3 className='font-semibold text-zinc-100 group-hover:text-primary transition-colors'>
                      {item.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full border capitalize ${
                        item.category === 'shader'
                          ? 'text-purple-400 border-purple-400/30 bg-purple-400/10'
                          : 'text-blue-400 border-blue-400/30 bg-blue-400/10'
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>
                  <p className='text-sm text-zinc-400 leading-relaxed line-clamp-2'>
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {filteredComponents.length === 0 && (
          <div className='text-center py-12 w-full space-y-2 col-span-3 justify-center'>
            <p className='text-zinc-500 text-lg'>No {selectedCategory} found</p>
            <Button
              variant='flat'
              className='capitalize'
              size='sm'
              onPress={() => setSelectedCategory('all')}
            >
              view all components
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

export default ComponentList
