import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from '../utils/animations'
import { skillCategories, themeColors } from '../data/portfolio'
import type { SkillCategory } from '../types'

function SkillCard({ cat }: { cat: SkillCategory }) {
  const colors = themeColors[cat.theme]
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -5, borderColor: colors.border, boxShadow: `0 15px 35px -10px ${colors.border}30` }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass shadow-soft rounded-2xl p-6 transition-all duration-300"
      style={{ border: `1px solid var(--bd2)`, borderTop: `3px solid ${colors.border}` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[1.15rem] shrink-0"
          style={{ background: colors.bg, boxShadow: `0 0 0 1px ${colors.border}30` }}>
          {cat.icon}
        </div>
        <span className="text-[0.84rem] font-bold leading-tight" style={{ color: colors.text }}>{cat.name}</span>
      </div>
      <div className="flex flex-wrap gap-[7px]">
        {cat.skills.map(skill => (
          <span key={skill}
            className="text-[0.75rem] font-medium px-2.5 py-1 rounded-md"
            style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}20` }}>
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="mb-12">
          <div className="section-label">Skills</div>
          <h2 className="text-[clamp(1.6rem,4vw,2.2rem)] font-extrabold mb-2" style={{ letterSpacing: '-1px' }}>Technical Stack</h2>
          <p className="text-[0.95rem] max-w-[480px] leading-[1.7]" style={{ color: 'var(--muted)' }}>
            A broad toolkit covering cloud, containers, automation, monitoring, and development.
          </p>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewport}
          className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))' }}>
          {skillCategories.map((cat) => <SkillCard key={cat.name} cat={cat} />)}
        </motion.div>
      </div>
    </section>
  )
}
