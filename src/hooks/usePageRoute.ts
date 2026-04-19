import { useEffect, useState } from 'react'

export const PAGE_IDS = ['home', 'about', 'skills', 'projects', 'education', 'certificates', 'contact'] as const

export type PageId = typeof PAGE_IDS[number]

function normalizePathname(pathname: string): PageId {
  const segment = pathname.replace(/^\/+|\/+$/g, '')
  return PAGE_IDS.includes(segment as PageId) ? (segment as PageId) : 'home'
}

export function getCurrentPage(): PageId {
  return normalizePathname(window.location.pathname)
}

export function navigateToPage(page: PageId) {
  const targetPath = page === 'home' ? '/' : `/${page}`
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
