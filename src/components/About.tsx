import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../utils/animations'
import { stats, profile } from '../data/portfolio'
import TerminalHeader from './TerminalHeader'

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
            <motion.div
              whileHover={{ borderColor: 'rgba(0,255,65,0.3)', y: -4, boxShadow: '0 10px 40px -10px rgba(0,255,65,0.15)' }}
              className="glass shadow-soft rounded-2xl overflow-hidden transition-all duration-300"
              style={{ border: '1px solid rgba(30,39,46,0.9)' }}
            >
              {/* macOS title bar */}
              <div className="flex items-center gap-1.5 px-4 py-3" style={{ background: '#000000', borderBottom: '1px solid rgba(0,255,65,0.1)' }}>
                <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
                <span className="ml-2 font-mono text-[0.68rem]" style={{ color: '#5A6873' }}>luvis@devops: ~/portfolio</span>
              </div>

              {/* Bio body */}
              <div className="p-7">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-[0.82rem]" style={{ color: '#FFB800' }}>$</span>
                  <span className="font-mono text-[0.82rem]" style={{ color: '#00D9FF' }}>cat bio.txt</span>
                </div>

                <p className="font-bold mb-4 leading-[1.7]" style={{ color: '#00FF41', fontSize: '0.95rem' }}>
                  Hello, I'm {profile.name}, and I turn infrastructure into production reality.
                </p>

                <p className="mb-4 leading-[1.85]" style={{ color: '#C5CDD3', fontSize: '0.88rem' }}>
                  I design, automate, and deploy systems that turn code into production-grade reality on AWS & GCP.
                  My journey spans GitOps pipelines with FluxCD & Kubernetes, full observability stacks with
                  Prometheus, Grafana & Loki, and Go REST APIs with Redis caching.
                </p>

                <p className="mb-4 leading-[1.85]" style={{ color: '#C5CDD3', fontSize: '0.88rem' }}>
                  I work across cloud platforms, orchestrate containers with Docker and Kubernetes, and define
                  infrastructure with Terraform and Ansible. Behind the command line, I'm equally comfortable
                  building production-ready Go services and GitHub Actions CI/CD pipelines.
                </p>

                <p className="leading-[1.85] font-semibold" style={{ color: '#00FF41', fontSize: '0.88rem' }}>
                  For me, DevOps isn't just about speed — it's about precision, repeatability, and creating
                  systems that are observable, scalable, and automated end-to-end.
                </p>

                <div className="flex items-center gap-1.5 mt-5">
                  <span style={{ color: '#FFB800' }}>$</span>
                  <span className="animate-blink inline-block w-[8px] h-[1em]" style={{ background: '#00FF41' }} />
                </div>
              </div>
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
