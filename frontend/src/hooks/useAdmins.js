import { getAdminUsers } from '@/lib/api'
import { useEffect, useState } from 'react'

const useAdmins = (enabled = true) => {
  const [admins, setAdmins] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const refreshAdmins = async () => {
    if (!enabled) {
      setAdmins([])
      setError(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const data = await getAdminUsers()

      if (!data.success) {
        const errorMessage = data.message
          ? `Error during admins loading: ${data.message}`
          : 'Error during admins loading'
        setError(errorMessage)
        setAdmins([])
      } else {
        setAdmins(Array.isArray(data.users) ? data.users : [])
      }
    } catch (err) {
      console.error('An error occurred during admins loading:', err)
      const errorMessage = 'Error during admins loading: Network error. Please check your internet connection.'
      setError(errorMessage)
      setAdmins([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshAdmins()
  }, [enabled])

  return { admins, isLoading, error, refreshAdmins }
}

export default useAdmins
