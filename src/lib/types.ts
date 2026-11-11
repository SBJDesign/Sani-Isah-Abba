export type PubType = 'journal' | 'conference' | 'chapter' | 'book' | 'preprint' | 'thesis'

export interface Publication {
  id: string
  title: string
  authors: string
  venue: string
  year: number
  type: PubType
  doi?: string
  url?: string
  pdf_url?: string
  abstract?: string
  keywords?: string[]
  featured?: boolean
  created_at?: string
}

export interface Project {
  id: string
  title: string
  summary: string
  body?: string
  status: 'ongoing' | 'completed'
  funder?: string
  start_year?: number
  end_year?: number
  tags?: string[]
  sort_order?: number
  created_at?: string
}

export type PostCategory = 'news' | 'award' | 'talk' | 'grant' | 'media'

export interface Post {
  id: string
  title: string
  date: string // YYYY-MM-DD, YYYY-MM or YYYY
  category: PostCategory
  body: string
  link?: string
  published: boolean
  created_at?: string
}

export interface Message {
  id: string
  name: string
  email: string
  subject?: string
  body: string
  read?: boolean
  created_at?: string
}

export interface Profile {
  name: string
  honorific: string
  title: string
  affiliation: string
  location: string
  headline: string
  bio: string // paragraphs separated by blank lines
  email: string
  photo_url?: string
  cv_url?: string
  interests: string[]
  stats: { label: string; value: string }[]
  education: { degree: string; institution: string; year?: string }[]
  appointments: { role: string; institution: string; period: string }[]
  links: { label: string; url: string }[]
  sections?: { title: string; items: string[] }[] // extra About-page lists: honours, patents, teaching…
}

export interface Photo {
  id: string
  image_url: string
  caption: string
  date?: string // free text, e.g. "2024" or "March 2024"
  featured?: boolean
  sort_order?: number
  created_at?: string
}

export type Collection = 'publications' | 'projects' | 'posts' | 'messages' | 'gallery'
export type CollectionMap = {
  publications: Publication
  projects: Project
  posts: Post
  messages: Message
  gallery: Photo
}

export const PUB_TYPE_LABEL: Record<PubType, string> = {
  journal: 'Journal article',
  conference: 'Conference paper',
  chapter: 'Book chapter',
  book: 'Book',
  preprint: 'Preprint',
  thesis: 'Thesis',
}

export const POST_CATEGORY_LABEL: Record<PostCategory, string> = {
  news: 'News',
  award: 'Award',
  talk: 'Talk',
  grant: 'Grant',
  media: 'Media',
}
