import { motion } from 'framer-motion'
import { useTypewriter } from '../hooks/useTypewriter'
import { profile } from '../data/portfolio'
import { stagger, fadeUp } from '../utils/animations'

const GH_ICON = (
  <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
)
const LI_ICON = (
  <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)
const PH_ICON = (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.4 2 2 0 0 1 3.55 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.74a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z" />
  </svg>
)
const ML_ICON = (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const namespaces = [
  { ns: 'production', status: 'Synced', pods: '3/3', color: '#00c896' },
  { ns: 'monitoring', status: 'Running', pods: '4/4', color: '#00c896' },
  { ns: 'staging', status: 'Pending', pods: '1/2', color: '#fbbf24' },
]

const metrics = [
  { label: 'Uptime', value: '99.9%', color: '#00c896' },
  { label: 'Nodes', value: '3 OK', color: '#38bdf8' },
  { label: 'Services', value: '12', color: '#a78bfa' },
]

function DashboardCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass shadow-soft rounded-2xl overflow-hidden"
      style={{ minWidth: 340 }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-1.5 px-4 py-3"
        style={{ background: 'rgba(5,8,15,0.9)', borderBottom: '1px solid var(--bd)' }}>
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
        <span className="ml-2 font-mono text-[0.68rem]" style={{ color: 'var(--dim)' }}>
          kubectl get all -A
        </span>
      </div>

      <div className="p-5">
        {/* Namespace table */}
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-2 pb-2 mb-1 font-mono text-[0.65rem] font-semibold tracking-wider"
            style={{ borderBottom: '1px solid var(--bd)', color: 'var(--dim)' }}>
            <span>NAMESPACE</span>
            <span className="text-center">STATUS</span>
            <span className="text-right">PODS</span>
          </div>
          {namespaces.map(row => (
            <div key={row.ns} className="grid grid-cols-3 gap-2 py-2 font-mono text-[0.75rem] items-center"
              style={{ borderBottom: '1px solid rgba(148,163,184,0.05)' }}>
              <span style={{ color: '#38bdf8' }}>{row.ns}</span>
              <span className="flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: row.color }} />
                <span style={{ color: row.color }}>{row.status}</span>
              </span>
              <span className="text-right" style={{ color: 'var(--muted)' }}>{row.pods}</span>
            </div>
          ))}
        </div>

        {/* Metric chips */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {metrics.map(m => (
            <div key={m.label} className="rounded-xl p-3 text-center"
              style={{ background: 'var(--s2)', border: '1px solid var(--bd)' }}>
              <div className="font-black text-[1.1rem] leading-none mb-1" style={{ color: m.color }}>{m.value}</div>
              <div className="font-mono text-[0.62rem]" style={{ color: 'var(--dim)' }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Tool badges */}
        <div className="flex flex-wrap gap-1.5 pt-4" style={{ borderTop: '1px solid var(--bd)' }}>
          {['FluxCD', 'Prometheus', 'Grafana', 'Istio', 'Longhorn'].map(t => (
            <span key={t} className="font-mono text-[0.68rem] px-2 py-0.5 rounded"
              style={{ background: 'var(--gdim)', color: 'var(--g)', border: '1px solid rgba(0,200,150,0.18)' }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  const text = useTypewriter(profile.roles)

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden px-6"
      style={{ paddingTop: '88px', paddingBottom: '5rem' }}>

      {/* Dot-grid background */}
      <div className="dot-grid absolute inset-0 pointer-events-none" style={{
        maskImage: 'radial-gradient(ellipse 90% 90% at 40% 50%, black 30%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 40% 50%, black 30%, transparent 100%)',
      }} />

      {/* Gradient orbs */}
      <div className="absolute rounded-full pointer-events-none animate-orb"
        style={{ width: 600, height: 600, background: 'var(--gbright)', filter: 'blur(120px)', top: -150, left: '5%' }} />
      <div className="absolute rounded-full pointer-events-none"
        style={{ width: 500, height: 500, background: 'var(--bluedim)', filter: 'blur(100px)', bottom: -100, right: '5%', animation: 'orb 11s ease-in-out infinite alternate' }} />
      <div className="absolute rounded-full pointer-events-none"
        style={{ width: 400, height: 400, background: 'var(--purpdim)', filter: 'blur(90px)', top: '50%', left: '40%', animation: 'orb 13s ease-in-out infinite alternate-reverse' }} />

      <div className="relative z-10 max-w-[1100px] mx-auto w-full flex flex-col lg:flex-row gap-12 xl:gap-20 items-center justify-between">

        {/* ── Left: Text content ── */}
        <motion.div variants={stagger} initial="hidden" animate="visible"
          className="flex-1 min-w-0 text-left">

          {/* Available badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-7"
            style={{ background: 'var(--s2)', border: '1px solid var(--bd)', color: 'var(--muted)' }}>
            <span className="w-[7px] h-[7px] rounded-full animate-pulse-dot shrink-0"
              style={{ background: 'var(--g)', boxShadow: '0 0 0 2px rgba(0,200,150,0.2)' }} />
            Open to DevOps opportunities — Bengaluru
          </motion.div>

          {/* Name */}
          <motion.h1 variants={fadeUp} className="gradient-text font-black leading-[1.05] mb-5"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', letterSpacing: '-2px' }}>
            {profile.name}
          </motion.h1>

          {/* Typewriter */}
          <motion.div variants={fadeUp} className="font-mono mb-6 min-h-[1.8rem]"
            style={{ fontSize: 'clamp(0.9rem, 2.2vw, 1.05rem)', color: 'var(--muted)' }}>
            <span style={{ color: 'var(--g)' }}>$ whoami →&nbsp;</span>
            <span>{text}</span>
            <span className="animate-blink" style={{ color: 'var(--g)' }}>▋</span>
          </motion.div>

          {/* Bio */}
          <motion.p variants={fadeUp} className="max-w-[520px] mb-8 leading-[1.85]"
            style={{ fontSize: '1rem', color: 'var(--muted)' }}>
            {profile.bio}
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={fadeUp} className="flex gap-4 flex-wrap mb-7">
            <motion.a href="#projects" whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={e => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-[0.95rem] font-bold transition-all glow-g"
              style={{ background: 'linear-gradient(135deg, var(--g), var(--g2))', color: '#000' }}>
              View Projects →
            </motion.a>
            <motion.a href="#contact" whileHover={{ y: -3, scale: 1.02, borderColor: 'var(--g)' }} whileTap={{ scale: 0.97 }}
              onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-[0.95rem] font-semibold border transition-all"
              style={{ background: 'rgba(14, 20, 40, 0.5)', color: 'var(--text)', borderColor: 'var(--bd2)', backdropFilter: 'blur(10px)' }}>
              Get In Touch
            </motion.a>
          </motion.div>

          {/* Contact chips */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
            {[
              { href: `tel:${profile.phone}`, label: profile.phone, icon: PH_ICON },
              { href: `mailto:${profile.email}`, label: profile.email, icon: ML_ICON },
              { href: profile.github1.url, label: profile.github1.label, icon: GH_ICON, external: true },
              { href: profile.github2.url, label: profile.github2.label, icon: GH_ICON, external: true },
              { href: profile.linkedin.url, label: profile.linkedin.label, icon: LI_ICON, external: true },
            ].map(chip => (
              <motion.a key={chip.label} href={chip.href}
                target={chip.external ? '_blank' : undefined}
                rel={chip.external ? 'noopener noreferrer' : undefined}
                whileHover={{ scale: 1.04, borderColor: 'var(--g)' }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors"
                style={{ background: 'var(--s2)', border: '1px solid var(--bd)', color: 'var(--muted)' }}>
                {chip.icon} {chip.label}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right: Dashboard card (desktop only) ── */}
        <div className="hidden lg:block shrink-0">
          <DashboardCard />
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10"
        style={{ color: 'var(--dim)', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
        <div className="w-px h-11 animate-scroll-line" style={{ background: 'linear-gradient(var(--g), transparent)' }} />
        <span>scroll</span>
      </div>
    </section>
  )
}
