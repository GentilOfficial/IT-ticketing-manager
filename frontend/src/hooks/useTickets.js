import { getTickets } from '@/lib/api'
import { useEffect, useState } from 'react'

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 1,
}

const useTickets = (token, query = {}) => {
  const [tickets, setTickets] = useState([])
  const [groups, setGroups] = useState([])
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const { search, status, page, limit, sort, order, groupBy } = query

  const refreshTickets = async () => {
    if (!token) {
      setTickets([])
      setGroups([])
      setPagination(DEFAULT_PAGINATION)
      setError(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const data = await getTickets(token, query)

      if (!data.success) {
        setError(data.message || 'Error during tickets loading.')
        setTickets([])
        setGroups([])
        setPagination(DEFAULT_PAGINATION)
      } else {
        setTickets(Array.isArray(data.tickets) ? data.tickets : [])
        setGroups(Array.isArray(data.groups) ? data.groups : [])
        setPagination(data.pagination || DEFAULT_PAGINATION)
      }
    } catch (err) {
      console.error('An error occurred during tickets loading:', err)
      setError('Network error. Please check your internet connection.')
      setTickets([])
      setGroups([])
      setPagination(DEFAULT_PAGINATION)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshTickets()
  }, [token, search, status, page, limit, sort, order, groupBy])

  return { tickets, groups, pagination, isLoading, error, refreshTickets }
}

export default useTickets
