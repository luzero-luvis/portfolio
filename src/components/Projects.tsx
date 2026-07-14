import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../utils/animations'
import { projects } from '../data/portfolio'
import type { Project, BadgeTheme } from '../types'
import SectionHeader from './SectionHeader'

const BADGE_TO_FILTER: Record<BadgeTheme, string> = {
  green:  'CI/CD',
  blue:   'Kubernetes',
  purple: 'GitOps',
  orange: 'Go · API',
}

const FILTERS = ['All', 'CI/CD', 'Kubernetes', 'GitOps', 'Go · API']

const GH_ICON = (
  <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      layout
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -6 }}
      className="card-dark overflow-hidden"
    >
      <div className="p-7">
        <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
          <div className="flex items-baseline gap-4">
            <span className="font-display" style={{ fontSize: '2.4rem', color: 'rgba(255,255,255,0.18)', lineHeight: 1 }}>{project.number}</span>
            <span className="text-[0.68rem] font-bold px-3 py-1 rounded-sm uppercase tracking-wider" style={{ background: '#4398cd', color: '#e8e8e6' }}>
              {project.badge}
            </span>
          </div>
          <motion.a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[0.76rem] font-semibold transition-all shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.16)', color: '#f4f4f2' }}
          >
            {GH_ICON} GitHub
          </motion.a>
        </div>

        <h3 className="font-display text-[1.35rem] mb-2 leading-[1.05]" style={{ color: '#f4f4f2' }}>{project.title}</h3>
        <p className="text-[0.82rem] italic mb-4" style={{ color: '#d82d17' }}>{project.description}</p>

        <ul className="space-y-2 mb-5">
          {project.points.map((point, i) => (
            <li key={i} className="flex gap-2.5 text-[0.86rem] leading-[1.5]" style={{ color: '#8a8a86' }}>
              <span className="shrink-0 mt-[3px]" style={{ color: '#4398cd' }}>▸</span>
              {point}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map(tag => (
            <span key={tag} className="text-[0.7rem] font-medium px-2.5 py-1 rounded-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#8a8a86' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const [active, setActive] = useState('All')

  const filtered = active === 'All'
    ? projects
    : projects.filter(p => BADGE_TO_FILTER[p.badgeTheme] === active)

  return (
    <section id="projects" className="py-28 px-6" style={{ background: 'transparent' }}>
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader
          dark
          kicker="Work"
          title="What I've built"
          subtitle="Real-world DevOps projects spanning CI/CD, GitOps, cloud infrastructure, and backend services."
        />

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className="px-5 py-2 rounded-sm text-[0.82rem] font-bold uppercase tracking-wide transition-all duration-200"
              style={active === f
                ? { background: '#4398cd', color: '#e8e8e6' }
                : { background: 'transparent', color: '#8a8a86', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              {f}
            </button>
          ))}
        </motion.div>

        <motion.div layout variants={stagger} initial="hidden" whileInView="visible" viewport={viewport} className="grid md:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map(p => <ProjectCard key={p.number} project={p} />)}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
