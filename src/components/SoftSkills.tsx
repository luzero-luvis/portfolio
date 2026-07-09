import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../utils/animations'
import { softSkills } from '../data/portfolio'
import SectionHeader from './SectionHeader'

const ICONS: Record<string, JSX.Element> = {
  Communication: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Collaboration: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Adaptability: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  Ownership: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  ),
}

export default function SoftSkills() {
  return (
    <section id="soft-skills" className="py-28 px-6" style={{ background: '#ebeee0' }}>
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader kicker="How I work" title="Beyond the terminal" subtitle="The non-technical half of running reliable systems." />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid sm:grid-cols-2 gap-5 max-w-[900px]"
        >
          {softSkills.map(s => (
            <motion.div key={s.label} variants={fadeUp} className="card p-6 flex gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: '#282c20', color: '#d2ff00' }}
              >
                {ICONS[s.label]}
              </div>
              <div>
                <h3 className="font-bold text-[0.95rem] mb-1" style={{ color: '#111112' }}>{s.label}</h3>
                <p className="text-[0.88rem] leading-[1.6]" style={{ color: '#535450' }}>{s.blurb}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
