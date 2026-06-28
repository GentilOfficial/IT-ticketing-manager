import { getAdminUsers } from '@/lib/api'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const useAdmins = (token, enabled) => {
  const [admins, setAdmins] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const refreshAdmins = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getAdminUsers(token)

      if (!data.success) {
        const errorMessage = data.message
          ? `Error during admins loading: ${data.message}`
          : 'Error during admins loading'
        setError(errorMessage)
        toast.error(errorMessage, { position: 'top-center' })
        setAdmins([])
      } else {
        setAdmins(data.users)
        toast.success('Admins loaded successfully', { position: 'top-center' })
      }
    } catch (err) {
      console.error('An error occurred during admins loading:', err)
      const errorMessage = 'Error during admins loading: Network error. Please check your internet connection.'
      setError(errorMessage)
      toast.error(errorMessage, { position: 'top-center' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (enabled) refreshAdmins()
  }, [token])

  return { admins, isLoading, error, refreshAdmins }
}

export default useAdmins
