import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
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
}) => {
  const [viewPassword, setViewPassword] = useState(false)

  const isPassword = type === 'password'
  const isControlledPassword = typeof passwordVisible === 'boolean'
  const isPasswordVisible = isControlledPassword ? passwordVisible : viewPassword
  const inputType = isPassword ? (isPasswordVisible ? 'text' : 'password') : type

  const handlePasswordToggle = () => {
    if (isControlledPassword) {
      onPasswordToggle(!passwordVisible)
    } else {
      setViewPassword(!viewPassword)
    }
  }

  return (
    <Field>
      <FieldLabel className={Array.isArray(errors) && errors.some((err) => err.field === name) && 'text-destructive'}>
        {label}
      </FieldLabel>
      <InputGroup>
        <InputGroupInput
          name={name}
          type={inputType}
          placeholder={placeholder}
          required={required}
          value={value}
          disabled={disabled}
          onChange={onChange}
          aria-invalid={Array.isArray(errors) && errors.some((err) => err.field === name)}
        />
        {isPassword && (
          <InputGroupAddon align="inline-end">
            <Button type="button" size="xs" variant="ghost" onClick={handlePasswordToggle}>
              {isPasswordVisible ? <EyeIcon className="size-4" /> : <EyeOff className="size-4" />}
            </Button>
          </InputGroupAddon>
        )}
      </InputGroup>
      {Array.isArray(errors) && errors.some((err) => err.field === name) && (
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
