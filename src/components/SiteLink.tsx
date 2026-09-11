import type { AnchorHTMLAttributes, MouseEvent } from 'react'

export default function SiteLink({ href = '/', onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target || !href.startsWith('/')) return
    event.preventDefault()
    window.history.pushState({}, '', href)
    window.dispatchEvent(new Event('pagechange'))
    window.scrollTo({ top: 0, behavior: 'instant' })
    requestAnimationFrame(() => document.getElementById('main-content')?.focus({ preventScroll: true }))
  }
  return <a href={href} onClick={navigate} {...props} />
}
