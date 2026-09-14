import { useState } from 'react'
import { blogPosts } from '../data/blogPosts'
import { profile } from '../data/portfolio'
import { readingTime } from '../utils/readingTime'
import SiteLink from './SiteLink'

export default function BlogPostPage({ slug }: { slug: string }) {
  const [largeText, setLargeText] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')
  const post = blogPosts.find(item => item.slug === slug)
  if (!post) return <section className="container section empty-state"><h1>Article not found.</h1><SiteLink className="text-link" href="/blogs">Back to the blog ↗</SiteLink></section>
  const related = blogPosts.filter(item => item.slug !== slug).sort((first, second) => Number(second.category === post.category) - Number(first.category === post.category)).slice(0, 2)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopyStatus('Article link copied.')
    } catch { setCopyStatus('Copy the link from your browser’s address bar.') }
  }

  return <article className={'container section blog-article ' + (largeText ? 'large-reading' : '')}>
    <SiteLink className="text-link back-link" href="/blogs">← All articles</SiteLink>
    <header className="article-heading">
      <div className="eyebrow">{post.category}</div>
      <h1>{post.title}</h1>
      <p className="lead">{post.summary}</p>
      <div className="article-author"><span className="author-avatar" aria-hidden="true">LJ</span><div><SiteLink href="/about">{profile.name}</SiteLink><p>DevOps Engineer · {readingTime(post)}</p></div></div>
    </header>
    <div className="reading-toolbar" aria-label="Reading tools"><a href={post.githubUrl} target="_blank" rel="noreferrer">View source code ↗</a><div><button type="button" aria-pressed={largeText} onClick={() => setLargeText(!largeText)}>Larger text</button><button type="button" onClick={copyLink}>Copy link</button></div></div>
    <p className="article-status" role="status">{copyStatus}</p>
    <nav className="article-contents" aria-label="In this article"><details><summary>In this article</summary><ol>{post.sections.map((section, index) => <li key={section.heading}><a href={'#section-' + index}>{section.heading}</a></li>)}<li><a href="#key-takeaways">Key takeaways</a></li></ol></details></nav>
    <div className="prose article-prose">
      {post.sections.map((section, index) => <section key={section.heading} id={'section-' + index}><h2>{section.heading}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>)}
      <blockquote>{post.highlight}</blockquote>
      <section className="takeaways" id="key-takeaways"><h2>Key takeaways</h2><ul>{post.takeaways.map(item => <li key={item}>{item}</li>)}</ul></section>
    </div>
    <div className="tags">{post.stack.map(tool => <span key={tool}>{tool}</span>)}</div>
    <div className="article-signoff"><span className="author-avatar" aria-hidden="true">LJ</span><div><h2>Written by {profile.name}</h2><p>DevOps Engineer. Exploring cloud infrastructure, GitOps, and Go.</p><a className="text-link" href={'mailto:' + profile.email}>Have a question? Get in touch ↗</a></div></div>
    <div className="case-next"><h2>Keep reading</h2>{related.map(item => <SiteLink key={item.slug} href={'/blogs/' + item.slug}>{item.title}<span aria-hidden="true">↗</span></SiteLink>)}</div>
  </article>
}
