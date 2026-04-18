import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../utils/animations'
import { stats } from '../data/portfolio'
import TerminalHeader from './TerminalHeader'
import ProfileShell from './ProfileShell'

const specializations = [
  'Cloud Architecture',
  'CI/CD Pipelines',
  'GitOps',
  'K8s Orchestration',
  'Infrastructure as Code',
  'Full Observability',
  'Go Development',
  'Container Security',
]

export default function About() {
  return (
    <section id="about" className="py-24 px-6" style={{ background: '#0A0E11' }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
          <TerminalHeader
            command="cat about.txt"
            subtitle="Displaying professional background and technical philosophy"
          />
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* Left: Bio terminal card */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
            <motion.div whileHover={{ borderColor: 'rgba(0,255,65,0.3)', y: -4, boxShadow: '0 10px 40px -10px rgba(0,255,65,0.15)' }}>
              <ProfileShell />
            </motion.div>
          </motion.div>

          {/* Right: Quick Stats + Specializations */}
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport} className="flex flex-col gap-5">

            {/* Quick Stats card */}
            <motion.div
              variants={fadeUp}
              whileHover={{ borderColor: 'rgba(0,255,65,0.3)', y: -3 }}
              className="glass shadow-soft rounded-2xl p-6 transition-all duration-300"
              style={{ border: '1px solid rgba(30,39,46,0.9)' }}
            >
              <h3 className="font-mono font-bold mb-5" style={{ color: '#00FF41', fontSize: '0.9rem' }}>
                Quick Stats
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Experience',      value: '1+ years' },
                  { label: 'Cloud Platforms', value: 'AWS, GCP' },
                  { label: 'Projects',        value: `${stats.find(s => s.label === 'Projects Built')?.number ?? '4+'} deployed` },
                  { label: 'Technologies',    value: `${stats.find(s => s.label === 'Tools Mastered')?.number ?? '25+'} mastered` },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center">
                    <span className="font-mono text-[0.82rem]" style={{ color: '#7A8894' }}>{row.label}</span>
                    <span className="font-mono text-[0.82rem] font-semibold" style={{ color: '#00FF41' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Specializations card */}
            <motion.div
              variants={fadeUp}
              whileHover={{ borderColor: 'rgba(0,255,65,0.3)', y: -3 }}
              className="glass shadow-soft rounded-2xl p-6 transition-all duration-300"
              style={{ border: '1px solid rgba(30,39,46,0.9)' }}
            >
              <h3 className="font-mono font-bold mb-5" style={{ color: '#00FF41', fontSize: '0.9rem' }}>
                Specializations
              </h3>
              <div className="flex flex-wrap gap-2">
                {specializations.map(s => (
                  <span
                    key={s}
                    className="font-mono text-[0.74rem] px-3 py-1.5 rounded-lg"
                    style={{ background: 'rgba(0,255,65,0.06)', border: '1px solid rgba(0,255,65,0.15)', color: '#C5CDD3' }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  )
}
