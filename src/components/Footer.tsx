import { profile } from '../data/portfolio'

const GH_ICON = (<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z"/></svg>)
const LI_ICON = (<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>)
const ML_ICON = (<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>)

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={{ background: '#000000', borderTop: '1px solid rgba(0,255,65,0.1)' }}>
      {/* Terminal command header */}
      <div className="px-6 py-4" style={{ background: 'rgba(10,14,17,0.5)', borderBottom: '1px solid rgba(0,255,65,0.06)' }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[0.78rem]" style={{ color: '#FFB800' }}>$</span>
            <span className="font-mono text-[0.78rem]" style={{ color: '#7A8894' }}>cat copyright.txt</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          {/* Brand */}
          <div>
            <div className="font-mono text-[0.88rem] font-bold mb-1">
              <span style={{ color: '#FFB800' }}>&gt;</span>
              <span style={{ color: '#00FF41' }}>_</span>
              <span className="ml-2" style={{ color: '#C5CDD3' }}>Luvis Joston J</span>
            </div>
            <div className="font-mono text-[0.72rem]" style={{ color: '#5A6873' }}>
              DevOps Engineer · {profile.location}
            </div>
            <div className="font-mono text-[0.68rem] mt-1" style={{ color: '#5A6873' }}>
              © {year} · Built with React · TypeScript · Tailwind · Framer Motion
            </div>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {[
              { href: profile.github1.url,  icon: GH_ICON, label: 'GitHub 1' },
              { href: profile.github2.url,  icon: GH_ICON, label: 'GitHub 2' },
              { href: profile.linkedin.url, icon: LI_ICON, label: 'LinkedIn' },
              { href: `mailto:${profile.email}`, icon: ML_ICON, label: 'Email', ext: false },
            ].map(l => (
              <a
                key={l.label}
                href={l.href}
                target={l.ext !== false ? '_blank' : undefined}
                rel={l.ext !== false ? 'noopener noreferrer' : undefined}
                aria-label={l.label}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:-translate-y-1"
                style={{ background: '#0A0E11', border: '1px solid rgba(0,255,65,0.15)', color: '#7A8894' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#00FF41'; (e.currentTarget as HTMLAnchorElement).style.color = '#00FF41' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,255,65,0.15)'; (e.currentTarget as HTMLAnchorElement).style.color = '#7A8894' }}
              >
                {l.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
