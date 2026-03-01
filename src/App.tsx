import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Nav          from './components/Nav'
import Hero         from './components/Hero'
import About        from './components/About'
import Skills       from './components/Skills'
import Projects     from './components/Projects'
import Education    from './components/Education'
import Certificates from './components/Certificates'
import SoftSkills   from './components/SoftSkills'
import Contact      from './components/Contact'
import Footer       from './components/Footer'

function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const handler = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ borderColor: 'var(--g)', color: 'var(--g)', y: -2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold transition-colors"
          style={{ background: 'var(--s2)', border: '1px solid var(--bd)', color: 'var(--muted)' }}
          aria-label="Back to top"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Certificates />
        <SoftSkills />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
