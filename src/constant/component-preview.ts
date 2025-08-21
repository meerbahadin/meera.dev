import { ComponentPreviewItems } from '@/types'

export const componentPreviewItems: ComponentPreviewItems[] = [
  {
    id: 'siri',
    title: 'Siri',
    description: 'A glowing visual inspired by Apple Intelligence aesthetics',
    image: '/shader-previews/siri.png',
    category: 'shader',
    tags: ['glow', 'apple', 'siri'],
    dependency: ['ogl'],
  },
  {
    id: 'galaxy',
    title: 'Galaxy',
    description:
      'A dynamic galaxy background filled with stars and cosmic dust',
    image: '/shader-previews/galaxy.png',
    category: 'shader',
    tags: ['animation', 'space', 'background'],
    dependency: ['ogl'],
  },
  {
    id: 'vale',
    title: 'Vale',
    description: 'A mystical valley scene',
    image: '/shader-previews/vale.png',
    category: 'shader',
    tags: ['gradient', 'atmospheric', 'ambient'],
    dependency: ['ogl'],
  },
  {
    id: 'circle',
    title: 'Circle',
    description: 'A glowing circle that reacts to mouse movement',
    image: '/shader-previews/circle.png',
    category: 'shader',
    tags: ['gradient', 'sphere', 'glow'],
    dependency: ['ogl'],
  },
  {
    id: 'flame',
    title: 'Flame',
    description: 'A stylized flame shader with dynamic movement and light',
    image: '/shader-previews/flame.png',
    category: 'shader',
    tags: ['fire', 'wave', 'light'],
    dependency: ['ogl'],
  },
]
