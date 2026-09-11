import { useState } from 'react'
import { blogPosts } from '../data/blogPosts'
import SiteLink from './SiteLink'

export default function Blogs({ preview = false }: { preview?: boolean }) {
  const [category, setCategory] = useState('All')
  const posts = preview ? blogPosts.slice(0, 3) : blogPosts.filter(post => category === 'All' || post.category === category)
  const Heading = preview ? 'h2' : 'h1'
  return <section className="container section notes-section"><div className="section-heading"><div><div className="eyebrow">03 / FIELD NOTES</div><Heading>Things I built.<br /><span className="heading-accent">Things I figured out.</span></Heading></div><div className="section-aside"><p>Notes from the terminal, the docs,<br />and the occasional wrong turn.</p>{preview ? <SiteLink className="text-link" href="/blogs">All notes ↗</SiteLink> : <a className="text-link" href="https://github.com/luzero-luvis/til" target="_blank" rel="noreferrer">Architecture reading notebook ↗</a>}</div></div>
    {!preview && <div className="filter-list notes-filters" role="group" aria-label="Filter notes">{['All', ...new Set(blogPosts.map(post => post.category))].map(item => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>}
    <div className="notes-list">{posts.map((post, index) => <article key={post.slug}><span className="note-number">{String(index + 1).padStart(2, '0')}</span><div><div className="note-meta">{post.category}<span> / </span>{post.readTime}</div><h3><SiteLink href={'/blogs/' + post.slug}>{post.title}</SiteLink></h3>{!preview && <p>{post.summary}</p>}</div><SiteLink className="note-arrow" href={'/blogs/' + post.slug} aria-label={'Read ' + post.title}>↗</SiteLink></article>)}</div>
  </section>
}
