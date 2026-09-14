import { profile } from '../data/portfolio'
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
        <div className="hero-intro"><span className="status-dot" />Hello, I’m Luvis. A DevOps Engineer.</div>
        <h1 id="hero-title" className="name-lockup" aria-label="Luvis Joston J">
          <span className="name-letters" aria-hidden="true">{'Luvis'.split('').map((letter, index) => <span className={'name-letter name-letter-' + index} key={index}>{letter}</span>)}</span>
          <span className="hero-surname" aria-hidden="true">Joston J.</span>
        </h1>
        <p className="hero-description">
          I turn code into running systems.<br />
          Cloud infrastructure, Kubernetes, and a little Go —<br className="desktop-break" /> with the lessons written down along the way.
        </p>
        <div className="button-row">
          <SiteLink className="button button-dark" href="/projects">Explore my work <span aria-hidden="true">↗</span></SiteLink>
          <SiteLink className="button button-outline" href="/blogs">Read my blog <span aria-hidden="true">↗</span></SiteLink>
        </div>
      </div>
      <div className="hero-details"><span>Bengaluru, India</span><a href={profile.github2.url} target="_blank" rel="noreferrer">Find me on GitHub ↗</a></div>
    </section>
    <div className="tech-strip"><div className="container tech-inner"><span className="mono-label">WORKING WITH</span><div className="tech-list">{technologies.map(([icon, label]) => <span key={icon}><img src={icon === 'aws' ? '/aws-logo.svg' : '/icons/' + icon + '.svg'} width="23" height="23" alt="" />{label}</span>)}</div></div></div>
    <Projects featured /><Blogs preview /><Skills preview /><Contact compact />
  </>
}
