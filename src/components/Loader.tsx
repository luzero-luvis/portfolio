import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PixelText from './PixelText'
import Marks from './Marks'

/** Full-screen intro: name assembles from pixel blocks, then the curtain slides up. */
export default function Loader() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 2200)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center px-6"
          style={{ background: '#0a0a0b' }}
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="w-full max-w-[720px] flex flex-col items-center gap-8">
            <Marks size={12} />
            <PixelText text={'LUVIS\nJOSTON'} maxBlock={16} />
            <div className="text-[0.72rem] tracking-[0.3em] uppercase" style={{ color: '#55555a' }}>
              Loading world<span className="animate-blink">_</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
