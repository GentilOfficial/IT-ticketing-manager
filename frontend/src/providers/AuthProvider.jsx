import { getCurrentUser, login as loginRequest, register as registerRequest } from '@/lib/api'
import { getToken, onTokenChange, setToken } from '@/lib/authToken'
import { createContext, useContext, useEffect, useState } from 'react'

export const AuthContext = createContext({})

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [errors, setErrors] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const logout = () => {
    setUser(null)
    setToken(null)
  }

  const fetchUser = async () => {
    try {
      const data = await getCurrentUser()

      if (!data.success) {
        logout()
        return false
      }

      setUser(data.user)
      return true
    } catch (e) {
      console.error('Invalid or expired token:', e)
      return false
    }
  }

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
  }, [])

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

export const useAuth = () => useContext(AuthContext)
