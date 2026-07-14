import { useEffect, useRef } from 'react'

const ACCENTS = ['#4398cd', '#d82d17', '#edcb1f', '#298f1a']

/* 5×7 block font (exported for reuse: 3D world textures) */
export const PIXEL_FONT: Record<string, string[]> = {
  A: ['.XXX.', 'X...X', 'X...X', 'XXXXX', 'X...X', 'X...X', 'X...X'],
  B: ['XXXX.', 'X...X', 'X...X', 'XXXX.', 'X...X', 'X...X', 'XXXX.'],
  C: ['.XXX.', 'X...X', 'X....', 'X....', 'X....', 'X...X', '.XXX.'],
  D: ['XXXX.', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', 'XXXX.'],
  E: ['XXXXX', 'X....', 'X....', 'XXXX.', 'X....', 'X....', 'XXXXX'],
  F: ['XXXXX', 'X....', 'X....', 'XXXX.', 'X....', 'X....', 'X....'],
  G: ['.XXX.', 'X...X', 'X....', 'X.XXX', 'X...X', 'X...X', '.XXX.'],
  H: ['X...X', 'X...X', 'X...X', 'XXXXX', 'X...X', 'X...X', 'X...X'],
  I: ['XXXXX', '..X..', '..X..', '..X..', '..X..', '..X..', 'XXXXX'],
  J: ['XXXXX', '...X.', '...X.', '...X.', '...X.', 'X..X.', '.XX..'],
  K: ['X...X', 'X..X.', 'X.X..', 'XX...', 'X.X..', 'X..X.', 'X...X'],
  L: ['X....', 'X....', 'X....', 'X....', 'X....', 'X....', 'XXXXX'],
  M: ['X...X', 'XX.XX', 'X.X.X', 'X.X.X', 'X...X', 'X...X', 'X...X'],
  N: ['X...X', 'XX..X', 'X.X.X', 'X..XX', 'X...X', 'X...X', 'X...X'],
  O: ['.XXX.', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', '.XXX.'],
  P: ['XXXX.', 'X...X', 'X...X', 'XXXX.', 'X....', 'X....', 'X....'],
  Q: ['.XXX.', 'X...X', 'X...X', 'X...X', 'X.X.X', 'X..X.', '.XX.X'],
  R: ['XXXX.', 'X...X', 'X...X', 'XXXX.', 'X.X..', 'X..X.', 'X...X'],
  S: ['.XXXX', 'X....', 'X....', '.XXX.', '....X', '....X', 'XXXX.'],
  T: ['XXXXX', '..X..', '..X..', '..X..', '..X..', '..X..', '..X..'],
  U: ['X...X', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', '.XXX.'],
  V: ['X...X', 'X...X', 'X...X', 'X...X', 'X...X', '.X.X.', '..X..'],
  W: ['X...X', 'X...X', 'X...X', 'X.X.X', 'X.X.X', 'XX.XX', 'X...X'],
  X: ['X...X', 'X...X', '.X.X.', '..X..', '.X.X.', 'X...X', 'X...X'],
  Y: ['X...X', 'X...X', '.X.X.', '..X..', '..X..', '..X..', '..X..'],
  Z: ['XXXXX', '....X', '...X.', '..X..', '.X...', 'X....', 'XXXXX'],
  '0': ['.XXX.', 'X...X', 'X..XX', 'X.X.X', 'XX..X', 'X...X', '.XXX.'],
  '1': ['..X..', '.XX..', '..X..', '..X..', '..X..', '..X..', '.XXX.'],
  '2': ['.XXX.', 'X...X', '....X', '...X.', '..X..', '.X...', 'XXXXX'],
  '3': ['XXXXX', '...X.', '..X..', '...X.', '....X', 'X...X', '.XXX.'],
  '4': ['...X.', '..XX.', '.X.X.', 'X..X.', 'XXXXX', '...X.', '...X.'],
  '5': ['XXXXX', 'X....', 'XXXX.', '....X', '....X', 'X...X', '.XXX.'],
  '6': ['..XX.', '.X...', 'X....', 'XXXX.', 'X...X', 'X...X', '.XXX.'],
  '7': ['XXXXX', '....X', '...X.', '..X..', '.X...', '.X...', '.X...'],
  '8': ['.XXX.', 'X...X', 'X...X', '.XXX.', 'X...X', 'X...X', '.XXX.'],
  '9': ['.XXX.', 'X...X', 'X...X', '.XXXX', '....X', '...X.', '.XX..'],
  '.': ['.....', '.....', '.....', '.....', '.....', '.XX..', '.XX..'],
  '-': ['.....', '.....', '.....', 'XXXXX', '.....', '.....', '.....'],
  '&': ['.XX..', 'X..X.', 'X.X..', '.X...', 'X.X.X', 'X..X.', '.XX.X'],
  '!': ['..X..', '..X..', '..X..', '..X..', '..X..', '.....', '..X..'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
}

interface PixelTextProps {
  text: string
  /** max size of one block in px (shrinks to fit container) */
  maxBlock?: number
  base?: string
  /** chance a block is one of the 4 accent colors */
  accentRate?: number
  className?: string
}

/** yn10-style headline: text assembled from pixel blocks with random colored squares. */
export default function PixelText({ text, maxBlock = 14, base = '#9a9ea3', accentRate = 0.07, className = '' }: PixelTextProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    // build pixel map once (colors + reveal delays are stable across redraws)
    const lines = text.toUpperCase().split('\n')
    const pixels: { x: number; y: number; c: string; d: number }[] = []
    let cols = 0
    lines.forEach((line, li) => {
      const y0 = li * 9
      let x = 0
      for (const ch of line) {
        const g = PIXEL_FONT[ch] ?? PIXEL_FONT[' ']
        g.forEach((row, ry) => {
          for (let rx = 0; rx < 5; rx++) {
            if (row[rx] === 'X') {
              pixels.push({
                x: x + rx,
                y: y0 + ry,
                c: Math.random() < accentRate ? ACCENTS[Math.floor(Math.random() * 4)] : base,
                d: Math.random() * 750,
              })
            }
          }
        })
        x += 6
      }
      cols = Math.max(cols, x - 1)
    })
    const rows = lines.length * 9 - 2
    let raf = 0
    let started = false

    const draw = () => {
      const parentW = canvas.parentElement?.clientWidth ?? 600
      const b = Math.max(3, Math.min(maxBlock, Math.floor(parentW / cols)))
      const dpr = window.devicePixelRatio || 1
      canvas.width = cols * b * dpr
      canvas.height = rows * b * dpr
      canvas.style.width = cols * b + 'px'
      canvas.style.height = rows * b + 'px'
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.scale(dpr, dpr)
      const gapPx = Math.max(1, Math.round(b * 0.16))
      const start = performance.now()
      cancelAnimationFrame(raf)
      const frame = (now: number) => {
        const t = now - start
        ctx.clearRect(0, 0, cols * b, rows * b)
        let pending = false
        for (const p of pixels) {
          if (t >= p.d) {
            ctx.fillStyle = p.c
            ctx.fillRect(p.x * b, p.y * b, b - gapPx, b - gapPx)
          } else pending = true
        }
        if (pending) raf = requestAnimationFrame(frame)
        else pixels.forEach(p => (p.d = 0)) // future redraws render instantly
      }
      raf = requestAnimationFrame(frame)
    }

    const io = new IntersectionObserver(
      es => {
        if (es[0].isIntersecting && !started) {
          started = true
          draw()
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(canvas)
    const ro = new ResizeObserver(() => { if (started) draw() })
    if (canvas.parentElement) ro.observe(canvas.parentElement)
    return () => { io.disconnect(); ro.disconnect(); cancelAnimationFrame(raf) }
  }, [text, maxBlock, base, accentRate])

  return <canvas ref={ref} className={className} role="img" aria-label={text.replace('\n', ' ')} />
}
