import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../utils/animations'
import { stats } from '../data/portfolio'
import { useCounter } from '../hooks/useCounter'

function StatCard({ stat }: { stat: { number: string; label: string } }) {
  const { display, ref } = useCounter(stat.number)
  return (
    <motion.div ref={ref} variants={fadeUp}
      whileHover={{ y: -5, borderColor: 'var(--g)', boxShadow: '0 10px 30px -10px rgba(45,212,191,0.15)' }}
      className="glass shadow-soft flex flex-col justify-center rounded-2xl p-6 text-center transition-all duration-300 cursor-default min-h-[140px]"
      style={{ border: '1px solid var(--bd2)' }}>
      <div className="font-black leading-none mb-1.5" style={{ fontSize: '2.4rem', color: 'var(--g)' }}>
        {display}
      </div>
      <div className="text-xs tracking-wide" style={{ color: 'var(--muted)' }}>{stat.label}</div>
    </motion.div>
  )
}

export default function About() {
  return (
    <section id="about" className="py-24 px-6" style={{ background: 'var(--s1)' }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="mb-12">
          <div className="section-label">About</div>
          <h2 className="text-[clamp(1.6rem,4vw,2.2rem)] font-extrabold" style={{ letterSpacing: '-1px' }}>Who I Am</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left: Terminal card */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
            <motion.div
              whileHover={{ borderColor: 'rgba(45,212,191,0.3)', y: -4, boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)' }}
              className="glass shadow-soft rounded-2xl overflow-hidden transition-all duration-300"
              style={{ border: '1px solid var(--bd2)' }}>
              {/* macOS title bar */}
              <div className="flex items-center gap-1.5 px-4 py-3"
                style={{ background: 'var(--bg)', borderBottom: '1px solid var(--bd)' }}>
                <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
                <span className="ml-2 font-mono text-[0.68rem]" style={{ color: 'var(--dim)' }}>luvis@devops: ~/portfolio</span>
              </div>
              {/* Terminal body */}
              <div className="p-5 font-mono text-[0.8rem] leading-[1.85]">
                <div className="flex gap-2 mb-0.5">
                  <span style={{ color: 'var(--g)' }}>$</span>
                  <span style={{ color: 'var(--blue)' }}>whoami</span>
                </div>
                <div className="mb-3" style={{ color: 'var(--text)', paddingLeft: '1rem' }}>
                  Luvis Joston J — DevOps Engineer, Bengaluru
                </div>

                <div className="flex gap-2 mb-0.5">
                  <span style={{ color: 'var(--g)' }}>$</span>
                  <span style={{ color: 'var(--blue)' }}>cat focus.txt</span>
                </div>
                <div className="mb-3 space-y-0.5" style={{ paddingLeft: '1rem', color: 'var(--muted)' }}>
                  <div><span style={{ color: 'var(--g)' }}>▸</span> Production-grade cloud on AWS &amp; GCP</div>
                  <div><span style={{ color: 'var(--g)' }}>▸</span> GitOps pipelines with FluxCD &amp; Kubernetes</div>
                  <div><span style={{ color: 'var(--g)' }}>▸</span> Full observability with Prometheus &amp; Grafana</div>
                  <div><span style={{ color: 'var(--g)' }}>▸</span> Go REST APIs &amp; infrastructure automation</div>
                </div>

                <div className="flex gap-2 mb-0.5">
                  <span style={{ color: 'var(--g)' }}>$</span>
                  <span style={{ color: 'var(--blue)' }}>echo $STATUS</span>
                </div>
                <div className="mb-4 flex items-center gap-2" style={{ paddingLeft: '1rem' }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot shrink-0"
                    style={{ background: 'var(--g)', boxShadow: '0 0 0 2px rgba(0,200,150,0.25)', display: 'inline-block' }} />
                  <span style={{ color: 'var(--g)' }}>Open to DevOps opportunities</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span style={{ color: 'var(--g)' }}>$</span>
                  <span className="animate-blink inline-block w-[8px] h-[1em]" style={{ background: 'var(--g)' }} />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Stat cards */}
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport}
            className="grid grid-cols-2 gap-4">
            {stats.map(s => <StatCard key={s.label} stat={s} />)}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
