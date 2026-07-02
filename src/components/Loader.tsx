import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { profile } from '../data/portfolio'

/** Full-screen intro: name reveals, lime bar fills, curtain slides up. */
export default function Loader() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1900)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center px-6"
          style={{ background: '#111112' }}
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="overflow-hidden">
            <motion.h1
              className="font-display text-center"
              style={{ fontSize: 'clamp(2.6rem, 11vw, 8rem)', color: '#ebeee0' }}
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              {profile.name}
            </motion.h1>
          </div>

          <motion.div
            className="mt-8 h-[3px] rounded-full overflow-hidden"
            style={{ width: 'min(320px, 70vw)', background: 'rgba(255,255,255,0.12)' }}
          >
            <motion.div
              className="h-full"
              style={{ background: '#d2ff00' }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
