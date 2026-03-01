import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../utils/animations'
import { certificates } from '../data/portfolio'

const EXT_ICON = (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

export default function Certificates() {
  return (
    <section id="certificates" className="py-24 px-6" style={{ background: 'var(--s1)' }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="mb-12">
          <div className="section-label">Certificates</div>
          <h2 className="text-[clamp(1.6rem,4vw,2.2rem)] font-extrabold" style={{ letterSpacing: '-1px' }}>Certifications &amp; Badges</h2>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport}
          className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {certificates.map(cert => (
            <motion.div key={cert.name} variants={fadeUp}
              whileHover={{ y: -5, borderColor: 'var(--g)', boxShadow: '0 10px 30px -10px rgba(45,212,191,0.15)' }}
              className="glass shadow-soft rounded-2xl p-6 transition-all duration-300"
              style={{ border: '1px solid var(--bd2)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[1.25rem] shrink-0"
                  style={{ background: cert.logoBg }}>
                  {cert.logo}
                </div>
                <div>
                  <div className="text-[0.75rem]" style={{ color: 'var(--muted)' }}>{cert.issuer}</div>
                  <div className="font-bold text-[0.95rem]">{cert.name}</div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {cert.links.map(link => (
                  <motion.a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                    whileHover={{ gap: '10px' }}
                    className="flex items-center gap-2 text-[0.8rem] transition-all"
                    style={{ color: 'var(--g)' }}>
                    {EXT_ICON} {link.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
