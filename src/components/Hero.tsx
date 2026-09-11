import { profile } from '../data/portfolio'
import Architecture from './Architecture'
import SiteLink from './SiteLink'
import Projects from './Projects'
import Skills from './Skills'
import Blogs from './Blogs'
import Contact from './Contact'

const technologies = [['aws', 'AWS'], ['kubernetes', 'Kubernetes'], ['terraform', 'Terraform'], ['go', 'Go'], ['docker', 'Docker'], ['prometheus', 'Prometheus']]

export default function Hero() {
  return <>
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="eyebrow"><span className="status-dot" />DEVOPS & CLOUD ENGINEERING</div>
        <h1 id="hero-title">Luvis<br /><span className="heading-accent">Joston J.</span></h1>
        <p className="hero-role">Cloud infrastructure. Code to production.</p>
        <p className="hero-description">I build cloud infrastructure, automate delivery, and make complex systems easier to understand.</p>
        <div className="button-row"><SiteLink className="button button-dark" href="/projects">Explore my work <span aria-hidden="true">↗</span></SiteLink><a className="text-link" href={profile.github2.url} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a></div>
        <div className="hero-location"><span aria-hidden="true">◎</span> {profile.location}<span className="divider">/</span> Building. Breaking. Learning.</div>
      </div>
      <Architecture />
      <div className="hero-footnote"><span>FROM THE FIRST COMMIT TO THE RUNNING CLUSTER.</span><a href="#selected-work">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a></div>
    </section>
    <div className="tech-strip"><div className="container tech-inner"><span className="mono-label">TOOLS OF THE TRADE</span><div className="tech-list">{technologies.map(([icon, label]) => <span key={icon}><img src={icon === 'aws' ? '/aws-logo.svg' : '/icons/' + icon + '.svg'} width="23" height="23" alt="" />{label}</span>)}</div></div></div>
    <Projects featured /><Skills preview /><Blogs preview /><Contact compact />
  </>
}
