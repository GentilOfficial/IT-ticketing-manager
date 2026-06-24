import { Check, X } from 'lucide-react'

const PasswordChecklist = ({ checks }) => {
  return (
    <ul className="space-y-1">
      {checks.map(({ key, label, passed }) => (
        <li key={key} className="flex items-center gap-2 text-xs text-muted-foreground">
          {passed ? <Check className="size-4 text-emerald-500" /> : <X className="size-4" />}
          <span>{label}</span>
        </li>
      ))}
    </ul>
  )
}

export default PasswordChecklist
