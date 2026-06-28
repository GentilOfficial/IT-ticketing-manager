import { getTickets } from '@/lib/api'
import { useEffect, useState } from 'react'

const useTickets = (token) => {
  const [tickets, setTickets] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const refreshTickets = async () => {
    if (!token) {
      setTickets([])
      setError(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const data = await getTickets(token)

      if (!data.success) {
        setError(data.message || 'Error during tickets loading.')
        setTickets([])
      } else {
        setTickets(Array.isArray(data.tickets) ? data.tickets : [])
      }
    } catch (err) {
      console.error('An error occurred during tickets loading:', err)
      setError('Network error. Please check your internet connection.')
      setTickets([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshTickets()
  }, [token])

  return { tickets, isLoading, error, refreshTickets }
}

export default useTickets
