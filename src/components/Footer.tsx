import SiteLink from './SiteLink'

export default function Footer() {
  return <footer className="site-footer container"><SiteLink href="/" className="footer-name">luvis joston j.</SiteLink><span>DevOps engineer, Bengaluru</span><span>© {new Date().getFullYear()}</span><a href="#top">Back to top ↑</a></footer>
}
