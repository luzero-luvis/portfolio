import { useState, useEffect } from 'react'

export function useScrollSpy(ids: string[], offset = 120) {
  const [active, setActive] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      let current = ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - offset) current = id
      }
      setActive(current)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [ids, offset])

  return active
}
