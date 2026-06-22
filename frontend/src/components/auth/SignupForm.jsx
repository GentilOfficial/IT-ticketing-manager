import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export function SignupForm() {
  return (
    <form className="flex flex-col gap-6">
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">Fill in the form below to create your account</p>
        </div>
        <Field>
          <FieldLabel>Full Name</FieldLabel>
          <Input name="name" type="text" placeholder="Federico Gentili" required />
        </Field>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input name="email" type="email" placeholder="your@email.com" required />
        </Field>
        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input name="password" type="password" required />
          <FieldDescription>Must be at least 8 characters long.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input name="confirm-password" type="password" required />
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>
        <Field>
          <Button type="submit">Create Account</Button>
        </Field>
        <FieldSeparator>or</FieldSeparator>
        <Field>
          <FieldDescription className="px-6 text-center">
            <span className="me-1">Already have an account?</span>
            <a href="#">Sign in</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
