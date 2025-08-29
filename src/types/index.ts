export type ComponentPreviewItems = {
  id: string
  title: string
  description: string
  image: string
  category: 'shader' | 'component'
  tags: string[]
  dependency: string[]
}

// New types for EXPERIENCES
export type ExperienceItem = {
  text: string
  tech: string[]
}

export type ExperienceRole = {
  title: string
  items: ExperienceItem[]
}

export type Experience = {
  year: string
  title: string
  company: string
  items?: ExperienceItem[]
  roles?: ExperienceRole[]
}

export type RecentWork = {
  title: string
  description: string
  url: string
  image: string
  github: string
  isLive: boolean
}
