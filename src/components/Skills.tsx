import { capabilities } from '../data/work'
import { skillCategories } from '../data/portfolio'
import SkillIcon from './SkillIcon'

const categoryIcons = ['AWS', 'Kubernetes', 'GitHub Actions', 'Grafana', 'Git', 'Go', 'PostgreSQL', 'Linux']

export default function Skills({ preview = false }: { preview?: boolean }) {
  const Heading = preview ? 'h2' : 'h1'
  return (
    <section className="expertise-section section">
      <div className="container">
        <div className="section-heading">
          <div>
            <div className="eyebrow">02 / HOW I WORK</div>
            <Heading>The whole system.<br /><span className="heading-accent">Beyond the deploy.</span></Heading>
          </div>
          <p className="section-aside">I connect infrastructure, delivery, and observability — and write down what I learn along the way.</p>
        </div>
        <div className="capability-grid">
          {capabilities.map(item => (
            <article key={item.number}>
              <span className="capability-number">/{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="tags">{item.tools.map(tool => <span key={tool}>{tool}</span>)}</div>
              <a className="text-link" href={'https://github.com/' + item.repo} target="_blank" rel="noreferrer">See it in the code ↗</a>
            </article>
          ))}
        </div>
        <div className="skills-toolkit">
          <div className="eyebrow">THE TOOLKIT</div>
          <h2>Tools I work with<span className="wordmark-dot">.</span></h2>
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
