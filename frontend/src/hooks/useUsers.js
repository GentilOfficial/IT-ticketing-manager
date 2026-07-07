import { getAllUsers } from '@/lib/api'
import { useEffect, useState } from 'react'

const USERS_PAGE_SIZE = 20

const useUsers = ({ enabled = true } = {}) => {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleUserUpdated = (updatedUser) => {
    setUsers(users.map((user) => (user._id === updatedUser._id ? updatedUser : user)))
  }

  useEffect(() => {
    const loadUsers = async () => {
      if (!enabled) {
        setUsers([])
        setPagination(null)
        setError(null)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const data = await getAllUsers({ page: 1, limit: USERS_PAGE_SIZE, search: query })

        if (!data.success) {
          const errorMessage = data.message
            ? `Error during users loading: ${data.message}`
            : 'Error during users loading'
          setError(errorMessage)
          setUsers([])
        } else {
          setUsers(Array.isArray(data.users) ? data.users : [])
          setPagination(data.pagination || null)
          setPage(1)
        }
      } catch (err) {
        console.error('An error occurred during users loading:', err)
        setError('Error during users loading: Network error. Please check your internet connection.')
        setUsers([])
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [query, enabled])

  const loadMoreUsers = async () => {
    if (!pagination?.hasNext || isLoading) return

    const nextPage = page + 1

    try {
      setIsLoading(true)
      setError(null)
      const data = await getAllUsers({ page: nextPage, limit: USERS_PAGE_SIZE, search: query })

      if (!data.success) {
        setError(data.message ? `Error during users loading: ${data.message}` : 'Error during users loading')
      } else {
        setUsers([...users, ...(Array.isArray(data.users) ? data.users : [])])
        setPagination(data.pagination || null)
        setPage(nextPage)
      }
    } catch (err) {
      console.error('An error occurred during users loading:', err)
      setError('Error during users loading: Network error. Please check your internet connection.')
    } finally {
      setIsLoading(false)
    }
  }

  return { query, setQuery, users, handleUserUpdated, isLoading, error, pagination, loadMoreUsers }
}

export default useUsers
