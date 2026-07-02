import SignupForm from '@/components/auth/SignupForm'
import AuthLayout from '@/layouts/AuthLayout'
import { useEffect } from 'react'

const SignupPage = () => {
  useEffect(() => {
    document.title = `Helpdesk - Registration`
  }, [])

  return (
    <AuthLayout>
      <div className="w-full max-w-xs">
        <SignupForm />
      </div>
    </AuthLayout>
  )
}

export default SignupPage
