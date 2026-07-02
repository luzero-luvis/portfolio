import { motion } from 'framer-motion'
import { fadeUp, viewport } from '../utils/animations'

interface SectionHeaderProps {
  kicker: string
  title: string
  subtitle?: string
  dark?: boolean
}

/** Landon-Norris-style section header: small kicker + oversized Brier title. */
export default function SectionHeader({ kicker, title, subtitle, dark }: SectionHeaderProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className="mb-12"
    >
      <span className={dark ? 'kicker kicker-light' : 'kicker'}>{kicker}</span>
      <h2
        className="font-display mt-5"
        style={{
          fontSize: 'clamp(2.4rem, 7vw, 5rem)',
          color: dark ? '#ebeee0' : '#111112',
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="mt-4 max-w-[640px] text-[1.02rem] leading-[1.6]"
          style={{ color: dark ? '#b4b8a5' : '#535450' }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
