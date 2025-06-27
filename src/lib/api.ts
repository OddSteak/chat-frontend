'use client'

class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`

    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    // Global unauthorized handling
    if (response.status === 401) {
      // Clear any local auth state
      if (typeof window !== 'undefined') {
        // Trigger logout in your auth context
        window.dispatchEvent(new CustomEvent('unauthorized'))
      }
      throw new Error('Unauthorized')
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Convenience methods
  get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' })
  }

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient()
