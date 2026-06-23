import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/AuthProvider'

const HomePage = () => {
  const { logout } = useAuth()
  return (
    <div>
      <h1>Home</h1>
      <Button variant="destructive" onClick={logout}>
        Logout
      </Button>
    </div>
  )
}

export default HomePage
