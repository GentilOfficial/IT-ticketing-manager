import TicketStatusBadge from '@/components/tickets/TicketStatusBadge'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import moment from 'moment'
import { Link } from 'react-router'

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
        to={`/${isAdmin ? 'admin/' : ''}tickets/${row.original._id}`}
        className="font-medium text-sm text-left hover:underline underline-offset-2"
      >
        {getValue()}
      </Link>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <SortableHeader column={column} label="Status" />,
    cell: ({ getValue }) => <TicketStatusBadge status={getValue()} />,
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
    cell: ({ getValue }) => (
      <span className="text-sm text-muted-foreground">{moment(getValue()).format('DD/MM/YYYY hh:mm')}</span>
    ),
  },
]
