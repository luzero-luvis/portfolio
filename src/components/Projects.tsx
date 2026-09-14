import { useState } from 'react'
import { archiveWork, featuredWork } from '../data/work'
import SkillIcon from './SkillIcon'
import SiteLink from './SiteLink'

export default function Projects({ featured = false }: { featured?: boolean }) {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const visibleWork = archiveWork.filter(work => (category === 'All' || work.category === category) && (work.title + ' ' + work.description + ' ' + work.stack.join(' ')).toLowerCase().includes(query.trim().toLowerCase()))
  const Heading = featured ? 'h2' : 'h1'
  const ProjectHeading = featured ? 'h3' : 'h2'
  return <section id="selected-work" className="section container" aria-labelledby="selected-work-title">
    <div className="section-heading">
      <div>
        <div className="eyebrow">SELECTED WORK</div>
        <Heading id="selected-work-title">Things I’ve built.</Heading>
      </div>
      <div className="section-aside">
        <p>A closer look at the systems, the decisions, and my contribution.</p>
        {featured && <SiteLink className="text-link" href="/projects">All 21 projects <span aria-hidden="true">↗</span></SiteLink>}
      </div>
    </div>
    <div className="project-grid">{featuredWork.map((work, index) => <article className={'project-card project-tone-' + index} key={work.slug} aria-labelledby={'project-' + work.slug}>
      <div className="project-visual" aria-hidden="true">
        <div className="project-visual-label"><span>{work.category}</span><span>0{index + 1}</span></div>
        <div className="project-flow">{work.preview.steps.map(step => <div className="project-node" key={step.label}><span className="project-node-icon"><SkillIcon name={step.icon} /></span><span>{step.label}</span></div>)}</div>
      </div>
      <div className="project-content">
        <div className="project-ownership">{work.kind.startsWith('Team') ? 'Team contribution' : 'Personal project'}</div>
        <ProjectHeading id={'project-' + work.slug} className="project-title"><SiteLink href={'/projects/' + work.slug}>{work.preview.title}</SiteLink></ProjectHeading>
        <p className="project-summary">{work.preview.description}</p>
        <div className="project-contribution"><span>My contribution</span><p>{work.preview.contribution}</p></div>
        <ul className="project-tools" aria-label="Technologies">{work.stack.map(tag => <li key={tag}>{tag}</li>)}</ul>
        <SiteLink className="project-read" href={'/projects/' + work.slug} aria-label={'Read the case study: ' + work.preview.title}>Explore the project <span aria-hidden="true">↗</span></SiteLink>
      </div>
    </article>)}</div>
    {!featured && <div className="project-archive">
      <div className="section-heading"><div><div className="eyebrow">02 / ARCHIVE</div><h2>18 more projects and labs.</h2></div><p className="section-aside">Infrastructure labs, backend services, and small tools. Each one links to its repository.</p></div>
      <div className="archive-controls"><div className="filter-list" role="group" aria-label="Filter projects">{['All', 'Platform', 'Infrastructure', 'Backend', 'Tooling'].map(item => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="search-field"><span className="sr-only">Search projects</span><span aria-hidden="true">⌕</span><input type="search" placeholder="Search projects or tools…" value={query} onChange={event => setQuery(event.target.value)} /></label></div>
      <p className="results-count" role="status">{visibleWork.length} {visibleWork.length === 1 ? 'project' : 'projects'}</p>
      <div className="archive-list">{visibleWork.map(work => <a key={work.repo} className="archive-row" href={'https://github.com/' + work.repo} target="_blank" rel="noreferrer"><span className="archive-category">{work.category}</span><div><h3>{work.title}</h3><p>{work.description}</p></div><span className="archive-stack">{work.stack.join(' / ')}</span><span aria-hidden="true">↗</span></a>)}</div>
      {visibleWork.length === 0 && <div className="empty-state"><h3>No projects match that search.</h3><p>Try a tool like Go, Terraform, or Kubernetes.</p><button className="button button-dark" type="button" onClick={() => { setCategory('All'); setQuery('') }}>Clear filters</button></div>}
    </div>}
  </section>
}
