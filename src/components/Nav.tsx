import { useEffect, useRef, useState } from 'react'
import { usePageRoute } from '../hooks/usePageRoute'
import { profile } from '../data/portfolio'
import SiteLink from './SiteLink'

const links = [{ href: '/projects', label: 'Projects', page: 'projects' }, { href: '/skills', label: 'Skills', page: 'skills' }, { href: '/blogs', label: 'Writing', page: 'blogs' }, { href: '/about', label: 'About', page: 'about' }, { href: '/contact', label: 'Contact', page: 'contact' }]

export default function Nav({ theme, onThemeChange }: { theme: 'light' | 'dark'; onThemeChange: () => void }) {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const page = usePageRoute()
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) { setOpen(false); toggle.current?.focus() }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])
  return (
    <header className="site-header">
      <div className="header-inner container">
        <SiteLink className="wordmark" href="/" onClick={() => setOpen(false)} aria-label="Luvis Joston J, home"><span className="logo-mark" aria-hidden="true">lj<span>↗</span></span><span>luvis joston j<span className="wordmark-dot">.</span></span></SiteLink>
        <button ref={toggle} className="menu-toggle" type="button" aria-expanded={open} aria-controls="navigation" onClick={() => setOpen(!open)}>{open ? 'Close −' : 'Menu +'}</button>
        <nav id="navigation" className={'navigation ' + (open ? 'is-open' : '')} aria-label="Main navigation">
          {links.map(link => <SiteLink key={link.page} href={link.href} aria-current={page === link.page ? 'page' : undefined} onClick={() => setOpen(false)}>{link.label}</SiteLink>)}
          <button className="theme-toggle" type="button" onClick={onThemeChange} aria-label={'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme'}>{theme === 'dark' ? '☼ Light' : '◐ Dark'}</button>
          <a className="nav-contact" href={'mailto:' + profile.email}>Email me <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
    </header>
  )
}
