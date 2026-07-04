import TicketFilters from '@/components/tickets/datatable/TicketFilters'
import TicketTable from '@/components/tickets/datatable/TicketTable'
import { buildColumns } from '@/components/tickets/datatable/columns'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useAuth } from '@/context/AuthContext'
import useTickets from '@/hooks/useTickets'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'

const TicketList = () => {
  const { isAdmin } = useAuth()

  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sorting, setSorting] = useState([{ id: 'createdAt', desc: true }])
  const [paginationState, setPaginationState] = useState({ pageIndex: 0, pageSize: 12 })
  const [grouping, setGrouping] = useState('none')
  const [expandedGroups, setExpandedGroups] = useState({})

  const { pageIndex, pageSize } = paginationState

  const sortEntry = sorting[0] || { id: 'createdAt', desc: true }
  const query = {
    search: globalFilter.trim(),
    status: statusFilter,
    page: pageIndex + 1,
    limit: pageSize,
    sort: sortEntry.id,
    order: sortEntry.desc ? 'desc' : 'asc',
    groupBy: grouping !== 'none' ? grouping : null,
  }

  const { tickets, groups, pagination, isLoading, error } = useTickets(query)

  const resetFilters = () => {
    setGlobalFilter('')
    setStatusFilter('all')
    setGrouping('none')
    setExpandedGroups({})
    setPaginationState({ ...paginationState, pageIndex: 0 })
  }

  const handleStatusFilterChange = (val) => {
    setStatusFilter(val)
    setExpandedGroups({})
    setPaginationState({ ...paginationState, pageIndex: 0 })
  }

  const handleSearchChange = (val) => {
    setGlobalFilter(val)
    setExpandedGroups({})
    setPaginationState({ ...paginationState, pageIndex: 0 })
  }

  const handleGroupingChange = (val) => {
    setGrouping(val)
    setExpandedGroups({})
    setPaginationState({ ...paginationState, pageIndex: 0 })
  }

  const handlePaginationChange = (updater) => {
    setExpandedGroups({})
    setPaginationState(updater)
  }

  const columns = buildColumns({ isAdmin })

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: tickets,
    columns,
    pageCount: pagination.totalPages,
    manualPagination: true,
    manualSorting: true,
    state: {
      sorting,
      pagination: { pageIndex, pageSize },
    },
    onSortingChange: (updater) => {
      const nextSorting = typeof updater === 'function' ? updater(sorting) : updater
      setSorting(nextSorting)
      setExpandedGroups({})
      setPaginationState({ ...paginationState, pageIndex: 0 })
    },
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
  })

  if (error)
    return (
      <Alert variant="destructive" className="max-w-md">
        <AlertTriangle className="size-4" />
        <AlertTitle>Unable to load tickets</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )

  return (
    <div className="flex flex-col gap-5">
      <TicketFilters
        globalFilter={globalFilter}
        onGlobalFilterChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        grouping={grouping}
        onGroupingChange={handleGroupingChange}
        isAdmin={isAdmin}
      />
      <TicketTable
        table={table}
        columns={columns}
        isLoading={isLoading}
        resetFilters={resetFilters}
        pagination={pagination}
        groups={groups}
        grouping={grouping}
        expandedGroups={expandedGroups}
        onExpandedGroupsChange={setExpandedGroups}
      />
    </div>
  )
}

export default TicketList
