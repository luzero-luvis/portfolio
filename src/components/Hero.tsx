import { motion } from 'framer-motion'
import { useTypewriter } from '../hooks/useTypewriter'
import { profile } from '../data/portfolio'
import { stagger, fadeUp } from '../utils/animations'
import { navigateToPage } from '../hooks/usePageRoute'
import Marquee from './Marquee'

const TECH = ['AWS', 'GCP', 'HETZNER', 'KUBERNETES', 'TERRAFORM', 'GITOPS', 'DOCKER', 'PROMETHEUS', 'GO', 'JENKINS', 'GRAFANA', 'FLUXCD']

export default function Hero() {
  const text = useTypewriter(profile.roles)

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ paddingTop: '96px', background: '#ebeee0' }}
    >
      <div className="max-w-[1200px] mx-auto w-full px-6 flex-1 flex flex-col justify-center py-16">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="w-full">

          <motion.span variants={fadeUp} className="kicker mb-6">
            DevOps Engineer · {profile.location}
          </motion.span>

          {/* Giant name */}
          <motion.h1
            variants={fadeUp}
            className="font-display"
            style={{ fontSize: 'clamp(3.2rem, 13vw, 11rem)', color: '#111112' }}
          >
            Luvis<br />
            <span style={{ color: '#111112' }}>Joston J</span>
          </motion.h1>

          {/* Typewriter role */}
          <motion.div
            variants={fadeUp}
            className="font-display mt-4"
            style={{ fontSize: 'clamp(1.4rem, 4vw, 2.6rem)', color: '#ff6b00' }}
          >
            {text}
            <span className="animate-blink inline-block ml-1" style={{ color: '#d2ff00' }}>_</span>
          </motion.div>

          {/* Bio */}
          <motion.p
            variants={fadeUp}
            className="max-w-[560px] mt-8 text-[1.05rem] leading-[1.7]"
            style={{ color: '#535450' }}
          >
            {profile.bio}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex gap-4 flex-wrap mt-10">
            <button onClick={() => navigateToPage('projects')} className="pill">
              View Projects →
            </button>
            <button onClick={() => navigateToPage('contact')} className="pill-ghost">
              Get in touch
            </button>
          </motion.div>

          {/* Availability */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 mt-10 text-[0.85rem] font-semibold" style={{ color: '#535450' }}>
            <span className="w-2.5 h-2.5 rounded-full animate-pulse-dot" style={{ background: '#d2ff00' }} />
            Available — open to DevOps opportunities
          </motion.div>
        </motion.div>
      </div>

      {/* Running tech band */}
      <div className="border-y" style={{ borderColor: '#111112' }}>
        <Marquee items={TECH} variant="lime" />
      </div>
    </section>
  )
}
