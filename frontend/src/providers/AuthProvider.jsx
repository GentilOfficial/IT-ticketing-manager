import { createContext, useContext, useEffect, useState } from 'react'

export const AuthContext = createContext({})

const TOKEN_KEY = 'auth_token'

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [errors, setErrors] = useState(null)

  const fetchUser = async (authToken) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_SERVER}/api/auth/me`, {
        method: 'GET',
        headers: {
          Authorization: authToken,
        },
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Invalid token')
      }

      setUser(data.user)
      return true
    } catch (e) {
      console.error('Invalid or expired token:', e)
      setUser(null)
      setToken(null)
      localStorage.removeItem(TOKEN_KEY)
      return false
    }
  }

  const login = async (credentials) => {
    setErrors(null)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_SERVER}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!data.success) {
        setErrors(data.errors || data.message || 'Login failed')
        return
      }

      setToken(data.token)
      localStorage.setItem(TOKEN_KEY, data.token)

      await fetchUser(data.token)
    } catch (e) {
      console.error('An error occurred during authentication:', e)
      setErrors('Network error')
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(TOKEN_KEY)
  }

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY)
      if (!storedToken) return
      const isValid = await fetchUser(storedToken)
      if (isValid) setToken(storedToken)
    }

    initAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const useAuth = () => useContext(AuthContext)
