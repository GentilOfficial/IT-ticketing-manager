import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { EyeIcon, EyeOff } from 'lucide-react'
import { useState } from 'react'

const FormField = ({
  name,
  visualName = name,
  type = 'text',
  placeholder = null,
  required = false,
  value = null,
  onChangeSet = () => null,
  errors = null,
  disabled = false,
}) => {
  const [viewPassword, setViewPassword] = useState(false)

  const togglePassword = () => {
    setViewPassword(!viewPassword)
  }

  return (
    <Field>
      <FieldLabel className={Array.isArray(errors) && errors.some((err) => err.field === name) && 'text-destructive'}>
        {visualName}
      </FieldLabel>
      <InputGroup>
        <InputGroupInput
          name={name}
          type={type === 'password' ? (viewPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          required={required}
          value={value}
          disabled={disabled}
          onChange={onChangeSet}
          aria-invalid={Array.isArray(errors) && errors.some((err) => err.field === name)}
        />
        {type === 'password' && (
          <InputGroupAddon align="inline-end">
            <Button type="button" size="xs" variant="ghost" onClick={togglePassword}>
              {viewPassword ? <EyeIcon className="size-4" /> : <EyeOff className="size-4" />}
            </Button>
          </InputGroupAddon>
        )}
      </InputGroup>
      {Array.isArray(errors) && errors.some((err) => err.field === name) && (
        <FieldDescription>
          <ul className="list-disc list-inside">
            {errors
              .filter((err) => err.field === name)
              .map((err, i) => (
                <li key={`error-${name}-${i}`} className="text-destructive">
                  {err.message}
                </li>
              ))}
          </ul>
        </FieldDescription>
      )}
    </Field>
  )
}

export default FormField
