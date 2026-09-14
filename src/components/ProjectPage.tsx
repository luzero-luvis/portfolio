import { featuredWork } from '../data/work'
import { profile } from '../data/portfolio'
import StackDiagram from './StackDiagram'
import SiteLink from './SiteLink'

export default function ProjectPage({ slug }: { slug: string }) {
  const work = featuredWork.find(item => item.slug === slug)
  if (!work) return <section className="container section empty-state"><h1>Project not found.</h1><SiteLink className="text-link" href="/projects">Back to all work ↗</SiteLink></section>
  return <article className="container section case-study">
    <SiteLink className="text-link back-link" href="/projects">← All work</SiteLink>
    <div className="case-heading"><div><div className="eyebrow">{work.category} / {work.kind}</div><h1>{work.title}</h1><p className="lead">{work.summary}</p><div className="tags">{work.stack.map(tool => <span key={tool}>{tool}</span>)}</div>{work.repo ? <a className="button button-dark" href={'https://github.com/' + work.repo} target="_blank" rel="noreferrer">View the repository ↗</a> : <a className="button button-dark" href={'mailto:' + profile.email + '?subject=Let%E2%80%99s%20talk%20about%20the%20Hetzner%20platform'}>Email me about this work ↗</a>}</div><StackDiagram layers={work.layers} variant={featuredWork.indexOf(work)} /></div>
    <div className="contribution"><span className="mono-label">MY CONTRIBUTION</span><p>{work.role}</p></div>
    <div className="case-body"><aside><span className="mono-label">INSIDE THE BUILD</span><a href="#problem">01 — The problem</a><a href="#decisions">02 — Design decisions</a><a href="#result">03 — What’s implemented</a><a href="#next">04 — What comes next</a></aside><div className="prose"><section id="problem"><div className="eyebrow">01 / CONTEXT</div><h2>The problem</h2><p>{work.problem}</p></section><section id="decisions"><div className="eyebrow">02 / APPROACH</div><h2>Design decisions</h2><ol>{work.decisions.map(decision => <li key={decision}>{decision}</li>)}</ol></section><section id="result"><div className="eyebrow">03 / THE BUILD</div><h2>What’s implemented</h2><p>{work.outcome}</p></section><section id="next"><div className="eyebrow">04 / NEXT ITERATION</div><h2>What comes next</h2><p>{work.next}</p></section></div></div>
    <div className="case-next"><span className="mono-label">KEEP EXPLORING</span>{featuredWork.filter(item => item.slug !== slug).map(item => <SiteLink key={item.slug} href={'/projects/' + item.slug}>{item.title}<span aria-hidden="true">↗</span></SiteLink>)}</div>
  </article>
}
