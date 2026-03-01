import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../utils/animations'
import { profile } from '../data/portfolio'

const GH_ICON = (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
)
const LI_ICON = (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)
const PH_ICON = (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.4 2 2 0 0 1 3.55 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.74a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
  </svg>
)

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Background glow */}
      <div className="absolute rounded-full pointer-events-none"
        style={{ width: 800, height: 800, background: 'rgba(0,200,150,0.05)', filter: 'blur(140px)', top: -300, left: '50%', transform: 'translateX(-50%)' }} />

      <div className="max-w-[680px] mx-auto relative z-10">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport}>

          {/* Glass card */}
          <motion.div variants={fadeUp}
            className="glass rounded-3xl p-10 text-center"
            style={{ borderColor: 'var(--bd2)' }}>

            <div className="section-label justify-center mb-4">Contact</div>

            <motion.h2 variants={fadeUp}
              className="font-extrabold mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '-1px' }}>
              Let's <span style={{ color: 'var(--g)' }}>Work Together</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="mb-8 leading-[1.75]"
              style={{ fontSize: '1rem', color: 'var(--muted)' }}>
              Open to DevOps roles, collaborations, and interesting infrastructure challenges.
            </motion.p>

            <motion.a variants={fadeUp} href={`mailto:${profile.email}`}
              whileHover={{ y: -2, background: 'transparent', color: 'var(--g)', borderColor: 'var(--g)' }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-[0.98rem] border-2 mb-8 transition-all glow-g"
              style={{ background: 'var(--g)', color: 'var(--bg)', borderColor: 'var(--g)' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              {profile.email}
            </motion.a>

            <motion.div variants={fadeUp}
              className="pt-6 flex flex-wrap gap-3 justify-center"
              style={{ borderTop: '1px solid var(--bd)' }}>
              {[
                { href: profile.github1.url, label: profile.github1.label, icon: GH_ICON },
                { href: profile.github2.url, label: profile.github2.label, icon: GH_ICON },
                { href: profile.linkedin.url, label: profile.linkedin.label, icon: LI_ICON },
                { href: `tel:${profile.phone}`, label: profile.phone, icon: PH_ICON },
              ].map(link => (
                <motion.a key={link.label} href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  whileHover={{ y: -2, borderColor: 'var(--g)', color: 'var(--g)' }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-[0.84rem] font-medium transition-all"
                  style={{ background: 'var(--s1)', border: '1px solid var(--bd)', color: 'var(--text)' }}>
                  {link.icon} {link.label}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
