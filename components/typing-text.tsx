"use client"

import { useState, useEffect } from "react"

interface TypingTextProps {
  text: string
  speed?: number
  className?: string
  loop?: boolean
  pauseDuration?: number
}

export function TypingText({ text, speed = 100, className = "", loop = false, pauseDuration = 2000 }: TypingTextProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    console.log("[v0] Typing state:", { currentIndex, displayText, isDeleting, isPaused, textLength: text.length })

    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false)
        if (loop) {
          setIsDeleting(true)
        }
      }, pauseDuration)
      return () => clearTimeout(pauseTimeout)
    }

    if (!isDeleting && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)
      return () => clearTimeout(timeout)
    } else if (!isDeleting && currentIndex === text.length && loop) {
      setIsPaused(true)
    } else if (isDeleting && displayText.length > 0) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1))
      }, speed / 2)
      return () => clearTimeout(timeout)
    } else if (isDeleting && displayText.length === 0) {
      setIsDeleting(false)
      setCurrentIndex(0)
    }
  }, [currentIndex, text, speed, isDeleting, isPaused, loop, pauseDuration, displayText])

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  )
}
