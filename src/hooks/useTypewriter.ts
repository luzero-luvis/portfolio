import { useState, useEffect } from 'react'

export function useTypewriter(words: string[], typingSpeed = 120, deletingSpeed = 60, pauseTime = 2400) {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const currentWord = words[wordIndex]

    if (isDeleting) {
      if (text === '') {
        setIsDeleting(false)
        setWordIndex((prev) => (prev + 1) % words.length)
      } else {
        timeout = setTimeout(() => {
          setText(currentWord.slice(0, text.length - 1))
        }, deletingSpeed)
      }
    } else {
      if (text === currentWord) {
        timeout = setTimeout(() => {
          setIsDeleting(true)
        }, pauseTime)
      } else {
        timeout = setTimeout(() => {
          setText(currentWord.slice(0, text.length + 1))
        }, typingSpeed)
      }
    }

    return () => clearTimeout(timeout)
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime])

  return text
}
