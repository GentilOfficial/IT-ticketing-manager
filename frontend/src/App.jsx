import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import AuthProvider from '@/providers/AuthProvider'

const App = () => {
  return (
    <AuthProvider>
      <LoginPage />
      <SignupPage />
    </AuthProvider>
  )
}

export default App
