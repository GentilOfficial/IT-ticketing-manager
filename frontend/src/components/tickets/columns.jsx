import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, CircleCheck, CircleDot, Clock, ClockAlert } from 'lucide-react'
import { Link } from 'react-router'

export const STATUS_MAP = {
  open: { label: 'Open', icon: CircleDot, class: 'text-blue-500', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  in_progress: {
    label: 'In Progress',
    icon: Clock,
    class: 'text-yellow-500',
    badge: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
  resolved: {
    label: 'Resolved',
    icon: CircleCheck,
    class: 'text-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  on_hold: {
    label: 'On Hold',
    icon: ClockAlert,
    class: 'text-purple-500',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
  },
}

const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status] ?? STATUS_MAP.open
  const Icon = s.icon
  return (
    <Badge variant="outline" className={`gap-1.5 ${s.badge}`}>
      <Icon className={`size-3 ${s.class}`} />
      {s.label}
    </Badge>
  )
}

const SortableHeader = ({ column, label }) => (
  <Button
    variant="ghost"
    size="sm"
    className="-ml-3 h-8"
    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  >
    {label}
    <ArrowUpDown className="ml-2 size-3.5 text-muted-foreground" />
  </Button>
)

export const buildColumns = ({ isAdmin }) => [
  {
    accessorKey: '_id',
    header: '#',
    cell: ({ getValue }) => <span className="text-muted-foreground text-xs font-mono"># {getValue()}</span>,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <SortableHeader column={column} label="Title" />,
    cell: ({ getValue, row }) => (
      <Link
        to={`/tickets/${row.original._id}`}
        className="font-medium text-sm text-left hover:underline underline-offset-2"
      >
        {getValue()}
      </Link>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <SortableHeader column={column} label="Status" />,
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
    filterFn: (row, _, filterValue) => filterValue === 'all' || row.original.status === filterValue,
  },
  ...(isAdmin
    ? [
        {
          id: 'createdBy',
          accessorFn: (row) => row.createdBy?.email,
          header: ({ column }) => <SortableHeader column={column} label="Created By" />,
          cell: ({ getValue }) => <span className="text-sm text-muted-foreground">{getValue() ?? '—'}</span>,
        },
      ]
    : []),
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <SortableHeader column={column} label="Creato At" />,
    cell: ({ getValue }) => <span className="text-sm text-muted-foreground">{getValue()}</span>,
  },
]
