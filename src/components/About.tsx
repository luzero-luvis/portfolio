import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../utils/animations'
import { stats } from '../data/portfolio'
import SectionHeader from './SectionHeader'
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
    <section id="about" className="py-28 px-6" style={{ background: '#282c20' }}>
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader
          dark
          kicker="About"
          title="Turning infrastructure into production reality"
          subtitle="I design, automate, and deploy systems that carry code to production on AWS, GCP, and Hetzner — GitOps pipelines, Kubernetes platforms, and observability stacks built to be reliable and repeatable."
        />

        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* Interactive shell */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
            <ProfileShell />
          </motion.div>

          {/* Stats + specializations */}
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport} className="flex flex-col gap-5">
            <motion.div variants={fadeUp} className="card-dark p-6">
              <h3 className="text-[0.72rem] font-bold uppercase tracking-[0.22em] mb-5" style={{ color: '#d2ff00' }}>Quick Stats</h3>
              <div className="space-y-3.5">
                {[
                  { label: 'Experience',      value: '1+ years' },
                  { label: 'Cloud Platforms', value: 'AWS, GCP, Hetzner' },
                  { label: 'Projects',        value: `${stats.find(s => s.label === 'Projects Built')?.number ?? '5+'} deployed` },
                  { label: 'Technologies',    value: `${stats.find(s => s.label === 'Tools Used')?.number ?? '25+'} used` },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center">
                    <span className="text-[0.88rem]" style={{ color: '#b4b8a5' }}>{row.label}</span>
                    <span className="text-[0.88rem] font-bold" style={{ color: '#ebeee0' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="card-dark p-6">
              <h3 className="text-[0.72rem] font-bold uppercase tracking-[0.22em] mb-5" style={{ color: '#d2ff00' }}>Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {specializations.map(s => (
                  <span
                    key={s}
                    className="text-[0.76rem] font-medium px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#ebeee0' }}
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
