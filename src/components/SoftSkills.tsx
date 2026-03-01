import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../utils/animations'
import { softSkills } from '../data/portfolio'

export default function SoftSkills() {
  return (
    <section id="soft-skills" className="py-24 px-6" style={{ background: 'var(--s1)' }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="mb-12">
          <div className="section-label">Soft Skills</div>
          <h2 className="text-[clamp(1.6rem,4vw,2.2rem)] font-extrabold" style={{ letterSpacing: '-1px' }}>Beyond the Terminal</h2>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {softSkills.map(s => (
            <motion.div key={s.label} variants={fadeUp}
              whileHover={{ y: -5, borderColor: 'var(--g)', background: 'var(--gdim)', boxShadow: '0 8px 24px rgba(0,200,150,0.1)' }}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-200 cursor-default"
              style={{ background: 'var(--s2)', border: '1px solid var(--bd)' }}>
              <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{s.icon}</span>
              <span className="font-semibold text-[0.82rem] text-center leading-tight" style={{ color: 'var(--text)' }}>
                {s.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
