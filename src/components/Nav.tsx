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
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileOpen(false)
  }

  const allItems = ['home', ...NAV_ITEMS]

  return (
    <>
      {/* Scan-line sweep */}
      <div className="scanline-overlay" aria-hidden="true" />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[300] h-[2px]" style={{ background: 'transparent' }}>
        <motion.div style={{ scaleX, transformOrigin: '0%', height: '100%', background: 'linear-gradient(90deg, #00FF41, #00CC33)' }} />
      </div>

      <nav
        className="fixed top-0 left-0 right-0 z-[200] transition-all duration-300"
        style={scrolled
          ? { background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,255,65,0.12)' }
          : { background: 'transparent' }}
      >
        <div className="max-w-[1100px] mx-auto flex items-center h-16 px-6 gap-2">

          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-mono text-[1.15rem] font-bold shrink-0 mr-4 transition-opacity hover:opacity-80 tracking-tight"
            aria-label="Back to top"
          >
            <span style={{ color: '#FFB800' }}>&gt;</span>
            <span style={{ color: '#00FF41' }}>_</span>
          </button>

          {/* Desktop nav */}
          <ul className="hidden md:flex gap-0.5 list-none flex-1">
            {allItems.map(id => (
              <li key={id}>
                <button
                  onClick={() => handleNav(id)}
                  className="relative px-3 py-1.5 rounded-md font-mono text-[0.82rem] transition-all duration-200"
                  style={{ color: (active === id || (id === 'home' && !active)) ? '#00FF41' : '#7A8894' }}
                >
                  {(active === id || (id === 'home' && !active)) && (
                    <span className="mr-1 font-bold" style={{ color: '#FFB800' }}>$</span>
                  )}
                  {id}
                  {(active === id || (id === 'home' && !active)) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-[1px]"
                      style={{ background: '#00FF41' }}
                      initial={false}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Hire Me */}
          <a
            href="mailto:luvisjoston@gmail.com"
            className="hidden md:inline-flex shrink-0 items-center px-4 py-2 rounded-lg font-mono text-[0.8rem] font-bold transition-all duration-200 hover:-translate-y-0.5 glow-g-sm"
            style={{ background: '#00FF41', color: '#000000', border: '1px solid #00FF41' }}
          >
            Hire Me
          </a>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] ml-auto p-1 shrink-0"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <motion.span animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7 : 0 }} className="block w-[22px] h-[2px] rounded-sm" style={{ background: '#00FF41' }} />
            <motion.span animate={{ opacity: mobileOpen ? 0 : 1 }} className="block w-[22px] h-[2px] rounded-sm" style={{ background: '#00FF41' }} />
            <motion.span animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7 : 0 }} className="block w-[22px] h-[2px] rounded-sm" style={{ background: '#00FF41' }} />
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
              style={{ background: '#0A0E11', borderTop: '1px solid rgba(0,255,65,0.12)' }}
            >
              <div className="flex flex-col px-6 py-3">
                {allItems.map(id => (
                  <button
                    key={id}
                    onClick={() => handleNav(id)}
                    className="py-3 text-left font-mono text-sm border-b last:border-b-0 transition-colors flex items-center gap-2"
                    style={{ color: active === id ? '#00FF41' : '#7A8894', borderColor: 'rgba(0,255,65,0.08)' }}
                  >
                    <span style={{ color: '#FFB800' }}>$</span>
                    {id}
                  </button>
                ))}
                <a
                  href="mailto:luvisjoston@gmail.com"
                  className="mt-3 mb-1 py-2.5 text-center rounded-lg font-mono text-sm font-bold"
                  style={{ background: '#00FF41', color: '#000000' }}
                >
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
