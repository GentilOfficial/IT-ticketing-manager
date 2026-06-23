import FormField from '@/components/auth/FormField'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldSeparator } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/providers/AuthProvider'
import { useState } from 'react'
import { Link } from 'react-router'

export function SignupForm() {
  const { register, errors } = useAuth()
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const fieldErrors = Array.isArray(errors) ? errors : []
  const formError = typeof errors === 'string' ? errors : null

  const passwordsMatch = userDetails.password === userDetails.confirmPassword
  const confirmPasswordError = userDetails.confirmPassword && !passwordsMatch ? "Passwords doesn't match" : null

  const mergedFieldErrors = [
    ...fieldErrors,
    ...(confirmPasswordError ? [{ field: 'confirmPassword', message: confirmPasswordError }] : []),
  ]

  const canSubmitForm =
    userDetails.name !== '' &&
    userDetails.email !== '' &&
    userDetails.password !== '' &&
    userDetails.confirmPassword !== '' &&
    passwordsMatch

  const setUserDetailsField = (e) => {
    const { name, value } = e.target

    setUserDetails({
      ...userDetails,
      [name]: value,
    })
  }

  const resetPasswordField = () => {
    setUserDetails({
      ...userDetails,
      password: '',
      confirmPassword: '',
    })
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()

    const tryRegister = async () => {
      setIsLoading(true)
      const { confirmPassword, ...payload } = userDetails
      await register(payload)
      setIsLoading(false)
      resetPasswordField()
    }

    tryRegister()
  }

  const togglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleFormSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">Fill in the form below to create your account</p>
        </div>
        <FormField
          name="name"
          label="Full Name"
          placeholder="Federico Gentili"
          required
          value={userDetails.name}
          onChange={setUserDetailsField}
          errors={fieldErrors}
          disabled={isLoading}
        />
        <FormField
          name="email"
          label="Email"
          type="email"
          placeholder="your@email.com"
          required
          value={userDetails.email}
          onChange={setUserDetailsField}
          errors={fieldErrors}
          disabled={isLoading}
        />
        <FormField
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          required
          value={userDetails.password}
          onChange={setUserDetailsField}
          errors={fieldErrors}
          disabled={isLoading}
          passwordVisible={isPasswordVisible}
          onPasswordToggle={togglePassword}
        />
        <FormField
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          required
          value={userDetails.confirmPassword}
          onChange={setUserDetailsField}
          errors={mergedFieldErrors}
          disabled={isLoading}
          passwordVisible={isPasswordVisible}
          onPasswordToggle={togglePassword}
        />
        {formError && (
          <Field>
            <FieldDescription className="text-destructive">{formError}</FieldDescription>
          </Field>
        )}
        <Field>
          <Button type="submit" disabled={!canSubmitForm || isLoading}>
            {isLoading ? <Spinner /> : 'Create Account'}
          </Button>
        </Field>
        <FieldSeparator>or</FieldSeparator>
        <Field>
          <FieldDescription className="text-center">
            <span className="me-1">Already have an account?</span>
            <Link to="/auth/login">Sign in</Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
