import { motion } from 'framer-motion'
import { blogPosts } from '../data/blogPosts'
import { fadeUp, stagger, viewport } from '../utils/animations'
import { navigateToBlogPost, navigateToPage } from '../hooks/usePageRoute'

const GH_ICON = (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

const BACK_ICON = (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

export default function BlogPostPage({ slug }: { slug: string }) {
  const post = blogPosts.find(p => p.slug === slug)

  if (!post) {
    return (
      <section className="py-28 px-6 min-h-[60vh]" style={{ background: '#ebeee0' }}>
        <div className="max-w-[720px] mx-auto text-center">
          <h1 className="font-display text-[2rem] mb-4" style={{ color: '#111112' }}>Post not found</h1>
          <p className="mb-8" style={{ color: '#535450' }}>
            That article doesn't exist, or the link is out of date.
          </p>
          <button onClick={() => navigateToPage('blogs')} className="pill">
            {BACK_ICON} Back to all posts
          </button>
        </div>
      </section>
    )
  }

  const more = blogPosts.filter(p => p.slug !== post.slug).slice(0, 2)

  return (
    <article className="py-16 px-6" style={{ background: '#ebeee0' }}>
      <div className="max-w-[760px] mx-auto">

        {/* Back link */}
        <motion.button
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          onClick={() => navigateToPage('blogs')}
          className="inline-flex items-center gap-2 mb-10 text-[0.85rem] font-semibold uppercase tracking-wide transition-opacity hover:opacity-70"
          style={{ color: '#535450' }}
        >
          {BACK_ICON} All posts
        </motion.button>

        {/* Meta */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-[0.7rem] font-bold px-3 py-1 rounded-full uppercase tracking-wider" style={{ background: '#282c20', color: '#ebeee0' }}>
            {post.category}
          </span>
          <span className="text-[0.78rem] font-medium" style={{ color: '#535450' }}>{post.repo}</span>
          <span className="text-[0.78rem] font-medium" style={{ color: '#535450' }}>·</span>
          <span className="text-[0.78rem] font-medium" style={{ color: '#535450' }}>{post.readTime}</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-display leading-[1.05] mb-6"
          style={{ fontSize: 'clamp(2rem, 5.5vw, 3.4rem)', color: '#111112' }}
        >
          {post.title}
        </motion.h1>

        {/* Summary */}
        <motion.p variants={fadeUp} initial="hidden" animate="visible" className="text-[1.08rem] leading-[1.75] mb-8" style={{ color: '#535450' }}>
          {post.summary}
        </motion.p>

        {/* Repo link */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-10">
          <a
            href={post.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[0.82rem] font-semibold transition-all"
            style={{ background: '#ebeee0', border: '1px solid #dde1d2', color: '#282c20' }}
          >
            {GH_ICON} View repository
          </a>
        </motion.div>

        {/* Pull quote */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="rounded-2xl p-6 mb-12 border-l-4"
          style={{ background: '#ffffff', borderColor: '#111112' }}
        >
          <p className="text-[1.05rem] leading-[1.7] italic" style={{ color: '#282c20' }}>
            "{post.highlight}"
          </p>
        </motion.div>

        {/* Stack */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-wrap gap-1.5 mb-12">
          {post.stack.map(item => (
            <span key={item} className="text-[0.74rem] font-medium px-2.5 py-1 rounded-full" style={{ background: '#ffffff', border: '1px solid #dde1d2', color: '#535450' }}>
              {item}
            </span>
          ))}
        </motion.div>

        {/* Body sections */}
        <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-10 mb-14">
          {post.sections.map(section => (
            <motion.section key={section.heading} variants={fadeUp}>
              <h2 className="font-display text-[1.5rem] mb-4" style={{ color: '#111112' }}>{section.heading}</h2>
              <div className="space-y-4">
                {section.paragraphs.map(paragraph => (
                  <p key={paragraph} className="text-[1.02rem] leading-[1.85]" style={{ color: '#3a3d33' }}>{paragraph}</p>
                ))}
              </div>
            </motion.section>
          ))}
        </motion.div>

        {/* Takeaways */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport} className="card p-7 mb-16">
          <h3 className="text-[0.78rem] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: '#535450' }}>Key Takeaways</h3>
          <ul className="space-y-2.5">
            {post.takeaways.map(item => (
              <li key={item} className="flex gap-2.5 text-[0.95rem] leading-[1.6]" style={{ color: '#282c20' }}>
                <span className="shrink-0 mt-[3px]" style={{ color: '#111112' }}>▸</span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* More posts */}
        {more.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewport}>
            <h3 className="text-[0.78rem] font-bold uppercase tracking-[0.2em] mb-5" style={{ color: '#535450' }}>More posts</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {more.map(p => (
                <button
                  key={p.slug}
                  onClick={() => navigateToBlogPost(p.slug)}
                  className="card p-5 text-left transition-transform hover:-translate-y-1"
                >
                  <span className="text-[0.68rem] font-bold uppercase tracking-wider" style={{ color: '#535450' }}>{p.category}</span>
                  <h4 className="font-display text-[1.15rem] leading-[1.15] mt-2" style={{ color: '#111112' }}>{p.title}</h4>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </article>
  )
}
