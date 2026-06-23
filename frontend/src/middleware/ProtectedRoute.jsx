import InitAuthLoading from '@/components/loading/InitAuthLoading'
import { useAuth } from '@/providers/AuthProvider'
import { Navigate, Outlet } from 'react-router'

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <InitAuthLoading />
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />

  return <Outlet />
}

export default ProtectedRoute
