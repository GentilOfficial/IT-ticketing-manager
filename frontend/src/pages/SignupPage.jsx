import { SignupForm } from '@/components/auth/SignupForm'
import AuthLayout from '@/layouts/AuthLayout'

const SignupPage = () => {
  return (
    <AuthLayout>
      <div className="w-full max-w-xs">
        <SignupForm />
      </div>
    </AuthLayout>
  )
}

export default SignupPage
