import LoginForm from '@/components/auth/LoginForm'
import AuthLayout from '@/layouts/AuthLayout'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { toast } from 'sonner'

const LoginPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const handledErrorRef = useRef(null)

  useEffect(() => {
    document.title = `Helpdesk - Login`
  }, [])

  useEffect(() => {
    const error = searchParams.get('error')

    if (!error || handledErrorRef.current === error) {
      return
    }

    handledErrorRef.current = true

    const message = error === 'google' ? 'Google authentication failed. Please try again.' : error
    toast.error(message, { position: 'top-center' })

    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('error')
    setSearchParams(nextParams, { replace: true })
  }, [searchParams, setSearchParams])

  return (
    <AuthLayout>
      <div className="w-full max-w-xs">
        <LoginForm />
      </div>
    </AuthLayout>
  )
}

export default LoginPage
