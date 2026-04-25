import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Nav          from './components/Nav'
import Hero         from './components/Hero'
import About        from './components/About'
import Skills       from './components/Skills'
import Projects     from './components/Projects'
import Blogs        from './components/Blogs'
import Education    from './components/Education'
import Certificates from './components/Certificates'
import SoftSkills   from './components/SoftSkills'
import Contact      from './components/Contact'
import Footer       from './components/Footer'
import { usePageRoute } from './hooks/usePageRoute'

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
          whileHover={{ y: -2, boxShadow: '0 0 20px rgba(0,255,65,0.4)' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-xl flex items-center justify-center font-mono text-base font-bold transition-all"
          style={{ background: '#0A0E11', border: '1px solid rgba(0,255,65,0.3)', color: '#00FF41' }}
          aria-label="Back to top"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  const page = usePageRoute()

  const content = {
    home: (
      <>
        <Hero />
      </>
    ),
    about: (
      <>
        <About />
        <SoftSkills />
      </>
    ),
    skills: <Skills />,
    projects: <Projects />,
    blogs: <Blogs />,
    education: <Education />,
    certificates: <Certificates />,
    contact: <Contact />,
  }[page]

  return (
    <>
      <Nav />
      <main>{content}</main>
      <Footer />
      <BackToTop />
    </>
  )
}
