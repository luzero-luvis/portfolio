import { useEffect, useState } from 'react'

export const PAGE_IDS = ['home', 'about', 'skills', 'projects', 'blogs', 'education', 'certificates', 'contact'] as const

export type PageId = typeof PAGE_IDS[number]

function segments(pathname: string): string[] {
  return pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)
}

function normalizePathname(pathname: string): PageId {
  const segment = segments(pathname)[0] ?? ''
  return PAGE_IDS.includes(segment as PageId) ? (segment as PageId) : 'home'
}

function readBlogSlug(pathname: string): string | null {
  const parts = segments(pathname)
  return parts[0] === 'blogs' && parts[1] ? parts[1] : null
}

export function getCurrentPage(): PageId {
  return normalizePathname(window.location.pathname)
}

export function getCurrentBlogSlug(): string | null {
  return readBlogSlug(window.location.pathname)
}

export function navigateToPage(page: PageId) {
  const targetPath = page === 'home' ? '/' : `/${page}`
  if (window.location.pathname !== targetPath) {
    window.history.pushState({}, '', targetPath)
    window.dispatchEvent(new Event('pagechange'))
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function navigateToBlogPost(slug: string) {
  const targetPath = `/blogs/${slug}`
  if (window.location.pathname !== targetPath) {
    window.history.pushState({}, '', targetPath)
    window.dispatchEvent(new Event('pagechange'))
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function usePageRoute() {
  const [page, setPage] = useState<PageId>(() => getCurrentPage())

  useEffect(() => {
    const handleChange = () => setPage(getCurrentPage())
    window.addEventListener('popstate', handleChange)
    window.addEventListener('pagechange', handleChange)
    return () => {
      window.removeEventListener('popstate', handleChange)
      window.removeEventListener('pagechange', handleChange)
    }
  }, [])

  return page
}

export function useBlogSlug() {
  const [slug, setSlug] = useState<string | null>(() => getCurrentBlogSlug())

  useEffect(() => {
    const handleChange = () => setSlug(getCurrentBlogSlug())
    window.addEventListener('popstate', handleChange)
    window.addEventListener('pagechange', handleChange)
    return () => {
      window.removeEventListener('popstate', handleChange)
      window.removeEventListener('pagechange', handleChange)
    }
  }, [])

  return slug
}
