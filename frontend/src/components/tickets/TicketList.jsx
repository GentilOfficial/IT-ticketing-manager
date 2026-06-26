import TicketFilters from '@/components/tickets/datatable/TicketFilters'
import TicketTable from '@/components/tickets/datatable/TicketTable'
import { buildColumns } from '@/components/tickets/datatable/columns'
import { useAuth } from '@/providers/AuthProvider'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useState } from 'react'

const TicketList = () => {
  const { token, isAdmin } = useAuth()

  const [tickets, setTickets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sorting, setSorting] = useState([])

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`${import.meta.env.VITE_API_SERVER}/api/tickets`, {
          method: 'GET',
          headers: {
            Authorization: token,
          },
        })
        const data = await res.json()
        if (!data.success) throw new Error(data.message || 'Error during ticket loading.')
        setTickets(data.tickets)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTickets()
  }, [])

  const handleStatusFilterChange = (val) => {
    setStatusFilter(val)
    table.getColumn('status')?.setFilterValue(val === 'all' ? '' : val)
  }

  const columns = buildColumns({ isAdmin })

  const table = useReactTable({
    data: tickets,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  })

  if (error) return <div className="flex items-center justify-center h-48 text-sm text-destructive">{error}</div>

  return (
    <div className="flex flex-col gap-6">
      <TicketFilters
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />
      <TicketTable table={table} columns={columns} isLoading={isLoading} />
    </div>
  )
}

export default TicketList
