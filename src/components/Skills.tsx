import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../utils/animations'
import { skillCategories } from '../data/portfolio'
import type { SkillCategory } from '../types'
import SectionHeader from './SectionHeader'

const PROFICIENCY: Record<string, number> = {
  AWS: 70, GCP: 68, Terraform: 70, Ansible: 67,
  Docker: 70, 'Docker Swarm': 64, Kubernetes: 69,
  Jenkins: 70, 'GitHub Actions': 69, GitOps: 67,
  Prometheus: 68, Grafana: 68, Loki: 65, 'Grafana Alloy': 64,
  Git: 70, GitHub: 69,
  Go: 68, 'Shell Scripting': 66,
  MongoDB: 67, PostgreSQL: 68,
  Linux: 70, DevOps: 69, Troubleshooting: 66,
}

type SkillVisual =
  | { type: 'logo'; src: string; alt: string; bg?: string; padding?: string; wide?: boolean }
  | { type: 'badge'; label: string; fg: string; bg: string }

const SKILL_VISUALS: Record<string, SkillVisual> = {
  AWS: { type: 'logo', src: '/aws-logo.svg', alt: 'AWS logo', bg: 'rgba(255,153,0,0.1)', padding: '2px 6px', wide: true },
  GCP: { type: 'logo', src: 'https://cdn.simpleicons.org/googlecloud/4285F4', alt: 'Google Cloud logo' },
  Terraform: { type: 'logo', src: 'https://cdn.simpleicons.org/terraform/844FBA', alt: 'Terraform logo' },
  Ansible: { type: 'logo', src: 'https://cdn.simpleicons.org/ansible/EE0000', alt: 'Ansible logo' },
  Docker: { type: 'logo', src: 'https://cdn.simpleicons.org/docker/2496ED', alt: 'Docker logo' },
  'Docker Swarm': { type: 'logo', src: 'https://cdn.simpleicons.org/docker/2496ED', alt: 'Docker logo' },
  Kubernetes: { type: 'logo', src: 'https://cdn.simpleicons.org/kubernetes/326CE5', alt: 'Kubernetes logo' },
  Jenkins: { type: 'logo', src: 'https://cdn.simpleicons.org/jenkins/D24939', alt: 'Jenkins logo' },
  'GitHub Actions': { type: 'logo', src: 'https://cdn.simpleicons.org/githubactions/2088FF', alt: 'GitHub Actions logo' },
  GitOps: { type: 'badge', label: 'GO', fg: '#d82d17', bg: 'rgba(255,107,0,0.12)' },
  Prometheus: { type: 'logo', src: 'https://cdn.simpleicons.org/prometheus/E6522C', alt: 'Prometheus logo' },
  Grafana: { type: 'logo', src: 'https://cdn.simpleicons.org/grafana/F46800', alt: 'Grafana logo' },
  Loki: { type: 'logo', src: 'https://cdn.simpleicons.org/grafana/F46800', alt: 'Grafana logo' },
  'Grafana Alloy': { type: 'logo', src: 'https://cdn.simpleicons.org/grafana/F46800', alt: 'Grafana logo' },
  Git: { type: 'logo', src: 'https://cdn.simpleicons.org/git/F05032', alt: 'Git logo' },
  GitHub: { type: 'logo', src: 'https://cdn.simpleicons.org/github/ffffff', alt: 'GitHub logo', bg: 'rgba(0,0,0,0.05)' },
  Go: { type: 'logo', src: 'https://cdn.simpleicons.org/go/00ADD8', alt: 'Go logo' },
  'Shell Scripting': { type: 'badge', label: 'SH', fg: '#161616', bg: 'rgba(40,44,32,0.1)' },
  MongoDB: { type: 'logo', src: 'https://cdn.simpleicons.org/mongodb/47A248', alt: 'MongoDB logo' },
  PostgreSQL: { type: 'logo', src: 'https://cdn.simpleicons.org/postgresql/4169E1', alt: 'PostgreSQL logo' },
  Linux: { type: 'logo', src: 'https://cdn.simpleicons.org/linux/FCC624', alt: 'Linux logo' },
  DevOps: { type: 'badge', label: 'DO', fg: '#b2c73a', bg: 'rgba(178,199,58,0.15)' },
  Troubleshooting: { type: 'badge', label: 'TS', fg: '#4d4d4d', bg: 'rgba(83,84,80,0.1)' },
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
  const isWide = visual?.type === 'logo' && visual.wide
  const wrapperClass = isMd
    ? (isWide ? 'w-12 h-8 rounded-lg' : 'w-8 h-8 rounded-lg')
    : (isWide ? 'w-10 h-7 rounded-md' : 'w-7 h-7 rounded-md')
  const imageClass = isMd
    ? (isWide ? 'w-9 h-5 object-contain' : 'w-5 h-5 object-contain')
    : (isWide ? 'w-8 h-4 object-contain' : 'w-4 h-4 object-contain')
  const badgeClass = isMd
    ? 'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[0.7rem] font-bold'
    : 'w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-[0.68rem] font-bold'

  if (!visual) {
    return (
      <div className={`${wrapperClass} flex items-center justify-center shrink-0 font-bold`} style={{ background: 'rgba(83,84,80,0.1)', color: '#8a8a86' }}>
        {skill.slice(0, 2).toUpperCase()}
      </div>
    )
  }

  if (visual.type === 'badge') {
    return <div className={badgeClass} style={{ background: visual.bg, color: visual.fg }}>{visual.label}</div>
  }

  return (
    <div className={`${wrapperClass} flex items-center justify-center shrink-0`} style={{ background: visual.bg ?? 'rgba(0,0,0,0.04)' }}>
      <img src={visual.src} alt={visual.alt} className={imageClass} style={{ padding: visual.padding ?? 0 }} loading="lazy" decoding="async" />
    </div>
  )
}

function CategoryIcon({ category }: { category: string }) {
  const visual = CATEGORY_VISUALS[category] ?? category
  const skillVisual = SKILL_VISUALS[visual]
  const isWide = skillVisual?.type === 'logo' && skillVisual.wide
  return (
    <div
      className={`${isWide ? 'w-16 h-12' : 'w-12 h-12'} rounded shrink-0 flex items-center justify-center overflow-hidden`}
      style={{ background: '#1a1a1d', border: '1px solid #26262a' }}
    >
      <SkillIcon skill={visual} size="md" />
    </div>
  )
}

function SkillBar({ skill }: { skill: string }) {
  const pct = PROFICIENCY[skill] ?? 70
  return (
    <div className="rounded p-4" style={{ background: '#1a1a1d', border: '1px solid #26262a' }}>
      <div className="flex items-center gap-2 mb-3">
        <SkillIcon skill={skill} />
        <span className="font-semibold text-[0.82rem]" style={{ color: '#d9d9d4' }}>{skill}</span>
      </div>
      <div className="flex justify-between mb-1.5">
        <span className="text-[0.68rem] font-medium" style={{ color: '#8a8a86' }}>Proficiency</span>
        <span className="text-[0.68rem] font-bold" style={{ color: '#d9d9d4' }}>{pct}%</span>
      </div>
      <div className="h-2 rounded-sm overflow-hidden" style={{ background: '#26262a' }}>
        <motion.div
          className="h-full rounded-sm"
          style={{ background: 'transparent' }}
          initial={{ width: 0 }}
          whileInView={{ width: pct + '%' }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

function CategoryCard({ cat }: { cat: SkillCategory }) {
  return (
    <motion.div variants={fadeUp} whileHover={{ y: -5 }} className="card p-6" style={{ borderTop: '3px solid #4398cd' }}>
      <div className="flex items-center gap-3 mb-5">
        <CategoryIcon category={cat.name} />
        <span className="text-[0.95rem] font-bold leading-tight" style={{ color: '#e8e8e6' }}>{cat.name}</span>
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {cat.skills.map(skill => <SkillBar key={skill} skill={skill} />)}
      </div>
    </motion.div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="py-28 px-6" style={{ background: 'transparent' }}>
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader
          kicker="Skills"
          title="Technical expertise"
          subtitle="A skill set spanning cloud infrastructure, development, and DevOps practices."
        />

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
