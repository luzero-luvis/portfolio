import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../utils/animations'
import { education } from '../data/portfolio'

export default function Education() {
  return (
    <section id="education" className="py-24 px-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="mb-12">
          <div className="section-label">Education</div>
          <h2 className="text-[clamp(1.6rem,4vw,2.2rem)] font-extrabold" style={{ letterSpacing: '-1px' }}>Academic Background</h2>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport}
          className="relative pl-8"
          style={{ borderLeft: '1px solid var(--bd)' }}
        >
          {/* Timeline line gradient overlay */}
          <div className="absolute left-0 top-2 bottom-2 w-px" style={{ background: 'linear-gradient(var(--g), transparent)' }} />

          {education.map((edu) => (
            <motion.div key={edu.school} variants={fadeUp}
              className="relative pb-10 last:pb-0 pl-8">
              {/* Timeline dot */}
              <div className="absolute -left-[2.5rem] top-[6px] w-3 h-3 rounded-full"
                style={{ background: 'var(--bg)', border: '2px solid var(--g)', boxShadow: '0 0 0 3px rgba(0,200,150,0.13)' }} />

              <div className="font-mono text-[0.72rem] font-bold mb-2 tracking-wide" style={{ color: 'var(--g)' }}>
                {edu.years}
              </div>
              <motion.div whileHover={{ borderColor: 'var(--g)', boxShadow: '0 10px 30px -10px rgba(45,212,191,0.15)', y: -3 }}
                className="glass shadow-soft rounded-2xl p-6 transition-all duration-300"
                style={{ border: '1px solid var(--bd2)' }}>
                <div className="font-bold text-[0.98rem] mb-1" style={{ color: 'var(--text)' }}>{edu.school}</div>
                <div className="text-[0.84rem]" style={{ color: 'var(--muted)' }}>{edu.detail}</div>
                <span className="inline-block mt-3 text-[0.78rem] font-bold px-2.5 py-0.5 rounded-md"
                  style={{ background: 'var(--gdim)', border: '1px solid rgba(0,200,150,0.2)', color: 'var(--g)' }}>
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
