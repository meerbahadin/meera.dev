export interface ComponentPreviewItems {
  id: string
  title: string
  description: string
  image: string
  category: 'shader' | 'component'
  tags: string[]
  dependency: string[]
}
