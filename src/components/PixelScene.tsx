import { useEffect, useRef } from 'react'

/* color keys for sprite bitmaps */
const C: Record<string, string> = {
  G: '#298f1a', g: '#47a639', Y: '#edcb1f', R: '#d82d17', B: '#4398cd', W: '#c8c8c8',
}

/* original pixel sprites (not copied assets) */
const SPRITES: Record<string, string[]> = {
  palm: [
    '.gG.Gg.',
    'gG.G.Gg',
    'G..Y..G',
    '...Y...',
    '...Y...',
    '..YY...',
    '.YYYY..',
  ],
  cactus: [
    '..G..',
    'G.G.G',
    'G.G.G',
    'GGGGG',
    '..G..',
    '..G..',
    '.YYY.',
  ],
  crab: [
    'R.....R',
    '.R...R.',
    '..RRR..',
    '.RRRRR.',
    'R.RRR.R',
    '..R.R..',
  ],
  duck: [
    '.WW..',
    'WWY..',
    '.WWWW',
    '.WWW.',
    'BBBBB',
  ],
  flag: [
    'RRRR.',
    'RWWR.',
    'RRRR.',
    'W....',
    'W....',
    'W....',
  ],
  block: [
    'BB',
    'BB',
  ],
}

function Sprite({ name, block = 6 }: { name: keyof typeof SPRITES; block?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const map = SPRITES[name]
    const w = map[0].length, h = map.length
    const dpr = window.devicePixelRatio || 1
    canvas.width = w * block * dpr
    canvas.height = h * block * dpr
    canvas.style.width = w * block + 'px'
    canvas.style.height = h * block + 'px'
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(dpr, dpr)
    map.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const c = C[row[x]]
        if (c) { ctx.fillStyle = c; ctx.fillRect(x * block, y * block, block - 1, block - 1) }
      }
    })
  }, [name, block])
  return <canvas ref={ref} />
}

/* placements: deterministic scatter, edges-biased so text stays readable */
const ITEMS: { name: keyof typeof SPRITES; top: string; left: string; block: number; dur: number }[] = [
  { name: 'palm',   top: '8%',  left: '3%',  block: 7, dur: 7 },
  { name: 'cactus', top: '30%', left: '7%',  block: 6, dur: 9 },
  { name: 'crab',   top: '70%', left: '4%',  block: 5, dur: 6 },
  { name: 'palm',   top: '78%', left: '88%', block: 8, dur: 8 },
  { name: 'crab',   top: '12%', left: '90%', block: 6, dur: 7 },
  { name: 'cactus', top: '55%', left: '93%', block: 5, dur: 10 },
  { name: 'duck',   top: '88%', left: '55%', block: 5, dur: 9 },
  { name: 'flag',   top: '40%', left: '95%', block: 6, dur: 8 },
  { name: 'block',  top: '25%', left: '45%', block: 7, dur: 11 },
  { name: 'block',  top: '65%', left: '25%', block: 5, dur: 9 },
  { name: 'block',  top: '15%', left: '70%', block: 6, dur: 12 },
]

/* small yellow "coin" dots, deterministic pseudo-random spread */
const DOTS = Array.from({ length: 42 }, (_, i) => ({
  top: `${(i * 47.3) % 100}%`,
  left: `${(i * 73.7) % 100}%`,
  size: 3 + (i % 3) * 2,
  dur: 6 + (i % 5) * 2,
}))

/** Fixed background world — floating pixel sprites + coin dots on the studded black plane. */
export default function PixelScene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {DOTS.map((d, i) => (
        <span
          key={`d${i}`}
          className="absolute"
          style={{
            top: d.top, left: d.left, width: d.size, height: d.size,
            background: '#edcb1f', opacity: 0.5,
            animation: `float-px ${d.dur}s ease-in-out ${i % 4}s infinite alternate`,
          }}
        />
      ))}
      {ITEMS.map((it, i) => (
        <div
          key={`s${i}`}
          className="absolute"
          style={{ top: it.top, left: it.left, opacity: 0.8, animation: `float-px ${it.dur}s ease-in-out ${i % 3}s infinite alternate` }}
        >
          <Sprite name={it.name} block={it.block} />
        </div>
      ))}
    </div>
  )
}
