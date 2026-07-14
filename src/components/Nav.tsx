import { useState } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { navigateToPage, usePageRoute, type PageId } from '../hooks/usePageRoute'
import { profile } from '../data/portfolio'
import Marks from './Marks'

const NAV_ITEMS: PageId[] = ['about', 'skills', 'projects', 'blogs', 'education', 'certificates', 'contact']

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const active = usePageRoute()

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  const handleNav = (id: PageId) => {
    navigateToPage(id)
    setMobileOpen(false)
  }

  const allItems: PageId[] = ['home', ...NAV_ITEMS]

  return (
    <>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[300] h-[3px]" style={{ background: 'transparent' }}>
        <motion.div style={{ scaleX, transformOrigin: '0%', height: '100%', background: '#4398cd' }} />
      </div>

      {/* ── Desktop: fixed left sidebar (yn10-style) ── */}
      <aside
        className="hidden md:flex fixed left-0 top-0 bottom-0 w-[200px] z-[200] flex-col px-6 py-8"
        style={{ borderRight: '1px solid #232326', background: 'rgba(10,10,11,0.72)', backdropFilter: 'blur(8px)' }}
      >
        {/* boxed logo */}
        <button
          onClick={() => handleNav('home')}
          className="self-start px-2.5 py-1.5 font-display text-[1.05rem] transition-colors hover:text-white"
          style={{ border: '2px solid #4a4a4e', color: '#e8e8e6' }}
          aria-label="Go to home page"
        >
          L.10
        </button>

        <div className="mt-4 text-[0.72rem] leading-[1.6]" style={{ color: '#8a8a86' }}>
          Luvis Joston<br />DevOps<br />Engineer
        </div>

        <div className="mt-5"><Marks size={8} /></div>

        {/* links */}
        <ul className="mt-8 flex-1 space-y-2.5 list-none">
          {allItems.map(id => (
            <li key={id}>
              <button
                onClick={() => handleNav(id)}
                className="flex items-center gap-2 text-[0.8rem] transition-colors duration-200 hover:text-white"
                style={{ color: active === id ? '#e8e8e6' : '#77777c', fontWeight: active === id ? 700 : 400 }}
              >
                {active === id && <span className="w-2 h-2 shrink-0" style={{ background: '#4398cd' }} />}
                {id}
              </button>
            </li>
          ))}
        </ul>

        {/* socials + hire */}
        <div className="space-y-1.5 text-[0.68rem]" style={{ color: '#77777c' }}>
          <a href={profile.github2.url} target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">GitHub</a>
          <a href={profile.linkedin.url} target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">LinkedIn</a>
          <a href={`mailto:${profile.email}`} className="block hover:text-white transition-colors">Email</a>
        </div>
        <a href={`mailto:${profile.email}`} className="pill mt-5 justify-center" style={{ padding: '9px 14px', fontSize: '0.7rem' }}>
          Hire Me
        </a>
      </aside>

      {/* ── Mobile: top bar + dropdown ── */}
      <nav
        className="md:hidden fixed top-0 left-0 right-0 z-[200]"
        style={{ background: 'rgba(10,10,11,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #232326' }}
      >
        <div className="flex items-center h-[60px] px-5 gap-3">
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5"
            aria-label="Go to home page"
          >
            <Marks size={8} />
            <span className="font-display text-[1.1rem]" style={{ color: '#e8e8e6' }}>LUVIS.10</span>
          </button>

          <button
            className="flex flex-col gap-[5px] ml-auto p-1 shrink-0"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <motion.span animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7 : 0 }} className="block w-[24px] h-[2px]" style={{ background: '#e8e8e6' }} />
            <motion.span animate={{ opacity: mobileOpen ? 0 : 1 }} className="block w-[24px] h-[2px]" style={{ background: '#e8e8e6' }} />
            <motion.span animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7 : 0 }} className="block w-[24px] h-[2px]" style={{ background: '#e8e8e6' }} />
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
              style={{ background: '#0a0a0b', borderTop: '1px solid #232326' }}
            >
              <div className="flex flex-col px-5 py-3">
                {allItems.map(id => (
                  <button
                    key={id}
                    onClick={() => handleNav(id)}
                    className="py-3 text-left text-sm uppercase tracking-wider border-b last:border-b-0 transition-colors flex items-center gap-2"
                    style={{ color: active === id ? '#e8e8e6' : '#77777c', borderColor: '#232326' }}
                  >
                    {active === id && <span className="w-2 h-2 shrink-0" style={{ background: '#4398cd' }} />}
                    {id}
                  </button>
                ))}
                <a href={`mailto:${profile.email}`} className="pill mt-4 mb-1 justify-center">Hire Me</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}
