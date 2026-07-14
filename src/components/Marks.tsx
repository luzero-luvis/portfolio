/** The four signature squares (blue · red · yellow · green) — yn10-style mark. */
export default function Marks({ size = 12, className = '' }: { size?: number; className?: string }) {
  const colors = ['#4398cd', '#d82d17', '#edcb1f', '#298f1a']
  return (
    <span className={`inline-flex ${className}`} style={{ gap: Math.round(size / 3) }} aria-hidden="true">
      {colors.map(c => (
        <span key={c} style={{ width: size, height: size, background: c, display: 'block' }} />
      ))}
    </span>
  )
}
