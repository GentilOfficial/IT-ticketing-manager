import InitAuthLoading from '@/components/loading/InitAuthLoading'
import { useAuth } from '@/providers/AuthProvider'
import { Navigate, Outlet } from 'react-router'

const ProtectedRoute = ({ role }) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth()

  if (isLoading) return <InitAuthLoading />
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />
  if (role === 'admin' && !isAdmin) return <Navigate to="/" replace />
  if (role === 'user' && isAdmin) return <Navigate to="/admin" replace />

  return <Outlet />
}

export default ProtectedRoute
