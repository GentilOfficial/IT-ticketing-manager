import { getTickets } from '@/lib/api'
import { useEffect, useState } from 'react'

const useTickets = (token) => {
  const [tickets, setTickets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const refreshTickets = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getTickets(token)

      if (!data.success) {
        setError(data.message || 'Error during tickets loading.')
        setTickets([])
      } else {
        setTickets(data.tickets)
      }
    } catch (err) {
      console.error('An error occurred during tickets loading:', err)
      setError('Network error. Please check your internet connection.')
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
