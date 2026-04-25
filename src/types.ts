export type Theme = 'blue' | 'teal' | 'orange' | 'purple' | 'green' | 'yellow' | 'pink' | 'gray'
export type BadgeTheme = 'green' | 'blue' | 'purple' | 'orange'

export interface ThemeColors {
  border: string
  bg: string
  text: string
}

export interface SkillCategory {
  name: string
  icon: string
  theme: Theme
  skills: string[]
}

export interface Project {
  number: string
  title: string
  description: string
  badge: string
  badgeTheme: BadgeTheme
  accentColor: string
  points: string[]
  tags: string[]
  githubUrl: string
}

export interface BlogSection {
  heading: string
  paragraphs: string[]
}

export interface BlogPost {
  slug: string
  title: string
  category: string
  repo: string
  readTime: string
  accentColor: string
  summary: string
  highlight: string
  stack: string[]
  takeaways: string[]
  githubUrl: string
  sections: BlogSection[]
}

export interface Education {
  years: string
  school: string
  detail: string
  score: string
}

export interface CertLink {
  label: string
  url: string
}

export interface Certificate {
  issuer: string
  name: string
  logo: string
  logoBg: string
  links: CertLink[]
}

export interface Stat {
  number: string
  label: string
}

export interface ContactLink {
  label: string
  href: string
  icon: 'github' | 'linkedin' | 'phone'
}
