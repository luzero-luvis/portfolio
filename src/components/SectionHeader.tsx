import { motion } from 'framer-motion'
import { fadeUp, viewport } from '../utils/animations'
import Marks from './Marks'
import PixelText from './PixelText'

interface SectionHeaderProps {
  kicker: string
  title: string
  subtitle?: string
  dark?: boolean // kept for call-site compat; the whole world is dark now
}

/** Pixel-world section header: marks + big pixel-block section name + mono lead. */
export default function SectionHeader({ kicker, title, subtitle }: SectionHeaderProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className="mb-14"
    >
      <div className="mb-6"><Marks size={11} /></div>
      <PixelText text={kicker.toUpperCase()} maxBlock={12} />
      <h2 className="font-display mt-6 text-[1.15rem] md:text-[1.5rem]" style={{ color: '#e8e8e6', lineHeight: 1.25 }}>
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-[620px] text-[0.92rem] leading-[1.75]" style={{ color: '#8a8a86' }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
