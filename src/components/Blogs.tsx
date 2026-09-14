import { useState } from 'react'
import { blogPosts } from '../data/blogPosts'
import { readingTime } from '../utils/readingTime'
import BlogCover from './BlogCover'
import SiteLink from './SiteLink'

export default function Blogs({ preview = false }: { preview?: boolean }) {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const matches = blogPosts.filter(post => (category === 'All' || post.category === category)
    && [post.title, post.summary, ...post.stack].join(' ').toLowerCase().includes(query.trim().toLowerCase()))
  const posts = preview ? blogPosts.slice(0, 3) : matches
  const Heading = preview ? 'h2' : 'h1'

  return <section className={'container section notes-section ' + (preview ? 'notes-preview' : 'journal')} aria-labelledby="writing-title">
    <div className="section-heading">
      <div><div className="eyebrow">THE BLOG</div><Heading id="writing-title">A few things I’ve learned.</Heading></div>
      <div className="section-aside"><p>Notes from building, breaking, and understanding systems. Written to be useful.</p>{preview && <SiteLink className="text-link" href="/blogs">Explore all articles ↗</SiteLink>}</div>
    </div>
    {!preview && <div className="journal-controls">
      <div className="filter-list" role="group" aria-label="Filter articles by topic">{['All', ...new Set(blogPosts.map(post => post.category))].map(topic => <button key={topic} type="button" aria-pressed={category === topic} onClick={() => setCategory(topic)}>{topic === 'All' ? 'All stories' : topic}</button>)}</div>
      <label className="search-field"><span className="sr-only">Search articles</span><input type="search" placeholder="Search articles…" value={query} onChange={event => setQuery(event.target.value)} /></label>
    </div>}
    {!preview && <p className="results-count" role="status">{posts.length} {posts.length === 1 ? 'article' : 'articles'}</p>}
    <div className={preview ? 'story-grid' : 'story-feed'}>{posts.map(post => <article className="story" key={post.slug}>
      <BlogCover category={post.category} />
      <div className="story-copy">
        <div className="story-byline"><span className="author-avatar" aria-hidden="true">LJ</span><span>Luvis Joston J</span></div>
        <h3><SiteLink href={'/blogs/' + post.slug}>{post.title}</SiteLink></h3>
        <p>{post.summary}</p>
        <div className="story-meta"><span>{post.category}</span><span>{readingTime(post)}</span><SiteLink href={'/blogs/' + post.slug} aria-label={'Read ' + post.title}>Read story ↗</SiteLink></div>
      </div>
    </article>)}</div>
    {posts.length === 0 && <div className="empty-state"><h2>No matching articles.</h2><p>Try a topic like GitOps, networking, or Go.</p><button className="button button-dark" onClick={() => { setCategory('All'); setQuery('') }}>Show all articles</button></div>}
  </section>
}
