import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/portfolio'

export default function Contact({ compact = false }: { compact?: boolean }) {
  const [message, setMessage] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => () => clearTimeout(timer.current), [])
  async function copyEmail() {
    clearTimeout(timer.current)
    try { await navigator.clipboard.writeText(profile.email); setMessage('Email copied.') }
    catch { setMessage('Select the email address to copy it, or open your email app.') }
    timer.current = setTimeout(() => setMessage(''), 5000)
  }
  const Heading = compact ? 'h2' : 'h1'
  return <section className={'contact-section section ' + (compact ? '' : 'contact-full')}><div className="container"><div className="contact-top"><div className="eyebrow"><span className="status-dot" />CONTACT</div><span className="mono-label">BENGALURU, INDIA / USUALLY REPLY WITHIN A DAY</span></div><div className="contact-main"><Heading>Get in touch.</Heading><a className="contact-arrow" href={'mailto:' + profile.email} aria-label="Email Luvis"><span aria-hidden="true">↗</span></a></div><div className="contact-bottom"><div className="email-controls"><a className="email-link" href={'mailto:' + profile.email}>{profile.email}</a><button type="button" className="copy-button" onClick={copyEmail} aria-label="Copy email address">Copy ↗</button><span className="copy-status" role="status">{message}</span></div><div className="contact-socials"><a href={profile.github2.url} target="_blank" rel="noreferrer">GitHub ↗</a><a href={profile.linkedin.url} target="_blank" rel="noreferrer">LinkedIn ↗</a></div></div></div></section>
}
