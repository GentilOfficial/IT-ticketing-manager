import { Badge } from '@/components/ui/badge'
import { Shield, User } from 'lucide-react'

const ROLE_MAP = {
  admin: {
    label: 'Admin',
    icon: Shield,
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    iconClass: 'text-amber-500',
  },
  user: {
    label: 'User',
    icon: User,
    badge: 'bg-slate-50 text-slate-700 border-slate-200',
    iconClass: 'text-slate-500',
  },
}

const UserRoleBadge = ({ role, className = '' }) => {
  const config = ROLE_MAP[role] ?? ROLE_MAP.user
  const Icon = config.icon

  return (
    <Badge variant="outline" className={`gap-1.5 capitalize ${config.badge} ${className}`}>
      <Icon className={`size-3 ${config.iconClass}`} />
      {config.label}
    </Badge>
  )
}

export default UserRoleBadge
