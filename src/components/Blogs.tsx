import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { blogPosts } from '../data/blogPosts'
import { fadeUp, stagger, viewport } from '../utils/animations'
import type { BlogPost } from '../types'
import SectionHeader from './SectionHeader'

const GH_ICON = (
  <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

function BlogCard({ post, expanded, onToggle }: { post: BlogPost; expanded: boolean; onToggle: (slug: string) => void }) {
  return (
    <motion.article
      layout
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }}
      className="card overflow-hidden"
    >
      <div className="h-1.5" style={{ background: '#4398cd' }} />

      <div className="p-7">
        <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[0.68rem] font-bold px-3 py-1 rounded-sm uppercase tracking-wider" style={{ background: '#2a2a2c', color: '#f4f4f2' }}>
              {post.category}
            </span>
            <span className="text-[0.72rem] font-medium" style={{ color: '#8a8a86' }}>{post.repo}</span>
            <span className="text-[0.72rem] font-medium" style={{ color: '#8a8a86' }}>{post.readTime}</span>
          </div>
          <a
            href={post.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[0.76rem] font-semibold transition-all shrink-0"
            style={{ background: '#1a1a1d', border: '1px solid #26262a', color: '#d9d9d4' }}
          >
            {GH_ICON} Repo
          </a>
        </div>

        <h3 className="font-display text-[1.5rem] leading-[1.05] mb-3" style={{ color: '#e8e8e6' }}>{post.title}</h3>
        <p className="text-[0.95rem] leading-[1.7] mb-4" style={{ color: '#8a8a86' }}>{post.summary}</p>

        <div className="rounded p-4 mb-4" style={{ background: '#1a1a1d', border: '1px solid #26262a' }}>
          <p className="text-[0.85rem] leading-[1.7]" style={{ color: '#d9d9d4' }}>{post.highlight}</p>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {post.stack.map(item => (
            <span key={item} className="text-[0.7rem] font-medium px-2.5 py-1 rounded-sm" style={{ background: '#1a1a1d', border: '1px solid #26262a', color: '#8a8a86' }}>
              {item}
            </span>
          ))}
        </div>

        <div className="mb-5">
          <h4 className="text-[0.72rem] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: '#8a8a86' }}>Key Takeaways</h4>
          <ul className="space-y-2">
            {post.takeaways.map(item => (
              <li key={item} className="flex gap-2.5 text-[0.86rem] leading-[1.55]" style={{ color: '#8a8a86' }}>
                <span className="shrink-0 mt-[2px]" style={{ color: '#d82d17' }}>▸</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => onToggle(post.slug)}
          className="px-5 py-2.5 rounded-sm text-[0.8rem] font-bold uppercase tracking-wide transition-all duration-200"
          style={expanded
            ? { background: '#4398cd', color: '#e8e8e6' }
            : { background: 'transparent', color: '#e8e8e6', border: '2px solid #111112' }}
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
              <div className="pt-6 border-t" style={{ borderColor: '#26262a' }}>
                <div className="space-y-6">
                  {post.sections.map(section => (
                    <section key={section.heading}>
                      <h4 className="font-bold text-[1.05rem] mb-3" style={{ color: '#e8e8e6' }}>{section.heading}</h4>
                      <div className="space-y-3">
                        {section.paragraphs.map(paragraph => (
                          <p key={paragraph} className="text-[0.93rem] leading-[1.75]" style={{ color: '#8a8a86' }}>{paragraph}</p>
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

  const handleToggle = (slug: string) => setExpandedSlug(current => (current === slug ? '' : slug))

  return (
    <section id="blogs" className="py-28 px-6" style={{ background: 'transparent' }}>
      <div className="max-w-[1200px] mx-auto">
        <SectionHeader
          kicker="Repo notes"
          title="Build notes"
          subtitle="Long-form writing based on the repositories behind this portfolio — what was built, why the design choices matter, and what each project taught me."
        />

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className="px-5 py-2 rounded-sm text-[0.82rem] font-bold uppercase tracking-wide transition-all duration-200"
              style={activeCategory === category
                ? { background: '#111112', color: '#f4f4f2' }
                : { background: 'transparent', color: '#8a8a86', border: '1px solid #38383b' }}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <motion.div layout variants={stagger} initial="hidden" whileInView="visible" viewport={viewport} className="grid gap-5">
          <AnimatePresence mode="popLayout">
            {visiblePosts.map(post => (
              <BlogCard key={post.slug} post={post} expanded={expandedSlug === post.slug} onToggle={handleToggle} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
