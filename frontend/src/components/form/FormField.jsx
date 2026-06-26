import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Textarea } from '@/components/ui/textarea'
import { EyeIcon, EyeOff } from 'lucide-react'
import { useState } from 'react'

const FormField = ({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  value,
  onChange = () => null,
  errors,
  disabled = false,
  passwordVisible,
  onPasswordToggle = () => null,
  multiline = false,
  minLength,
  maxLength,
  className,
}) => {
  const [viewPassword, setViewPassword] = useState(false)

  const isPassword = type === 'password'
  const isControlledPassword = typeof passwordVisible === 'boolean'
  const isPasswordVisible = isControlledPassword ? passwordVisible : viewPassword
  const inputType = isPassword ? (isPasswordVisible ? 'text' : 'password') : type

  const hasFieldError = Array.isArray(errors) && errors.some((err) => err.field === name)

  const handlePasswordToggle = () => {
    if (isControlledPassword) {
      onPasswordToggle(!passwordVisible)
    } else {
      setViewPassword(!viewPassword)
    }
  }

  return (
    <Field>
      <FieldLabel className={hasFieldError && 'text-destructive'}>{label}</FieldLabel>
      {multiline ? (
        <div className="relative">
          <Textarea
            name={name}
            placeholder={placeholder}
            required={required}
            value={value}
            disabled={disabled}
            onChange={onChange}
            minLength={minLength}
            maxLength={maxLength}
            aria-invalid={hasFieldError}
            className={className}
          />
          {maxLength && (
            <p className="absolute bottom-2 right-2 px-1 text-xs backdrop-blur-md rounded-sm border shadow-xs">
              <span className={value.length > maxLength ? 'text-destructive' : 'text-muted-foreground'}>
                {value.length} / {maxLength}
              </span>
            </p>
          )}
        </div>
      ) : (
        <InputGroup>
          <InputGroupInput
            name={name}
            type={inputType}
            placeholder={placeholder}
            required={required}
            value={value}
            disabled={disabled}
            onChange={onChange}
            minLength={minLength}
            maxLength={maxLength}
            aria-invalid={hasFieldError}
          />
          {isPassword && (
            <InputGroupAddon align="inline-end">
              <Button type="button" size="xs" variant="ghost" onClick={handlePasswordToggle}>
                {isPasswordVisible ? <EyeIcon className="size-4" /> : <EyeOff className="size-4" />}
              </Button>
            </InputGroupAddon>
          )}
        </InputGroup>
      )}
      {hasFieldError && (
        <ul className="list-disc list-inside text-xs">
          {errors
            .filter((err) => err.field === name)
            .map((err, i) => (
              <li key={`error-${name}-${i}`} className="text-destructive">
                {err.message}
              </li>
            ))}
        </ul>
      )}
    </Field>
  )
}

export default FormField
