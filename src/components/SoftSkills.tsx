import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../utils/animations'
import { softSkills } from '../data/portfolio'
import SectionHeader from './SectionHeader'

export default function SoftSkills() {
  return (
    <section id="soft-skills" className="py-28 px-6" style={{ background: '#ebeee0' }}>
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader kicker="Off the clock" title="Beyond the terminal" subtitle="The human side of engineering." />

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
              whileHover={{ y: -6 }}
              className="card flex flex-col items-center gap-3 p-6 cursor-default"
            >
              <span style={{ fontSize: '1.9rem', lineHeight: 1 }}>{s.icon}</span>
              <span className="font-semibold text-[0.82rem] text-center leading-tight" style={{ color: '#282c20' }}>
                {s.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
