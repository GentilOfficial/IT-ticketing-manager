import UserHoverInfo from '@/components/shared/UserHoverInfo'
import SortableHeader from '@/components/tickets/datatable/SortableHeader'
import TicketStatusBadge from '@/components/tickets/TicketStatusBadge'
import moment from 'moment'
import { Link } from 'react-router'

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
          accessorKey: 'createdBy',
          accessorFn: (row) => (row.createdBy ? row.createdBy.name : 'N/A'),
          header: 'Created By',
          cell: ({ row }) =>
            row.original.createdBy ? (
              <UserHoverInfo user={row.original.createdBy} />
            ) : (
              <span className="text-sm text-muted-foreground">N/A</span>
            ),
        },
      ]
    : []),
  {
    accessorKey: 'assignedTo',
    accessorFn: (row) => (row.assignedTo ? row.assignedTo.name : 'N/A'),
    header: 'Assigned To',
    cell: ({ row }) =>
      row.original.assignedTo ? (
        <UserHoverInfo user={row.original.assignedTo} />
      ) : (
        <span className="text-sm text-muted-foreground">N/A</span>
      ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <SortableHeader column={column} label="Created At" />,
    cell: ({ getValue }) => (
      <span className="text-sm text-muted-foreground">{moment(getValue()).format('DD/MM/YYYY hh:mm')}</span>
    ),
  },
]
