import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../utils/animations'
import { projects, themeColors } from '../data/portfolio'
import type { Project, BadgeTheme } from '../types'

const badgeThemeMap: Record<BadgeTheme, string> = {
  green: 'green',
  blue: 'blue',
  purple: 'purple',
  orange: 'orange',
}

const LINK_ICON = (
  <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

function ProjectCard({ project }: { project: Project }) {
  const colors = themeColors[badgeThemeMap[project.badgeTheme] as keyof typeof themeColors]
  return (
    <motion.div variants={fadeUp}
      whileHover={{ y: -6, boxShadow: `0 15px 40px -10px ${project.accentColor}30`, borderColor: project.accentColor }}
      className="glass shadow-soft rounded-2xl overflow-hidden transition-all duration-300"
      style={{ border: '1px solid var(--bd2)', display: 'grid', gridTemplateColumns: '4px 1fr' }}>
      <div style={{ background: project.accentColor, boxShadow: `0 0 15px ${project.accentColor}` }} />
      <div className="p-7">
        {/* Top row */}
        <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.72rem] font-semibold" style={{ color: 'var(--dim)' }}>{project.number}</span>
            <span className="text-[0.68rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
              style={{ background: colors.bg, color: colors.text }}>
              {project.badge}
            </span>
          </div>
          <motion.a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
            whileHover={{ borderColor: 'var(--g)', color: 'var(--g)' }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[0.76rem] transition-all shrink-0"
            style={{ background: 'var(--s3)', border: '1px solid var(--bd)', color: 'var(--muted)' }}>
            {LINK_ICON} View on GitHub
          </motion.a>
        </div>

        <h3 className="font-bold text-[1.05rem] mb-2 leading-[1.35]" style={{ color: 'var(--text)' }}>
          {project.title}
        </h3>
        <p className="text-[0.84rem] italic mb-4" style={{ color: 'var(--dim)' }}>{project.description}</p>

        <ul className="space-y-2 mb-5">
          {project.points.map((point, i) => (
            <li key={i} className="flex gap-2 text-[0.84rem] leading-[1.5]" style={{ color: 'var(--muted)' }}>
              <span className="shrink-0 mt-[2px]" style={{ color: 'var(--g)' }}>▸</span>
              {point}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map(tag => (
            <span key={tag} className="text-[0.7rem] px-2 py-1 rounded-md"
              style={{ background: 'var(--s3)', border: '1px solid var(--bd)', color: 'var(--muted)' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6" style={{ background: 'var(--s1)' }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="mb-12">
          <div className="section-label">Projects</div>
          <h2 className="text-[clamp(1.6rem,4vw,2.2rem)] font-extrabold mb-2" style={{ letterSpacing: '-1px' }}>What I've Built</h2>
          <p className="text-[0.95rem] max-w-[480px] leading-[1.7]" style={{ color: 'var(--muted)' }}>
            Real-world DevOps projects spanning CI/CD, GitOps, cloud infrastructure, and application development.
          </p>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport}
          className="grid md:grid-cols-2 gap-5">
          {projects.map(p => <ProjectCard key={p.number} project={p} />)}
        </motion.div>
      </div>
    </section>
  )
}
