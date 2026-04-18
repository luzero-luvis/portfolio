import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../utils/animations'
import { softSkills } from '../data/portfolio'
import TerminalHeader from './TerminalHeader'

export default function SoftSkills() {
  return (
    <section id="soft-skills" className="py-24 px-6" style={{ background: '#000000' }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
          <TerminalHeader command="./skills --soft" subtitle="The human side of engineering" />
          <h2 className="font-extrabold mb-12 -mt-6" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: '#C5CDD3', fontFamily: "'JetBrains Mono', monospace" }}>Beyond the Terminal</h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {softSkills.map(s => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              whileHover={{ y: -5, borderColor: 'rgba(0,255,65,0.4)', background: 'rgba(0,255,65,0.06)', boxShadow: '0 8px 24px rgba(0,255,65,0.12)' }}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-200 cursor-default"
              style={{ background: '#0A0E11', border: '1px solid rgba(30,39,46,0.9)' }}
            >
              <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{s.icon}</span>
              <span className="font-mono font-semibold text-[0.8rem] text-center leading-tight" style={{ color: '#C5CDD3' }}>
                {s.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
