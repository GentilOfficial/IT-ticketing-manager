import InitAuthLoading from '@/components/loading/InitAuthLoading'
import { setToken } from '@/lib/authToken'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { toast } from 'sonner'

const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams()
  const handledCallbackRef = useRef(false)

  useEffect(() => {
    if (handledCallbackRef.current) {
      return
    }

    handledCallbackRef.current = true

    const token = searchParams.get('token')

    if (!token) {
      toast.error('Google authentication failed. Missing token.', { position: 'top-center' })
      window.location.replace('/auth/login')
      return
    }

    setToken(token)
    window.location.replace('/')
  }, [searchParams])

  return <InitAuthLoading />
}

export default OAuthCallbackPage
