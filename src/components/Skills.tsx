import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../utils/animations'
import { skillCategories } from '../data/portfolio'
import type { SkillCategory } from '../types'
import SectionHeader from './SectionHeader'

type SkillVisual =
  | { type: 'logo'; src: string; alt: string; bg?: string; padding?: string; wide?: boolean }
  | { type: 'badge'; label: string; fg: string; bg: string }

const SKILL_VISUALS: Record<string, SkillVisual> = {
  AWS: { type: 'logo', src: '/aws-logo.svg', alt: 'AWS logo', bg: 'rgba(255,153,0,0.1)', padding: '2px 6px', wide: true },
  GCP: { type: 'logo', src: '/icons/googlecloud.svg', alt: 'Google Cloud logo' },
  Hetzner: { type: 'logo', src: '/icons/hetzner.svg', alt: 'Hetzner logo' },
  Terraform: { type: 'logo', src: '/icons/terraform.svg', alt: 'Terraform logo' },
  Ansible: { type: 'logo', src: '/icons/ansible.svg', alt: 'Ansible logo' },
  Docker: { type: 'logo', src: '/icons/docker.svg', alt: 'Docker logo' },
  'Docker Swarm': { type: 'logo', src: '/icons/docker.svg', alt: 'Docker logo' },
  Kubernetes: { type: 'logo', src: '/icons/kubernetes.svg', alt: 'Kubernetes logo' },
  Jenkins: { type: 'logo', src: '/icons/jenkins.svg', alt: 'Jenkins logo' },
  'GitHub Actions': { type: 'logo', src: '/icons/githubactions.svg', alt: 'GitHub Actions logo' },
  GitOps: { type: 'badge', label: 'GO', fg: '#ff6b00', bg: 'rgba(255,107,0,0.12)' },
  Prometheus: { type: 'logo', src: '/icons/prometheus.svg', alt: 'Prometheus logo' },
  Grafana: { type: 'logo', src: '/icons/grafana.svg', alt: 'Grafana logo' },
  Loki: { type: 'logo', src: '/icons/grafana.svg', alt: 'Grafana logo' },
  'Grafana Alloy': { type: 'logo', src: '/icons/grafana.svg', alt: 'Grafana logo' },
  Git: { type: 'logo', src: '/icons/git.svg', alt: 'Git logo' },
  GitHub: { type: 'logo', src: '/icons/github.svg', alt: 'GitHub logo', bg: 'rgba(0,0,0,0.05)' },
  Go: { type: 'logo', src: '/icons/go.svg', alt: 'Go logo' },
  'Shell Scripting': { type: 'badge', label: 'SH', fg: '#282c20', bg: 'rgba(40,44,32,0.1)' },
  MongoDB: { type: 'logo', src: '/icons/mongodb.svg', alt: 'MongoDB logo' },
  PostgreSQL: { type: 'logo', src: '/icons/postgresql.svg', alt: 'PostgreSQL logo' },
  Linux: { type: 'logo', src: '/icons/linux.svg', alt: 'Linux logo' },
  DevOps: { type: 'badge', label: 'DO', fg: '#b2c73a', bg: 'rgba(178,199,58,0.15)' },
  Troubleshooting: { type: 'badge', label: 'TS', fg: '#535450', bg: 'rgba(83,84,80,0.1)' },
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
      <div className={`${wrapperClass} flex items-center justify-center shrink-0 font-bold`} style={{ background: 'rgba(83,84,80,0.1)', color: '#535450' }}>
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
      className={`${isWide ? 'w-16 h-12' : 'w-12 h-12'} rounded-xl shrink-0 flex items-center justify-center overflow-hidden`}
      style={{ background: '#ebeee0', border: '1px solid #dde1d2' }}
    >
      <SkillIcon skill={visual} size="md" />
    </div>
  )
}

function SkillChip({ skill }: { skill: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full"
      style={{ background: '#ebeee0', border: '1px solid #dde1d2' }}
    >
      <SkillIcon skill={skill} />
      <span className="font-semibold text-[0.82rem]" style={{ color: '#282c20' }}>{skill}</span>
    </div>
  )
}

function CategoryCard({ cat }: { cat: SkillCategory }) {
  return (
    <motion.div variants={fadeUp} whileHover={{ y: -5 }} className="card p-6" style={{ borderTop: '3px solid #d2ff00' }}>
      <div className="flex items-center gap-3 mb-5">
        <CategoryIcon category={cat.name} />
        <span className="text-[0.95rem] font-bold leading-tight" style={{ color: '#111112' }}>{cat.name}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {cat.skills.map(skill => <SkillChip key={skill} skill={skill} />)}
      </div>
    </motion.div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="py-28 px-6" style={{ background: '#f4f4ed' }}>
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
