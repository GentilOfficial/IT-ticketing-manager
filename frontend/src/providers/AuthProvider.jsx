import { getCurrentUser, login as loginRequest, register as registerRequest } from '@/lib/api'
import { createContext, useContext, useEffect, useState } from 'react'

export const AuthContext = createContext({})

const TOKEN_KEY = 'auth_token'

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [errors, setErrors] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(TOKEN_KEY)
  }

  const fetchUser = async (authToken) => {
    try {
      const data = await getCurrentUser(authToken)

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
      localStorage.setItem(TOKEN_KEY, data.token)

      await fetchUser(data.token)
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
      localStorage.setItem(TOKEN_KEY, data.token)

      await fetchUser(data.token)
    } catch (e) {
      console.error('An error occurred during registration:', e)
      setErrors('Network error. Please check your internet connection.')
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true)
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY)

        if (storedToken) {
          const isValid = await fetchUser(storedToken)
          if (isValid) setToken(storedToken)
        }
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
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
