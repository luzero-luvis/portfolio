import { capabilities } from '../data/work'
import { skillCategories } from '../data/portfolio'
import SkillIcon from './SkillIcon'

const categoryIcons = ['AWS', 'Kubernetes', 'GitHub Actions', 'Grafana', 'Git', 'Go', 'PostgreSQL', 'Linux']

export default function Skills({ preview = false }: { preview?: boolean }) {
  const Heading = preview ? 'h2' : 'h1'
  return (
    <section className="expertise-section section" aria-labelledby="expertise-title">
      <div className="container">
        <div className="section-heading">
          <div>
            <div className="eyebrow">MY TOOLKIT</div>
            <Heading id="expertise-title">The tools behind the work.</Heading>
          </div>
          <p className="section-aside">The three areas most of my work falls into. Each links to a repository that shows it.</p>
        </div>
        <div className="capability-grid">
          {capabilities.map(item => (
            <article key={item.number}>
              <span className="capability-number">/{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="tags">{item.tools.map(tool => <span key={tool}>{tool}</span>)}</div>
              <a className="text-link" href={'https://github.com/' + item.repo} target="_blank" rel="noreferrer">View repository ↗</a>
            </article>
          ))}
        </div>
        <div className="skills-toolkit">
          <div className="eyebrow">TOOLS</div>
          <h2>Day-to-day toolkit.</h2>
          <div className="skills-grid">
            {skillCategories.map((category, index) => (
              <article className="skill-category" key={category.name}>
                <div className="skill-category-heading">
                  <SkillIcon name={categoryIcons[index]} />
                  <h3>{category.name}</h3>
                </div>
                <ul className="skill-pills">
                  {category.skills.map(skill => (
                    <li key={skill}><SkillIcon name={skill} /><span>{skill}</span></li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
