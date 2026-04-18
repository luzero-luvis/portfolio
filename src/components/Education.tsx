import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../utils/animations'
import { education } from '../data/portfolio'
import TerminalHeader from './TerminalHeader'

export default function Education() {
  return (
    <section id="education" className="py-24 px-6" style={{ background: '#000000' }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
          <TerminalHeader command="cat education.log" subtitle="Academic background and qualifications" />
          <h2 className="font-extrabold mb-12 -mt-6" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: '#C5CDD3', fontFamily: "'JetBrains Mono', monospace" }}>Academic Background</h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="relative pl-8"
          style={{ borderLeft: '1px solid rgba(0,255,65,0.15)' }}
        >
          {/* Green gradient line overlay */}
          <div className="absolute left-0 top-2 bottom-2 w-px" style={{ background: 'linear-gradient(#00FF41, rgba(0,255,65,0.1))' }} />

          {education.map(edu => (
            <motion.div key={edu.school} variants={fadeUp} className="relative pb-10 last:pb-0 pl-8">
              {/* Timeline dot */}
              <div
                className="absolute -left-[2.5rem] top-[6px] w-3 h-3 rounded-full"
                style={{ background: '#000000', border: '2px solid #00FF41', boxShadow: '0 0 0 3px rgba(0,255,65,0.15), 0 0 8px rgba(0,255,65,0.3)' }}
              />

              <div className="font-mono text-[0.72rem] font-bold mb-2 tracking-wide" style={{ color: '#00FF41' }}>
                {edu.years}
              </div>
              <motion.div
                whileHover={{ borderColor: 'rgba(0,255,65,0.35)', boxShadow: '0 10px 30px -10px rgba(0,255,65,0.15)', y: -3 }}
                className="glass shadow-soft rounded-2xl p-6 transition-all duration-300"
                style={{ border: '1px solid rgba(30,39,46,0.9)' }}
              >
                <div className="font-bold text-[0.98rem] mb-1" style={{ color: '#C5CDD3' }}>{edu.school}</div>
                <div className="font-mono text-[0.82rem]" style={{ color: '#7A8894' }}>{edu.detail}</div>
                <span
                  className="inline-block mt-3 font-mono text-[0.75rem] font-bold px-2.5 py-0.5 rounded-md"
                  style={{ background: 'rgba(0,255,65,0.08)', border: '1px solid rgba(0,255,65,0.2)', color: '#00FF41' }}
                >
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
