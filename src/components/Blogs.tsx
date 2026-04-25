import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { blogPosts } from '../data/blogPosts'
import { fadeUp, stagger, viewport } from '../utils/animations'
import type { BlogPost } from '../types'
import TerminalHeader from './TerminalHeader'

const GH_ICON = (
  <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

function BlogCard({
  post,
  expanded,
  onToggle,
}: {
  post: BlogPost
  expanded: boolean
  onToggle: (slug: string) => void
}) {
  return (
    <motion.article
      layout
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      whileHover={{
        y: -5,
        borderColor: `${post.accentColor}55`,
        boxShadow: `0 18px 45px -20px ${post.accentColor}55`,
      }}
      className="glass shadow-soft rounded-2xl overflow-hidden transition-all duration-300"
      style={{ border: '1px solid rgba(30,39,46,0.9)' }}
    >
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${post.accentColor}, transparent)` }} />

      <div className="p-7">
        <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="font-mono text-[0.68rem] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide"
              style={{
                background: `${post.accentColor}16`,
                color: post.accentColor,
                border: `1px solid ${post.accentColor}40`,
              }}
            >
              {post.category}
            </span>
            <span className="font-mono text-[0.72rem]" style={{ color: '#5A6873' }}>
              {post.repo}
            </span>
            <span className="font-mono text-[0.72rem]" style={{ color: '#5A6873' }}>
              {post.readTime}
            </span>
          </div>

          <a
            href={post.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-[0.76rem] transition-all shrink-0"
            style={{ background: '#0A0E11', border: '1px solid rgba(0,255,65,0.15)', color: '#7A8894' }}
          >
            {GH_ICON} Repo
          </a>
        </div>

        <h3 className="font-bold text-[1.12rem] leading-[1.35] mb-3" style={{ color: '#C5CDD3' }}>
          {post.title}
        </h3>

        <p className="text-[0.93rem] leading-[1.7] mb-4" style={{ color: '#93A1AA' }}>
          {post.summary}
        </p>

        <div
          className="rounded-xl p-4 mb-4"
          style={{ background: 'rgba(10,14,17,0.85)', border: `1px solid ${post.accentColor}26` }}
        >
          <p className="font-mono text-[0.78rem] leading-[1.7]" style={{ color: '#C5CDD3' }}>
            {post.highlight}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {post.stack.map(item => (
            <span
              key={item}
              className="font-mono text-[0.7rem] px-2 py-1 rounded-md"
              style={{ background: '#0A0E11', border: '1px solid rgba(0,255,65,0.1)', color: '#7A8894' }}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mb-5">
          <h4 className="font-mono text-[0.76rem] uppercase tracking-[0.2em] mb-3" style={{ color: post.accentColor }}>
            Key Takeaways
          </h4>
          <ul className="space-y-2">
            {post.takeaways.map(item => (
              <li key={item} className="flex gap-2 text-[0.84rem] leading-[1.55]" style={{ color: '#7A8894' }}>
                <span className="shrink-0 mt-[2px]" style={{ color: post.accentColor }}>
                  ▸
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => onToggle(post.slug)}
          className="px-4 py-2 rounded-lg font-mono text-[0.78rem] font-semibold transition-all duration-200"
          style={
            expanded
              ? { background: post.accentColor, color: '#000000', border: `1px solid ${post.accentColor}` }
              : { background: 'transparent', color: '#C5CDD3', border: `1px solid ${post.accentColor}55` }
          }
        >
          {expanded ? 'Hide article' : 'Read article'}
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="pt-6 border-t" style={{ borderColor: 'rgba(0,255,65,0.12)' }}>
                <div className="space-y-6">
                  {post.sections.map(section => (
                    <section key={section.heading}>
                      <h4 className="font-semibold text-[1rem] mb-3" style={{ color: '#C5CDD3' }}>
                        {section.heading}
                      </h4>
                      <div className="space-y-3">
                        {section.paragraphs.map(paragraph => (
                          <p key={paragraph} className="text-[0.92rem] leading-[1.75]" style={{ color: '#93A1AA' }}>
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  )
}

export default function Blogs() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [expandedSlug, setExpandedSlug] = useState(blogPosts[0]?.slug ?? '')

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(blogPosts.map(post => post.category)))],
    [],
  )

  const visiblePosts = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory)

  const handleToggle = (slug: string) => {
    setExpandedSlug(current => (current === slug ? '' : slug))
  }

  return (
    <section id="blogs" className="py-24 px-6" style={{ background: '#0A0E11' }}>
      <div className="max-w-[1100px] mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
          <TerminalHeader
            command="ls ~/luvis-in"
            subtitle="Long-form build notes written from the repos behind this portfolio"
          />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid lg:grid-cols-[1.3fr_360px] gap-6 items-start mb-10"
        >
          <div
            className="glass shadow-soft rounded-2xl p-7"
            style={{ border: '1px solid rgba(30,39,46,0.9)' }}
          >
            <p className="font-mono text-[0.76rem] uppercase tracking-[0.24em] mb-3" style={{ color: '#00FF41' }}>
              Repo Notes
            </p>
            <h2 className="font-extrabold mb-4" style={{ fontSize: 'clamp(1.7rem, 4vw, 2.35rem)', color: '#C5CDD3' }}>
              Writing that explains the build decisions, not just the tool list
            </h2>
            <p className="text-[0.95rem] leading-[1.75]" style={{ color: '#93A1AA' }}>
              These posts are based on the repositories in `~/luvis-in` and focus on what was built, why the design choices
              matter, and what each project taught me. I kept them close to the codebase instead of turning them into generic
              portfolio summaries.
            </p>
          </div>

          <div
            className="glass shadow-soft rounded-2xl p-6"
            style={{ border: '1px solid rgba(30,39,46,0.9)' }}
          >
            <h3 className="font-mono font-bold mb-4" style={{ color: '#00FF41', fontSize: '0.9rem' }}>
              Coverage
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Articles', value: `${blogPosts.length}` },
                { label: 'Repos Covered', value: `${blogPosts.length}` },
                { label: 'Topics', value: `${categories.length - 1}` },
                { label: 'Focus', value: 'Case studies' },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center gap-4">
                  <span className="font-mono text-[0.82rem]" style={{ color: '#7A8894' }}>
                    {row.label}
                  </span>
                  <span className="font-mono text-[0.82rem] font-semibold" style={{ color: '#C5CDD3' }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="flex flex-wrap gap-2 mb-8"
        >
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className="px-4 py-2 rounded-lg font-mono text-[0.82rem] font-semibold transition-all duration-200"
              style={
                activeCategory === category
                  ? { background: '#00FF41', color: '#000000', border: '1px solid #00FF41' }
                  : { background: 'transparent', color: '#7A8894', border: '1px solid rgba(0,255,65,0.2)' }
              }
            >
              {category}
            </button>
          ))}
        </motion.div>

        <motion.div
          layout
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid gap-5"
        >
          <AnimatePresence mode="popLayout">
            {visiblePosts.map(post => (
              <BlogCard
                key={post.slug}
                post={post}
                expanded={expandedSlug === post.slug}
                onToggle={handleToggle}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
