import { useEffect, useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import ProjectPage from './components/ProjectPage'
import Blogs from './components/Blogs'
import BlogPostPage from './components/BlogPostPage'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SiteLink from './components/SiteLink'
import { blogPosts } from './data/blogPosts'
import { featuredWork } from './data/work'

const titles: Record<string, string> = { home: 'DevOps & Cloud Engineer', about: 'About', skills: 'Expertise', projects: 'Selected Work', blogs: 'Field Notes', contact: 'Contact' }

export default function App() {
  const [pathname, setPathname] = useState(window.location.pathname)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => window.localStorage.getItem('portfolio-theme') === 'dark' ? 'dark' : 'light')
  useEffect(() => {
    const update = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', update)
    window.addEventListener('pagechange', update)
    return () => { window.removeEventListener('popstate', update); window.removeEventListener('pagechange', update) }
  }, [])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('portfolio-theme', theme)
  }, [theme])
  const [page = 'home', slug, ...extra] = pathname.split('/').filter(Boolean)
  const post = page === 'blogs' ? blogPosts.find(item => item.slug === slug) : undefined
  const project = page === 'projects' ? featuredWork.find(item => item.slug === slug) : undefined
  const valid = Object.prototype.hasOwnProperty.call(titles, page) && extra.length === 0 && (!slug || (page === 'blogs' && post) || (page === 'projects' && project))
  useEffect(() => {
    const title = valid ? post?.title ?? project?.title ?? titles[page] : 'Page not found'
    const description = post?.summary ?? project?.summary ?? 'Luvis Joston J — DevOps engineer in Bengaluru building cloud infrastructure, Kubernetes platforms, GitOps workflows, and Go services. Explore projects and engineering notes.'
    document.title = title + ' — Luvis Joston J'
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', document.title)
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description)
  }, [page, post, project, valid])
  const content = !valid ? <section className="container section empty-state"><div className="eyebrow">404 / WRONG TURN</div><h1>Nothing running here.</h1><p>That page doesn’t exist. Let’s get you back to the work.</p><SiteLink className="button button-dark" href="/">Back home ↗</SiteLink></section> : { home: <Hero />, about: <About />, skills: <Skills />, projects: slug ? <ProjectPage slug={slug} /> : <Projects />, blogs: slug ? <BlogPostPage slug={slug} /> : <Blogs />, contact: <Contact /> }[page]
  return <div id="top" className={'site-shell ' + (theme === 'dark' ? 'dark-theme' : '')}><a className="skip-link" href="#main-content">Skip to content</a><Nav theme={theme} onThemeChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} /><main id="main-content" tabIndex={-1} key={pathname}>{content}</main><Footer /></div>
}
