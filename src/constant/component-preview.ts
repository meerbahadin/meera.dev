import { ComponentPreviewItems } from '@/types'

export const componentPreviewItems: ComponentPreviewItems[] = [
  {
    id: 'galaxy',
    title: 'Galaxy',
    description: 'Dynamic galaxy background with stars and cosmic dust',
    image: '/shader-previews/galaxy.png',
    category: 'shader',
    tags: ['animation', 'space', 'background'],
    dependency: ['ogl'],
  },
  {
    id: 'vale',
    title: 'Vale',
    description: 'Mystical valley atmosphere with flowing gradients',
    image: '/shader-previews/vale.png',
    category: 'shader',
    tags: ['gradient', 'atmospheric', 'ambient'],
    dependency: ['ogl'],
  },
  {
    id: 'circle',
    title: 'Circle',
    description: 'glowing circle with mouse interactions',
    image: '/shader-previews/circle.png',
    category: 'shader',
    tags: ['gradient', 'sphere', 'glow'],
    dependency: ['ogl'],
  },
  {
    id: 'flame',
    title: 'Flame',
    description: 'glowing circle with mouse interactions',
    image: '/shader-previews/flame.png',
    category: 'shader',
    tags: ['fire', 'wave', 'light'],
    dependency: ['ogl'],
  },
]
