import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../utils/animations'
import { certificates } from '../data/portfolio'
import SectionHeader from './SectionHeader'

const EXT_ICON = (
  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

export default function Certificates() {
  return (
    <section id="certificates" className="py-28 px-6" style={{ background: '#282c20' }}>
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader dark kicker="Credentials" title="Certifications & badges" subtitle="Professional certifications and industry badges." />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid gap-4"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}
        >
          {certificates.map(cert => (
            <motion.div key={cert.name} variants={fadeUp} whileHover={{ y: -5 }} className="card-dark p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[1.3rem] shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  {cert.logo}
                </div>
                <div>
                  <div className="text-[0.72rem] font-semibold uppercase tracking-wider" style={{ color: '#ff6b00' }}>{cert.issuer}</div>
                  <div className="font-display text-[1.1rem] leading-tight" style={{ color: '#ebeee0' }}>{cert.name}</div>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {cert.links.map(link => (
                  <motion.a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-2 text-[0.82rem] font-medium transition-all"
                    style={{ color: '#d2ff00' }}
                  >
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
