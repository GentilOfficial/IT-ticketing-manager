import LoginForm from '@/components/auth/LoginForm'
import AuthLayout from '@/layouts/AuthLayout'

const LoginPage = () => {
  return (
    <AuthLayout>
      <div className="w-full max-w-xs">
        <LoginForm />
      </div>
    </AuthLayout>
  )
}

export default LoginPage
