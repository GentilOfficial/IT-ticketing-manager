import { Badge } from '@/components/ui/badge'
import { KeyRound, Mail } from 'lucide-react'

const PROVIDER_MAP = {
  google: {
    label: 'Google',
    icon: Mail,
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    iconClass: 'text-rose-500',
  },
  local: {
    label: 'Local',
    icon: KeyRound,
    badge: 'bg-slate-50 text-slate-700 border-slate-200',
    iconClass: 'text-slate-500',
  },
}

const AuthProviderBadge = ({ provider, className = '' }) => {
  const config = PROVIDER_MAP[provider] ?? PROVIDER_MAP.local
  const Icon = config.icon

  return (
    <Badge variant="outline" className={`gap-1.5 capitalize ${config.badge} ${className}`}>
      <Icon className={`size-3 ${config.iconClass}`} />
      {config.label}
    </Badge>
  )
}

export default AuthProviderBadge
