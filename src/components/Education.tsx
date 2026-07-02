import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../utils/animations'
import { education } from '../data/portfolio'
import SectionHeader from './SectionHeader'

export default function Education() {
  return (
    <section id="education" className="py-28 px-6" style={{ background: '#f4f4ed' }}>
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader kicker="Education" title="Academic background" subtitle="Qualifications and where they came from." />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="relative pl-8"
          style={{ borderLeft: '2px solid #c8cbbd' }}
        >
          {education.map(edu => (
            <motion.div key={edu.school} variants={fadeUp} className="relative pb-10 last:pb-0 pl-8">
              <div className="absolute -left-[2.55rem] top-[6px] w-4 h-4 rounded-full" style={{ background: '#d2ff00', border: '3px solid #f4f4ed', boxShadow: '0 0 0 2px #d2ff00' }} />
              <div className="text-[0.78rem] font-bold uppercase tracking-wider mb-2" style={{ color: '#ff6b00' }}>{edu.years}</div>
              <motion.div whileHover={{ y: -4 }} className="card p-6">
                <div className="font-display text-[1.25rem] mb-1 leading-tight" style={{ color: '#111112' }}>{edu.school}</div>
                <div className="text-[0.9rem]" style={{ color: '#535450' }}>{edu.detail}</div>
                <span className="inline-block mt-3 text-[0.78rem] font-bold px-3 py-1 rounded-full" style={{ background: '#d2ff00', color: '#111112' }}>
                  {edu.score}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
