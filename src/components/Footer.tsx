import SiteLink from './SiteLink'

export default function Footer() {
  return <footer className="site-footer container"><SiteLink href="/" className="footer-name">luvis joston j.</SiteLink><span>Built with intention. Always a work in progress.</span><span>© {new Date().getFullYear()}</span><a href="#top">Back to top ↑</a></footer>
}
