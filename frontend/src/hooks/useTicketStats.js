import { getTicketStats } from '@/lib/api'
import { useEffect, useState } from 'react'

const DEFAULT_STATS = {
  total: 0,
  byStatus: {
    open: 0,
    in_progress: 0,
    on_hold: 0,
    resolved: 0,
  },
}

const useTicketStats = () => {
  const [stats, setStats] = useState(DEFAULT_STATS)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const data = await getTicketStats()

        if (!data.success) {
          setError(data.message || 'Unable to load ticket stats.')
          setStats(DEFAULT_STATS)
        } else {
          setStats({
            total: Number.isFinite(data.total) ? data.total : 0,
            byStatus: {
              ...DEFAULT_STATS.byStatus,
              ...(data.byStatus || {}),
            },
          })
        }
      } catch (err) {
        console.error('An error occurred during ticket stats loading:', err)
        setError('Network error. Please check your internet connection.')
        setStats(DEFAULT_STATS)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  return { stats, isLoading, error }
}

export default useTicketStats
