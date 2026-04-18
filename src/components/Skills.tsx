import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../utils/animations'
import { skillCategories } from '../data/portfolio'
import type { SkillCategory } from '../types'
import TerminalHeader from './TerminalHeader'

// Proficiency levels — matched to your skill set
const PROFICIENCY: Record<string, number> = {
  // Cloud & Infrastructure
  AWS: 70, GCP: 68, Terraform: 70, Ansible: 67,
  // Containers & Orchestration
  Docker: 70, 'Docker Swarm': 64, Kubernetes: 69,
  // CI/CD & GitOps
  Jenkins: 70, 'GitHub Actions': 69, GitOps: 67,
  // Monitoring
  Prometheus: 68, Grafana: 68, Loki: 65, 'Grafana Alloy': 64,
  // Version Control
  Git: 70, GitHub: 69,
  // Programming
  Go: 68, 'Shell Scripting': 66,
  // Databases
  MongoDB: 67, PostgreSQL: 68,
  // Other
  Linux: 70, DevOps: 69, Troubleshooting: 66,
}

// Cyber Terminal color palette per theme
const CYBER_COLORS: Record<string, { border: string; bg: string; text: string; bar: string }> = {
  blue:   { border: '#00D9FF', bg: 'rgba(0,217,255,0.07)',   text: '#00D9FF', bar: '#00D9FF' },
  teal:   { border: '#00FF41', bg: 'rgba(0,255,65,0.07)',    text: '#00FF41', bar: '#00FF41' },
  orange: { border: '#FF6B35', bg: 'rgba(255,107,53,0.07)',  text: '#FF6B35', bar: '#FF6B35' },
  purple: { border: '#C084FC', bg: 'rgba(192,132,252,0.07)', text: '#C084FC', bar: '#C084FC' },
  green:  { border: '#00FF41', bg: 'rgba(0,255,65,0.07)',    text: '#00FF41', bar: '#00FF41' },
  yellow: { border: '#FFB800', bg: 'rgba(255,184,0,0.07)',   text: '#FFB800', bar: '#FFB800' },
  pink:   { border: '#FF69B4', bg: 'rgba(255,105,180,0.07)', text: '#FF69B4', bar: '#FF69B4' },
  gray:   { border: '#7A8894', bg: 'rgba(122,136,148,0.07)', text: '#7A8894', bar: '#7A8894' },
}

type SkillVisual =
  | { type: 'logo'; src: string; alt: string; bg?: string; padding?: string }
  | { type: 'badge'; label: string; fg: string; bg: string }

const SKILL_VISUALS: Record<string, SkillVisual> = {
  AWS: { type: 'logo', src: 'https://cdn.simpleicons.org/amazonwebservices/FF9900', alt: 'AWS logo' },
  GCP: { type: 'logo', src: 'https://cdn.simpleicons.org/googlecloud/4285F4', alt: 'Google Cloud logo' },
  Terraform: { type: 'logo', src: 'https://cdn.simpleicons.org/terraform/844FBA', alt: 'Terraform logo' },
  Ansible: { type: 'logo', src: 'https://cdn.simpleicons.org/ansible/EE0000', alt: 'Ansible logo' },
  Docker: { type: 'logo', src: 'https://cdn.simpleicons.org/docker/2496ED', alt: 'Docker logo' },
  'Docker Swarm': { type: 'logo', src: 'https://cdn.simpleicons.org/docker/2496ED', alt: 'Docker logo' },
  Kubernetes: { type: 'logo', src: 'https://cdn.simpleicons.org/kubernetes/326CE5', alt: 'Kubernetes logo' },
  Jenkins: { type: 'logo', src: 'https://cdn.simpleicons.org/jenkins/D24939', alt: 'Jenkins logo' },
  'GitHub Actions': { type: 'logo', src: 'https://cdn.simpleicons.org/githubactions/2088FF', alt: 'GitHub Actions logo' },
  GitOps: { type: 'badge', label: 'GO', fg: '#F97316', bg: 'rgba(249,115,22,0.12)' },
  Prometheus: { type: 'logo', src: 'https://cdn.simpleicons.org/prometheus/E6522C', alt: 'Prometheus logo' },
  Grafana: { type: 'logo', src: 'https://cdn.simpleicons.org/grafana/F46800', alt: 'Grafana logo' },
  Loki: { type: 'logo', src: 'https://cdn.simpleicons.org/grafana/F46800', alt: 'Grafana logo' },
  'Grafana Alloy': { type: 'logo', src: 'https://cdn.simpleicons.org/grafana/F46800', alt: 'Grafana logo' },
  Git: { type: 'logo', src: 'https://cdn.simpleicons.org/git/F05032', alt: 'Git logo' },
  GitHub: { type: 'logo', src: 'https://cdn.simpleicons.org/github/FFFFFF', alt: 'GitHub logo', bg: 'rgba(255,255,255,0.04)' },
  Go: { type: 'logo', src: 'https://cdn.simpleicons.org/go/00ADD8', alt: 'Go logo' },
  'Shell Scripting': { type: 'badge', label: 'SH', fg: '#4ADE80', bg: 'rgba(74,222,128,0.12)' },
  MongoDB: { type: 'logo', src: 'https://cdn.simpleicons.org/mongodb/47A248', alt: 'MongoDB logo' },
  PostgreSQL: { type: 'logo', src: 'https://cdn.simpleicons.org/postgresql/4169E1', alt: 'PostgreSQL logo' },
  Linux: { type: 'logo', src: 'https://cdn.simpleicons.org/linux/FCC624', alt: 'Linux logo' },
  DevOps: { type: 'badge', label: 'DO', fg: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
  Troubleshooting: { type: 'badge', label: 'TS', fg: '#CBD5E1', bg: 'rgba(148,163,184,0.12)' },
}

const CATEGORY_VISUALS: Record<string, string> = {
  'Cloud & Infrastructure': 'AWS',
  'Containers & Orchestration': 'Kubernetes',
  'CI/CD & GitOps': 'GitHub Actions',
  'Monitoring & Observability': 'Grafana',
  'Version Control': 'Git',
  'Programming & Scripting': 'Go',
  Databases: 'PostgreSQL',
  Other: 'Linux',
}

function SkillIcon({ skill, size = 'sm' }: { skill: string; size?: 'sm' | 'md' }) {
  const visual = SKILL_VISUALS[skill]
  const isMd = size === 'md'
  const wrapperClass = isMd ? 'w-8 h-8 rounded-lg' : 'w-7 h-7 rounded-md'
  const imageClass = isMd ? 'w-5 h-5 object-contain' : 'w-4 h-4 object-contain'
  const badgeClass = isMd
    ? 'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-mono text-[0.7rem] font-bold'
    : 'w-7 h-7 rounded-md flex items-center justify-center shrink-0 font-mono text-[0.68rem] font-bold'

  if (!visual) {
    return (
      <div
        className={`${wrapperClass} flex items-center justify-center shrink-0 font-mono font-bold`}
        style={{ background: 'rgba(148,163,184,0.12)', color: '#CBD5E1' }}
      >
        {skill.slice(0, 2).toUpperCase()}
      </div>
    )
  }

  if (visual.type === 'badge') {
    return (
      <div
        className={badgeClass}
        style={{ background: visual.bg, color: visual.fg }}
      >
        {visual.label}
      </div>
    )
  }

  return (
    <div
      className={`${wrapperClass} flex items-center justify-center shrink-0`}
      style={{ background: visual.bg ?? 'rgba(255,255,255,0.03)' }}
    >
      <img
        src={visual.src}
        alt={visual.alt}
        className={imageClass}
        style={{ padding: visual.padding ?? 0 }}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}

function CategoryIcon({ category, colors }: { category: string; colors: { border: string; bg: string } }) {
  const visual = CATEGORY_VISUALS[category] ?? category

  return (
    <div
      className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(circle at top left, ${colors.bg}, rgba(10,14,17,0.96))`,
        boxShadow: `0 0 0 1px ${colors.border}25, inset 0 0 18px rgba(255,255,255,0.03)`,
      }}
    >
      <SkillIcon skill={visual} size="md" />
    </div>
  )
}

function SkillBar({ skill, colors }: { skill: string; colors: { bar: string; text: string; bg: string } }) {
  const pct = PROFICIENCY[skill] ?? 70
  return (
    <motion.div
      className="rounded-xl p-4"
      style={{ background: '#0A0E11', border: `1px solid rgba(30,39,46,0.9)` }}
      whileHover={{ borderColor: colors.bar + '40', y: -2 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <SkillIcon skill={skill} />
        <span className="font-mono font-semibold text-[0.82rem]" style={{ color: '#C5CDD3' }}>{skill}</span>
      </div>
      <div className="flex justify-between mb-1.5">
        <span className="font-mono text-[0.68rem]" style={{ color: '#5A6873' }}>Proficiency</span>
        <span className="font-mono text-[0.68rem] font-bold" style={{ color: colors.bar }}>{pct}%</span>
      </div>
      {/* Track */}
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${colors.bar}, ${colors.bar}99)`, boxShadow: `0 0 8px ${colors.bar}60` }}
          initial={{ width: 0 }}
          whileInView={{ width: pct + '%' }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  )
}

function CategoryCard({ cat }: { cat: SkillCategory }) {
  const colors = CYBER_COLORS[cat.theme] ?? CYBER_COLORS.gray
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -5, borderColor: colors.border, boxShadow: `0 0 24px ${colors.border}20` }}
      className="glass shadow-soft rounded-2xl p-6 transition-all duration-300"
      style={{ border: `1px solid rgba(30,39,46,0.9)`, borderTop: `2px solid ${colors.border}` }}
    >
      {/* Category header */}
      <div className="flex items-center gap-3 mb-5">
        <CategoryIcon category={cat.name} colors={colors} />
        <span className="font-mono text-[0.82rem] font-bold leading-tight" style={{ color: colors.text }}>
          {cat.name}
        </span>
      </div>

      {/* Skills with progress bars */}
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {cat.skills.map(skill => (
          <SkillBar key={skill} skill={skill} colors={colors} />
        ))}
      </div>
    </motion.div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6" style={{ background: '#000000' }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
          <TerminalHeader
            command="ls -la skills/"
            subtitle="Exploring technical expertise across cloud, development, and DevOps domains"
          />
        </motion.div>

        {/* Section title */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="text-center mb-12"
        >
          <h2 className="font-extrabold mb-3" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', color: '#00FF41', fontFamily: "'JetBrains Mono', monospace" }}>
            Technical Expertise
          </h2>
          <p style={{ color: '#7A8894', fontSize: '0.95rem' }}>
            Comprehensive skill set spanning cloud infrastructure, development, and DevOps practices
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid gap-5"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}
        >
          {skillCategories.map(cat => <CategoryCard key={cat.name} cat={cat} />)}
        </motion.div>
      </div>
    </section>
  )
}
