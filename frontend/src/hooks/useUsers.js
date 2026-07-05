import { getAllUsers } from '@/lib/api'
import { useEffect, useState } from 'react'

const useUsers = () => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleUserUpdated = (updatedUser) => {
    setUsers(users.map((user) => (user._id === updatedUser._id ? updatedUser : user)))
  }

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getAllUsers()

      if (!data.success) {
        const errorMessage = data.message ? `Error during users loading: ${data.message}` : 'Error during users loading'
        setError(errorMessage)
        setUsers([])
      } else {
        setUsers(Array.isArray(data.users) ? data.users : [])
      }
    } catch (err) {
      console.error('An error occurred during users loading:', err)
      const errorMessage = 'Error during users loading: Network error. Please check your internet connection.'
      setError(errorMessage)
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  return { users, handleUserUpdated, isLoading, error }
}

export default useUsers
