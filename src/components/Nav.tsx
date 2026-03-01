import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { useScrollSpy } from '../hooks/useScrollSpy'

const NAV_ITEMS = ['about', 'skills', 'projects', 'education', 'certificates', 'contact']

export default function Nav() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const active = useScrollSpy(NAV_ITEMS)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleNav = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[300] h-[2px]" style={{ background: 'transparent' }}>
        <motion.div style={{ scaleX, transformOrigin: '0%', height: '100%', background: 'linear-gradient(90deg, #00c896, #38bdf8)' }} />
      </div>

      <nav
        className="fixed top-0 left-0 right-0 z-[200] transition-all duration-300"
        style={scrolled ? { background: 'rgba(5,8,15,0.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--bd)' } : {}}
      >
        <div className="max-w-[1100px] mx-auto flex items-center h-16 px-6 gap-6">
          {/* Brand */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-mono text-[1.1rem] font-bold shrink-0 transition-opacity hover:opacity-80"
            style={{ color: 'var(--g)' }}>
            <span style={{ color: 'var(--dim)' }}>[</span>LJ<span style={{ color: 'var(--dim)' }}>]</span>
          </button>

          {/* Desktop links */}
          <ul className="hidden md:flex gap-1 list-none flex-1">
            {NAV_ITEMS.map(id => (
              <li key={id}>
                <button
                  onClick={() => handleNav(id)}
                  className="px-3 py-1.5 rounded-md text-sm capitalize transition-all duration-200"
                  style={{
                    color:      active === id ? 'var(--g)'    : 'var(--muted)',
                    background: active === id ? 'var(--gdim)' : 'transparent',
                  }}
                >
                  {id}
                </button>
              </li>
            ))}
          </ul>

          {/* Hire Me */}
          <a href="mailto:luvisjoston@gmail.com"
            className="hidden md:inline-flex shrink-0 items-center px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'var(--g)', color: 'var(--bg)' }}>
            Hire Me
          </a>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] ml-auto p-1 shrink-0"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Menu"
          >
            <motion.span animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7 : 0 }}
              className="block w-[22px] h-[2px] rounded-sm" style={{ background: 'var(--text)' }} />
            <motion.span animate={{ opacity: mobileOpen ? 0 : 1 }}
              className="block w-[22px] h-[2px] rounded-sm" style={{ background: 'var(--text)' }} />
            <motion.span animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7 : 0 }}
              className="block w-[22px] h-[2px] rounded-sm" style={{ background: 'var(--text)' }} />
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden md:hidden"
              style={{ background: 'var(--s1)', borderTop: '1px solid var(--bd)' }}
            >
              <div className="flex flex-col px-6 py-3">
                {NAV_ITEMS.map(id => (
                  <button key={id} onClick={() => handleNav(id)}
                    className="py-3 text-left text-sm capitalize border-b last:border-b-0 transition-colors"
                    style={{ color: 'var(--muted)', borderColor: 'var(--bd)' }}>
                    {id}
                  </button>
                ))}
                <a href="mailto:luvisjoston@gmail.com"
                  className="mt-3 mb-1 py-2.5 text-center rounded-lg text-sm font-bold"
                  style={{ background: 'var(--g)', color: 'var(--bg)' }}>
                  Hire Me
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}
