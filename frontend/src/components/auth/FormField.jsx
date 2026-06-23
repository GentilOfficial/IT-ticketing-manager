import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const FormField = ({ name, visualName, type, placeholder, required = false, value, onChangeSet, errors }) => {
  return (
    <Field>
      <FieldLabel className={Array.isArray(errors) && errors.some((err) => err.field === name) && 'text-destructive'}>
        {visualName}
      </FieldLabel>
      <Input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChangeSet}
        aria-invalid={Array.isArray(errors) && errors.some((err) => err.field === name)}
      />
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
