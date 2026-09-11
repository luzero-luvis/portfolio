import { blogPosts } from '../data/blogPosts'
import SiteLink from './SiteLink'

export default function BlogPostPage({ slug }: { slug: string }) {
  const post = blogPosts.find(item => item.slug === slug)
  if (!post) return <section className="container section empty-state"><h1>Note not found.</h1><SiteLink className="text-link" href="/blogs">Back to all notes ↗</SiteLink></section>
  return <article className="container section blog-article"><SiteLink className="text-link back-link" href="/blogs">← All notes</SiteLink><div className="eyebrow">{post.category} / {post.readTime}</div><h1>{post.title}</h1><p className="lead">{post.summary}</p><a className="text-link" href={post.githubUrl} target="_blank" rel="noreferrer">View the repository ↗</a><blockquote>{post.highlight}</blockquote><div className="tags">{post.stack.map(tool => <span key={tool}>{tool}</span>)}</div><div className="prose">{post.sections.map(section => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>)}<section className="takeaways"><div className="eyebrow">TAKE IT WITH YOU</div><h2>Key takeaways</h2><ul>{post.takeaways.map(item => <li key={item}>{item}</li>)}</ul></section></div><div className="case-next"><span className="mono-label">KEEP READING</span>{blogPosts.filter(item => item.slug !== slug).slice(0, 2).map(item => <SiteLink key={item.slug} href={'/blogs/' + item.slug}>{item.title}<span aria-hidden="true">↗</span></SiteLink>)}</div></article>
}
