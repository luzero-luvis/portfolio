interface MarqueeProps {
  items: string[]
  reverse?: boolean
  /** background + text theme */
  variant?: 'lime' | 'dark' | 'plain'
}

/** Infinite running strip — the signature Landon Norris band. */
export default function Marquee({ items, reverse, variant = 'lime' }: MarqueeProps) {
  const theme =
    variant === 'lime' ? { bg: '#4398cd', fg: '#0a0a0b', dot: '#0a0a0b' }
    : variant === 'dark' ? { bg: '#101012', fg: '#9a9ea3', dot: '#edcb1f' }
    : { bg: 'transparent', fg: '#e8e8e6', dot: '#4398cd' }

  // duplicate the list so the -50% translate loops seamlessly
  const row = [...items, ...items]

  return (
    <div className="relative overflow-hidden py-4" style={{ background: theme.bg }}>
      <div className={`marquee ${reverse ? 'marquee-reverse' : ''}`}>
        {row.map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span
              className="font-display px-6"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', color: theme.fg }}
            >
              {item}
            </span>
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ background: theme.dot }}
              aria-hidden="true"
            />
          </span>
        ))}
      </div>
    </div>
  )
}
