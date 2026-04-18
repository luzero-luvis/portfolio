interface TerminalHeaderProps {
  /** Shell command shown as the label, e.g. "ls -la skills/" */
  command: string
  /** Short subtitle shown below the command */
  subtitle?: string
}

/**
 * Cyber Terminal section header — matches neeraj-devops.vercel.app style:
 *
 *  ┌─────────────────────────────────────────┐
 *  │  $ ls -la skills/█                      │
 *  │  Exploring technical expertise...        │
 *  │  ● ● ●                                  │
 *  └─────────────────────────────────────────┘
 */
export default function TerminalHeader({ command, subtitle }: TerminalHeaderProps) {
  return (
    <div
      className="w-full mb-12 px-6 py-8 rounded-2xl"
      style={{ background: 'rgba(10,14,17,0.7)', border: '1px solid rgba(0,255,65,0.12)' }}
    >
      {/* Command row */}
      <div className="flex items-center gap-2 mb-2">
        <span className="font-mono font-bold" style={{ color: '#FFB800', fontSize: '1.15rem' }}>$</span>
        <span className="font-mono font-bold" style={{ color: '#C5CDD3', fontSize: '1.15rem' }}>{command}</span>
        {/* Blinking cursor */}
        <span className="animate-blink inline-block w-[10px] h-[1.1em] align-middle" style={{ background: '#00FF41' }} />
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="font-mono mb-4" style={{ color: '#7A8894', fontSize: '0.85rem' }}>
          {subtitle}
        </p>
      )}

      {/* macOS-style traffic lights */}
      <div className="flex gap-2 mt-3">
        <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
      </div>
    </div>
  )
}
