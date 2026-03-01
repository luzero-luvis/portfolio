import { useState, useEffect, useRef } from 'react'

export function useCounter(target: string, duration = 1800) {
  const [display, setDisplay] = useState('0')
  const [inView, setInView]   = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.5 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return

    const suffix = target.replace(/[\d.]/g, '')   // e.g. "+" or ""
    const num    = parseFloat(target)
    const isFloat = target.includes('.')
    const steps  = 40
    const interval = duration / steps
    let step = 0

    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const eased    = 1 - Math.pow(1 - progress, 3)
      const current  = num * eased
      setDisplay((isFloat ? current.toFixed(1) : Math.round(current).toString()) + suffix)
      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [inView, target, duration])

  return { display, ref }
}
