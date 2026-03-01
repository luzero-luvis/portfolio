export default function Footer() {
  return (
    <footer className="py-7 px-6" style={{ background: 'var(--bg)', borderTop: '1px solid var(--bd)' }}>
      <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="font-mono text-[0.78rem]" style={{ color: 'var(--dim)' }}>
          <span style={{ color: 'var(--dim)' }}>[</span>
          <span style={{ color: 'var(--g)' }}>LJ</span>
          <span style={{ color: 'var(--dim)' }}>]</span>
          <span className="ml-2">Luvis Joston J — DevOps Engineer</span>
        </div>
        <div className="text-[0.75rem]" style={{ color: 'var(--dim)' }}>
          Built with React · TypeScript · Tailwind · Framer Motion
        </div>
      </div>
    </footer>
  )
}
