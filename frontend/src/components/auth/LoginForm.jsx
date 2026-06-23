import FormField from '@/components/auth/FormField'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldSeparator } from '@/components/ui/field'
import { useAuth } from '@/providers/AuthProvider'
import { useState } from 'react'
import { Link } from 'react-router'

export function LoginForm() {
  const { login, errors } = useAuth()
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  })
  const canSubmitForm = credentials.email !== '' && credentials.password !== ''

  const setCredentialsField = (e) => {
    const { name, value } = e.target
    setCredentials({
      ...credentials,
      [name]: value.trim(),
    })
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()

    const tryLogin = async () => {
      await login(credentials)
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
          visualName="Email"
          type="email"
          placeholder="your@email.com"
          required
          value={credentials.email}
          onChangeSet={setCredentialsField}
          errors={errors}
        />
        <FormField
          name="password"
          visualName="Password"
          type="password"
          placeholder="••••••••"
          required
          value={credentials.password}
          onChangeSet={setCredentialsField}
          errors={errors}
        />
        <Field>
          {typeof errors === 'string' && <FieldDescription className="text-destructive">{errors}</FieldDescription>}
          <Button type="submit" disabled={!canSubmitForm}>
            Login
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
