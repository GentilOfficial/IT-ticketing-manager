import { CircleCheck, CircleDot, Clock, ClockAlert } from 'lucide-react'
import { Badge } from '../ui/badge'

const STATUS_MAP = {
  open: {
    label: 'Open',
    icon: CircleDot,
    class: 'text-blue-500',
    badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  },
  in_progress: {
    label: 'In Progress',
    icon: Clock,
    class: 'text-yellow-500',
    badge:
      'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
  },
  resolved: {
    label: 'Resolved',
    icon: CircleCheck,
    class: 'text-emerald-500',
    badge:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
  },
  on_hold: {
    label: 'On Hold',
    icon: ClockAlert,
    class: 'text-purple-500',
    badge:
      'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
  },
}

const TicketStatusBadge = ({ status }) => {
  const s = STATUS_MAP[status] ?? STATUS_MAP.open
  const Icon = s.icon
  return (
    <Badge variant="outline" className={`gap-1.5 ${s.badge}`}>
      <Icon className={`size-3 ${s.class}`} />
      {s.label}
    </Badge>
  )
}

export default TicketStatusBadge
