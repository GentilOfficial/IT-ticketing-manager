import { AuthContext } from '@/context/AuthContext'
import { getCurrentUser, login as loginRequest, register as registerRequest, sessionLogout } from '@/lib/api'
import { getToken, onTokenChange, setToken } from '@/lib/authToken'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [errors, setErrors] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const logout = async () => {
    try {
      const res = await sessionLogout()

      if (!res.success) {
        toast.error('Server logout failed', { position: 'top-center' })
      } else {
        toast.success('Successfully logged out. You can close this tab.', { position: 'top-center' })
      }
    } catch (e) {
      console.error('Logout request failed:', e)
      toast.error('Network error during logout', { position: 'top-center' })
    } finally {
      setUser(null)
      setToken(null)
      setErrors(null)
    }
  }

  const fetchUser = useCallback(async () => {
    try {
      const data = await getCurrentUser()

      if (!data.success) {
        await logout()
        return false
      }

      setUser(data.user)
      return true
    } catch (e) {
      console.error('Invalid or expired token:', e)
      return false
    }
  }, [])

  const login = async (credentials) => {
    setErrors(null)
    try {
      const data = await loginRequest(credentials)

      if (!data.success) {
        setErrors(data.errors || data.message || 'Incorrect email or password.')
        return
      }

      setToken(data.token)

      await fetchUser()
    } catch (e) {
      console.error('An error occurred during authentication:', e)
      setErrors('Network error. Please check your internet connection.')
    }
  }

  const register = async (userDetails) => {
    setErrors(null)
    try {
      const data = await registerRequest(userDetails)

      if (!data.success) {
        setErrors(data.errors || data.message || 'Unable to create account. Please try again.')
        return
      }

      setToken(data.token)

      await fetchUser()
    } catch (e) {
      console.error('An error occurred during registration:', e)
      setErrors('Network error. Please check your internet connection.')
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true)
      try {
        const storedToken = getToken()
        if (storedToken) {
          await fetchUser()
        }
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [fetchUser])

  useEffect(() => {
    const unsubscribe = onTokenChange((token) => {
      if (!token) {
        setUser(null)
        setErrors('Session expired. Please login again.')
      }
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAdmin: user && user.role === 'admin',
        login,
        logout,
        register,
        errors,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
