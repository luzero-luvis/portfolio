import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { navigateToPage, usePageRoute, type PageId } from '../hooks/usePageRoute'

const NAV_ITEMS: PageId[] = ['about', 'skills', 'projects', 'blogs', 'education', 'certificates', 'contact']

export default function Nav() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const active = usePageRoute()

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleNav = (id: PageId) => {
    navigateToPage(id)
    setMobileOpen(false)
  }

  const allItems: PageId[] = ['home', ...NAV_ITEMS]

  return (
    <>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[300] h-[3px]" style={{ background: 'transparent' }}>
        <motion.div style={{ scaleX, transformOrigin: '0%', height: '100%', background: '#d2ff00' }} />
      </div>

      <nav
        className="fixed top-0 left-0 right-0 z-[200] transition-all duration-300"
        style={scrolled
          ? { background: 'rgba(235,238,224,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #dde1d2' }
          : { background: 'transparent' }}
      >
        <div className="max-w-[1200px] mx-auto flex items-center h-[72px] px-6 gap-2">

          {/* Logo — Brier wordmark */}
          <button
            onClick={() => handleNav('home')}
            className="font-display text-[1.5rem] shrink-0 mr-6 transition-opacity hover:opacity-70"
            style={{ color: '#111112' }}
            aria-label="Go to home page"
          >
            LUVIS<span style={{ color: '#ff6b00' }}>.</span>
          </button>

          {/* Desktop nav */}
          <ul className="hidden md:flex gap-1 list-none flex-1">
            {allItems.map(id => (
              <li key={id}>
                <button
                  onClick={() => handleNav(id)}
                  className="relative px-3 py-2 text-[0.82rem] font-semibold uppercase tracking-wider transition-colors duration-200"
                  style={{ color: active === id ? '#111112' : '#535450' }}
                >
                  {id}
                  {active === id && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-0.5 left-3 right-3 h-[2px]"
                      style={{ background: '#d2ff00' }}
                      initial={false}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Hire Me */}
          <a href="mailto:luvisjoston@gmail.com" className="hidden md:inline-flex pill shrink-0" style={{ padding: '10px 22px', fontSize: '0.8rem' }}>
            Hire Me
          </a>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] ml-auto p-1 shrink-0"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <motion.span animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7 : 0 }} className="block w-[24px] h-[2px] rounded-sm" style={{ background: '#111112' }} />
            <motion.span animate={{ opacity: mobileOpen ? 0 : 1 }} className="block w-[24px] h-[2px] rounded-sm" style={{ background: '#111112' }} />
            <motion.span animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7 : 0 }} className="block w-[24px] h-[2px] rounded-sm" style={{ background: '#111112' }} />
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden md:hidden"
              style={{ background: '#ebeee0', borderTop: '1px solid #dde1d2' }}
            >
              <div className="flex flex-col px-6 py-3">
                {allItems.map(id => (
                  <button
                    key={id}
                    onClick={() => handleNav(id)}
                    className="py-3 text-left text-sm font-semibold uppercase tracking-wider border-b last:border-b-0 transition-colors"
                    style={{ color: active === id ? '#111112' : '#535450', borderColor: '#dde1d2' }}
                  >
                    {id}
                  </button>
                ))}
                <a href="mailto:luvisjoston@gmail.com" className="pill mt-4 mb-1 justify-center">Hire Me</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}
