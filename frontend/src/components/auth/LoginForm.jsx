import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export function LoginForm() {
  return (
    <form className="flex flex-col gap-6">
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">Enter your email below to login to your account</p>
        </div>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input name="email" type="email" placeholder="your@email.com" required />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel>Password</FieldLabel>
          </div>
          <Input name="password" type="password" required />
        </Field>
        <Field>
          <Button type="submit">Login</Button>
        </Field>
        <FieldSeparator>or</FieldSeparator>
        <Field>
          <FieldDescription className="text-center">
            <span className="me-1">Don't have an account?</span>
            <a href="#" className="underline underline-offset-4">
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
