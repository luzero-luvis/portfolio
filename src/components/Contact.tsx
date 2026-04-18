import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../utils/animations'
import { profile } from '../data/portfolio'
import TerminalHeader from './TerminalHeader'

const GH_ICON = (<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z"/></svg>)
const LI_ICON = (<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>)
const PH_ICON = (<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.4 2 2 0 0 1 3.55 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.74a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/></svg>)
const ML_ICON = (<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>)

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent('Portfolio Contact from ' + form.name)}&body=${encodeURIComponent(body)}`
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  const inputStyle = {
    background: '#0A0E11',
    border: '1px solid rgba(0,255,65,0.15)',
    color: '#C5CDD3',
    caretColor: '#00FF41',
  }

  const links = [
    { href: `mailto:${profile.email}`, label: profile.email,         icon: ML_ICON },
    { href: `tel:${profile.phone}`,   label: profile.phone,         icon: PH_ICON },
    { href: profile.github1.url,      label: profile.github1.label, icon: GH_ICON, ext: true },
    { href: profile.github2.url,      label: profile.github2.label, icon: GH_ICON, ext: true },
    { href: profile.linkedin.url,     label: 'LinkedIn',            icon: LI_ICON, ext: true },
  ]

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden" style={{ background: '#0A0E11' }}>
      <div className="absolute rounded-full pointer-events-none" style={{ width: 700, height: 700, background: 'rgba(0,255,65,0.04)', filter: 'blur(120px)', top: -200, left: '50%', transform: 'translateX(-50%)' }} />
      <div className="max-w-[820px] mx-auto relative z-10">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
          <TerminalHeader command="ping contact.server" subtitle="Open to DevOps roles, collaborations, and interesting infrastructure challenges" />
        </motion.div>

        {/* Availability badge */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[0.8rem]" style={{ background: 'rgba(0,255,65,0.08)', border: '1px solid rgba(0,255,65,0.25)', color: '#00FF41' }}>
            <span className="w-2 h-2 rounded-full animate-pulse-dot shrink-0" style={{ background: '#00FF41', boxShadow: '0 0 0 3px rgba(0,255,65,0.2)' }} />
            Available for opportunities · {profile.location}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-[1fr_270px] gap-8">
          {/* Form */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
            <motion.div whileHover={{ borderColor: 'rgba(0,255,65,0.25)' }} className="glass shadow-soft rounded-2xl overflow-hidden transition-all" style={{ border: '1px solid rgba(30,39,46,0.9)' }}>
              <div className="flex items-center gap-1.5 px-4 py-3" style={{ background: '#000', borderBottom: '1px solid rgba(0,255,65,0.1)' }}>
                <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
                <span className="ml-2 font-mono text-[0.68rem]" style={{ color: '#5A6873' }}>~/send-message.sh</span>
              </div>
              <form onSubmit={handleSubmit} className="p-7 space-y-5">
                {(['name', 'email'] as const).map(field => (
                  <div key={field}>
                    <label className="flex items-center gap-2 font-mono text-[0.8rem] mb-2" style={{ color: '#00FF41' }}>
                      <span style={{ color: '#FFB800' }}>{'>'}</span> {field}
                    </label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      required
                      value={form[field]}
                      onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                      placeholder={field === 'email' ? 'your@email.com' : 'your name'}
                      className="w-full font-mono text-[0.85rem] px-4 py-3 rounded-lg outline-none transition-all"
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = 'rgba(0,255,65,0.5)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(0,255,65,0.15)')}
                    />
                  </div>
                ))}
                <div>
                  <label className="flex items-center gap-2 font-mono text-[0.8rem] mb-2" style={{ color: '#00FF41' }}>
                    <span style={{ color: '#FFB800' }}>{'>'}</span> message
                  </label>
                  <textarea
                    required rows={5}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell me about the role or project..."
                    className="w-full font-mono text-[0.85rem] px-4 py-3 rounded-lg outline-none transition-all resize-none"
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = 'rgba(0,255,65,0.5)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(0,255,65,0.15)')}
                  />
                </div>
                <motion.button type="submit" whileHover={{ y: -2, boxShadow: '0 0 30px rgba(0,255,65,0.35)' }} whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-xl font-mono font-bold text-[0.9rem] transition-all"
                  style={{ background: '#00FF41', color: '#000', border: '2px solid #00FF41' }}>
                  {sent ? '✓ Message Sent!' : '$ send --message'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>

          {/* Direct links */}
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport} className="flex flex-col gap-3">
            <p className="font-mono text-[0.78rem] mb-1" style={{ color: '#5A6873' }}>// direct links</p>
            {links.map(l => (
              <motion.a key={l.label} variants={fadeUp} href={l.href}
                target={l.ext ? '_blank' : undefined} rel={l.ext ? 'noopener noreferrer' : undefined}
                whileHover={{ y: -2, borderColor: '#00FF41', color: '#00FF41' }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-[0.78rem] font-medium transition-all"
                style={{ background: '#000', border: '1px solid rgba(0,255,65,0.15)', color: '#7A8894' }}>
                <span style={{ color: '#00FF41' }}>{l.icon}</span>
                <span className="truncate">{l.label}</span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
