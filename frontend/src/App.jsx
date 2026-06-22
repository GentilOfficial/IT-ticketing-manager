import LoginPage from '@/pages/LoginPage'
import AuthProvider from '@/providers/AuthProvider'

const App = () => {
  return (
    <AuthProvider>
      <h1 className="text-display">Hello World!</h1>
      <LoginPage />
    </AuthProvider>
  )
}

export default App
