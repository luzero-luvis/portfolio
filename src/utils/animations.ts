import type { Variants } from 'framer-motion'

export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
}

export const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export const staggerFast: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.05 } },
}

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
}

export const slideDown: Variants = {
  hidden:  { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' } },
  exit:    { opacity: 0, height: 0,      transition: { duration: 0.25, ease: 'easeIn' } },
}

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
}

export const viewport = { once: true, margin: '-80px' }
