import { useState } from 'react'
import { archiveWork, featuredWork } from '../data/work'
import Architecture from './Architecture'
import SiteLink from './SiteLink'

export default function Projects({ featured = false }: { featured?: boolean }) {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const visibleWork = archiveWork.filter(work => (category === 'All' || work.category === category) && (work.title + ' ' + work.description + ' ' + work.stack.join(' ')).toLowerCase().includes(query.trim().toLowerCase()))
  const Heading = featured ? 'h2' : 'h1'
  return <section id="selected-work" className="section container">
    <div className="section-heading"><div><div className="eyebrow">01 / SELECTED WORK</div><Heading>Less theory.<br /><span className="heading-accent">More building.</span></Heading></div><div className="section-aside"><p>A few systems I’ve been working on.<br />The code, the decisions, and the lessons.</p>{featured && <SiteLink className="text-link" href="/projects">All projects <span aria-hidden="true">↗</span></SiteLink>}</div></div>
    <div className="project-grid">{featuredWork.map((work, index) => <article className="project-card" key={work.slug}>
      <SiteLink className="project-visual" href={'/projects/' + work.slug} aria-label={'Read case study: ' + work.title}><Architecture compact variant={index} /><span className="project-visual-arrow" aria-hidden="true">↗</span></SiteLink>
      <div className="project-meta"><span>{work.category}</span><span>0{index + 1}</span></div>
      <h3><SiteLink href={'/projects/' + work.slug}>{work.title}</SiteLink></h3><p>{work.summary}</p>
      <div className="tags">{work.stack.map(tag => <span key={tag}>{tag}</span>)}</div>
      <SiteLink className="project-read" href={'/projects/' + work.slug}>Inside the build <span aria-hidden="true">↗</span></SiteLink>
    </article>)}</div>
    {!featured && <div className="project-archive">
      <div className="section-heading"><div><div className="eyebrow">THE WORKBENCH</div><h2>More experiments.<br /><span className="heading-accent">More understanding.</span></h2></div><p className="section-aside">Infrastructure labs, backend services, and small tools. Each one explores a concrete problem.</p></div>
      <div className="archive-controls"><div className="filter-list" role="group" aria-label="Filter projects">{['All', 'Platform', 'Infrastructure', 'Backend', 'Tooling'].map(item => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="search-field"><span className="sr-only">Search projects</span><span aria-hidden="true">⌕</span><input type="search" placeholder="Search projects or tools…" value={query} onChange={event => setQuery(event.target.value)} /></label></div>
      <p className="results-count" role="status">{visibleWork.length} {visibleWork.length === 1 ? 'project' : 'projects'}</p>
      <div className="archive-list">{visibleWork.map(work => <a key={work.repo} className="archive-row" href={'https://github.com/' + work.repo} target="_blank" rel="noreferrer"><span className="archive-category">{work.category}</span><div><h3>{work.title}</h3><p>{work.description}</p></div><span className="archive-stack">{work.stack.join(' / ')}</span><span aria-hidden="true">↗</span></a>)}</div>
      {visibleWork.length === 0 && <div className="empty-state"><h3>No projects match that search.</h3><p>Try a tool like Go, Terraform, or Kubernetes.</p><button className="button button-dark" type="button" onClick={() => { setCategory('All'); setQuery('') }}>Clear filters</button></div>}
    </div>}
  </section>
}
