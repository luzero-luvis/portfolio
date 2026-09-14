import type { BlogPost } from '../types'

export function readingTime(post: BlogPost): string {
  const content = [post.title, post.summary, post.highlight, ...post.takeaways,
    ...post.sections.flatMap(section => [section.heading, ...section.paragraphs])].join(' ')
  const minutes = Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 265))
  return minutes + ' min read'
}
