import LoginForm from '@/components/auth/LoginForm'
import AuthLayout from '@/layouts/AuthLayout'
import { useEffect } from 'react'

const LoginPage = () => {
  useEffect(() => {
    document.title = `Helpdesk - Login`
  }, [])

  return (
    <AuthLayout>
      <div className="w-full max-w-xs">
        <LoginForm />
      </div>
    </AuthLayout>
  )
}

export default LoginPage
