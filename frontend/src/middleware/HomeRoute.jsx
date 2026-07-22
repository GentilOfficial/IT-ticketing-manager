import InitAuthLoading from '@/components/loading/InitAuthLoading'
import { useAuth } from '@/context/AuthContext'
import HomePage from '@/pages/HomePage'
import { Navigate } from 'react-router'

const HomeRoute = () => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth()

  if (isLoading) return <InitAuthLoading />
  if (isAuthenticated) return <Navigate to={isAdmin ? '/admin' : '/tickets'} replace />

  return <HomePage />
}

export default HomeRoute
