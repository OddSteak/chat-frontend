'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onCloseAction: () => void
}

export function Toast({ message, type, duration = 4000, onCloseAction }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onCloseAction, 300) // Wait for animation to complete
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onCloseAction])

  const typeStyles = {
    success: 'bg-overlay text-text',
    error: 'bg-overlay text-love',
    warning: 'bg-overlay text-text',
    info: 'bg-overlay text-text'
  }

  return (
    <div
      className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${typeStyles[type]}`}
    >
      <div className="flex items-center space-x-2 bg-overlay">
        <span>{message}</span>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onCloseAction, 300)
          }}
          className="ml-2 text-text hover:text-muted"
        >
          ×
        </button>
      </div>
    </div>
  )
}
