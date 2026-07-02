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
import Loader       from './components/Loader'
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
          whileHover={{ y: -2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all"
          style={{ background: '#d2ff00', color: '#111112', boxShadow: '0 10px 30px -8px rgba(210,255,0,0.6)' }}
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
    home: <Hero />,
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
      <Loader />
      <Nav />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {content}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
