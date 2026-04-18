import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../utils/animations'
import { certificates } from '../data/portfolio'
import TerminalHeader from './TerminalHeader'

const EXT_ICON = (
  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

export default function Certificates() {
  return (
    <section id="certificates" className="py-24 px-6" style={{ background: '#0A0E11' }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
          <TerminalHeader command="ls -la certs/" subtitle="Professional certifications and industry badges" />
          <h2 className="font-extrabold mb-12 -mt-6" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: '#C5CDD3', fontFamily: "'JetBrains Mono', monospace" }}>Certifications &amp; Badges</h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid gap-4"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}
        >
          {certificates.map(cert => (
            <motion.div
              key={cert.name}
              variants={fadeUp}
              whileHover={{ y: -5, borderColor: 'rgba(0,255,65,0.35)', boxShadow: '0 10px 30px -10px rgba(0,255,65,0.15)' }}
              className="glass shadow-soft rounded-2xl p-6 transition-all duration-300"
              style={{ border: '1px solid rgba(30,39,46,0.9)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[1.25rem] shrink-0"
                  style={{ background: cert.logoBg }}
                >
                  {cert.logo}
                </div>
                <div>
                  <div className="font-mono text-[0.72rem]" style={{ color: '#5A6873' }}>{cert.issuer}</div>
                  <div className="font-bold text-[0.92rem]" style={{ color: '#C5CDD3' }}>{cert.name}</div>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-3" style={{ borderTop: '1px solid rgba(0,255,65,0.08)' }}>
                {cert.links.map(link => (
                  <motion.a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 3, color: '#00CC33' }}
                    className="flex items-center gap-2 font-mono text-[0.78rem] transition-all"
                    style={{ color: '#00FF41' }}
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
