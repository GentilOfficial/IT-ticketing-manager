import InitAuthLoading from '@/components/loading/InitAuthLoading'
import { useAuth } from '@/providers/AuthProvider'
import { Navigate, Outlet } from 'react-router'

const AuthRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <InitAuthLoading />

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default AuthRoute
