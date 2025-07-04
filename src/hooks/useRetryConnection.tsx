'use client'

import { useState, useCallback } from 'react'
import { useToast } from '@/contexts/ToastContext'

interface RetryState {
  isRetrying: boolean
  retryCount: number
  nextRetryIn: number
}

interface UseRetryConnectionOptions {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
  showNotifications?: boolean
}

export function useRetryConnection(options: UseRetryConnectionOptions = {}) {
  const {
    maxRetries = 5,
    baseDelay = 1000,
    maxDelay = 30000,
    showNotifications = true
  } = options

  const { showToast } = useToast()
  const [retryState, setRetryState] = useState<RetryState>({
    isRetrying: false,
    retryCount: 0,
    nextRetryIn: 0
  })

  const getBackoffDelay = useCallback((retryCount: number): number => {
    const delay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay)
    return delay
  }, [baseDelay, maxDelay])

  const startRetryLoop = useCallback(async (
    retryFunction: () => Promise<void>,
    onSuccess?: (data: any) => void,
    onMaxRetriesReached?: () => void,
  ) => {
    if (retryState.isRetrying) return

    setRetryState(prev => ({ ...prev, isRetrying: true, retryCount: 0 }))

    let currentRetryCount = 0

    const attemptConnection = async (): Promise<void> => {
      try {
        const data: any = await retryFunction()

        // Show success notification if there were previous failures
        if (currentRetryCount > 0 && showNotifications) {
          showToast('Connection restored!', 'success')
        }

        setRetryState({
          isRetrying: false,
          retryCount: 0,
          nextRetryIn: 0
        })

        onSuccess?.(data)
      } catch (error) {
        currentRetryCount++

        // Check if max retries reached
        if (currentRetryCount >= maxRetries) {
          setRetryState({
            isRetrying: false,
            retryCount: currentRetryCount,
            nextRetryIn: 0
          })

          if (showNotifications) {
            showToast('connection failed', 'error')
          }

          onMaxRetriesReached?.()
          return
        }

        // Show error notifications for the first attempt
        if (showNotifications && currentRetryCount === 1) {
          showToast(
            'Connection issues detected. Retrying in background...',
            'warning',
            3000
          )
        }

        const delay = getBackoffDelay(currentRetryCount)

        setRetryState(prev => ({
          ...prev,
          retryCount: currentRetryCount,
          nextRetryIn: Math.ceil(delay / 1000)
        }))

        // Wait for delay, then try again
        setTimeout(() => {
          attemptConnection()
        }, delay)
      }
    }

    attemptConnection()
  }, [maxRetries, getBackoffDelay, showNotifications, showToast])

  const stopRetryLoop = useCallback(() => {
    setRetryState({
      isRetrying: false,
      retryCount: 0,
      nextRetryIn: 0
    })
  }, [])

  return {
    retryState,
    startRetryLoop,
    stopRetryLoop
  }
}
