interface MarqueeProps {
  items: string[]
  reverse?: boolean
  /** background + text theme */
  variant?: 'lime' | 'dark' | 'plain'
}

/** Infinite running strip — the signature Landon Norris band. */
export default function Marquee({ items, reverse, variant = 'lime' }: MarqueeProps) {
  const theme =
    variant === 'lime' ? { bg: '#d2ff00', fg: '#111112', dot: '#111112' }
    : variant === 'dark' ? { bg: '#111112', fg: '#ebeee0', dot: '#d2ff00' }
    : { bg: 'transparent', fg: '#282c20', dot: '#d2ff00' }

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
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: theme.dot }}
              aria-hidden="true"
            />
          </span>
        ))}
      </div>
    </div>
  )
}
