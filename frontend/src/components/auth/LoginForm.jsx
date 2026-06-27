import FormField from '@/components/form/FormField'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldSeparator } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/providers/AuthProvider'
import { useState } from 'react'
import { Link } from 'react-router'

const LoginForm = () => {
  const { login, errors } = useAuth()
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const fieldErrors = Array.isArray(errors) ? errors : []
  const formError = typeof errors === 'string' ? errors : null

  const canSubmitForm = Object.values(credentials).every(Boolean)

  const setCredentialsField = (e) => {
    const { name, value } = e.target
    setCredentials({
      ...credentials,
      [name]: value,
    })
  }

  const resetPasswordField = () => {
    setCredentials({
      ...credentials,
      password: '',
    })
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()

    const tryLogin = async () => {
      setIsLoading(true)
      await login(credentials)
      setIsLoading(false)
      resetPasswordField()
    }

    tryLogin()
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleFormSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">Enter your email below to login to your account</p>
        </div>
        <FormField
          name="email"
          label="Email"
          type="email"
          placeholder="name@example.com"
          required
          value={credentials.email}
          onChange={setCredentialsField}
          errors={fieldErrors}
          disabled={isLoading}
        />
        <FormField
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          required
          value={credentials.password}
          onChange={setCredentialsField}
          errors={fieldErrors}
          disabled={isLoading}
        />
        <Field>
          {formError && <FieldDescription className="text-destructive">{formError}</FieldDescription>}
          <Button type="submit" disabled={!canSubmitForm || isLoading}>
            {isLoading ? <Spinner /> : 'Login'}
          </Button>
        </Field>
        <FieldSeparator>or</FieldSeparator>
        <Field>
          <FieldDescription className="text-center">
            <span className="me-1">Don't have an account?</span>
            <Link to="/auth/signup">Sign up</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default LoginForm
