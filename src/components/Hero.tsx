import { motion } from 'framer-motion'
import { useTypewriter } from '../hooks/useTypewriter'
import { profile } from '../data/portfolio'
import { stagger, fadeUp } from '../utils/animations'

const CODE_ICON = (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
)
const EXT_ICON = (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

/** Floating particle — pure CSS, no Three.js dependency */
function Particles() {
  const dots = Array.from({ length: 40 }, (_, i) => i)
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {dots.map(i => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
            background: i % 5 === 0 ? 'rgba(0,217,255,0.5)' : 'rgba(0,255,65,0.4)',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animation: `float ${Math.random() * 6 + 4}s ease-in-out ${Math.random() * 4}s infinite alternate`,
          }}
        />
      ))}
    </div>
  )
}

export default function Hero() {
  const text = useTypewriter(profile.roles)

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 text-center"
      style={{ paddingTop: '80px', paddingBottom: '5rem', background: '#000000' }}
    >
      {/* Animated cyber grid */}
      <div
        className="cyber-grid absolute inset-0 pointer-events-none"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        }}
      />

      {/* Glow orbs */}
      <div className="absolute rounded-full pointer-events-none" style={{ width: 600, height: 600, background: 'rgba(0,255,65,0.05)', filter: 'blur(120px)', top: -100, left: '25%' }} />
      <div className="absolute rounded-full pointer-events-none" style={{ width: 400, height: 400, background: 'rgba(0,217,255,0.04)', filter: 'blur(90px)', bottom: -80, right: '10%' }} />

      {/* Floating dots */}
      <Particles />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-[860px] mx-auto w-full flex flex-col items-center"
      >
        {/* $ whoami prompt */}
        <motion.div
          variants={fadeUp}
          className="font-mono font-semibold mb-6"
          style={{ fontSize: '1.05rem', color: '#FFB800' }}
        >
          $ whoami
        </motion.div>

        {/* Giant typewriter title */}
        <motion.h1
          variants={fadeUp}
          className="font-black leading-[1.05] mb-8"
          style={{
            fontSize: 'clamp(2.6rem, 8vw, 5.2rem)',
            color: '#00FF41',
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '-2px',
            textShadow: '0 0 40px rgba(0,255,65,0.25)',
          }}
        >
          {text}
          <span className="animate-blink inline-block font-bold ml-1" style={{ color: '#00FF41' }}>|</span>
        </motion.h1>

        {/* Bio */}
        <motion.p
          variants={fadeUp}
          className="max-w-[600px] mb-10 leading-[1.85]"
          style={{ fontSize: '1rem', color: '#7A8894' }}
        >
          {profile.bio}
        </motion.p>

        {/* CTA buttons */}
        <motion.div variants={fadeUp} className="flex gap-4 flex-wrap justify-center mb-10">
          <motion.a
            href="#projects"
            whileHover={{ y: -3, scale: 1.03, boxShadow: '0 0 30px rgba(0,255,65,0.4)' }}
            whileTap={{ scale: 0.97 }}
            onClick={e => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-mono text-[0.9rem] font-bold transition-all"
            style={{ background: 'transparent', color: '#00FF41', border: '2px solid #00FF41' }}
          >
            {CODE_ICON} View Projects
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ y: -3, scale: 1.03, background: 'rgba(0,255,65,0.08)', borderColor: '#00FF41' }}
            whileTap={{ scale: 0.97 }}
            onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-mono text-[0.9rem] font-semibold border transition-all"
            style={{ background: 'rgba(10,14,17,0.8)', color: '#C5CDD3', borderColor: 'rgba(0,255,65,0.3)' }}
          >
            {EXT_ICON} Contact Me
          </motion.a>
        </motion.div>

        {/* Availability badge */}
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[0.78rem]"
          style={{ background: '#0A0E11', border: '1px solid rgba(0,255,65,0.2)', color: '#7A8894' }}
        >
          <span
            className="w-2 h-2 rounded-full shrink-0 animate-pulse-dot"
            style={{ background: '#00FF41', boxShadow: '0 0 0 3px rgba(0,255,65,0.2)' }}
          />
          <span style={{ color: '#00FF41' }}>Available</span>
          &nbsp;— Open to DevOps opportunities · {profile.location}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10" style={{ color: '#5A6873', fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
        <div className="w-px h-11 animate-scroll-line" style={{ background: 'linear-gradient(#00FF41, transparent)' }} />
        <span>scroll</span>
      </div>
    </section>
  )
}
