import EmptyTickets from '@/components/empty/EmptyTickets'
import InitTicketsLoading from '@/components/loading/InitTicketsLoading'
import UserHoverInfo from '@/components/shared/UserHoverInfo'
import TicketStatusBadge from '@/components/tickets/TicketStatusBadge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { flexRender } from '@tanstack/react-table'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Fragment } from 'react'

const PAGE_SIZE_OPTIONS = [12, 24, 48]
const GROUP_LABELS = {
  status: 'Status',
  createdBy: 'Created By',
  assignedTo: 'Assigned To',
}

const TicketTable = ({
  table,
  columns,
  isLoading,
  resetFilters,
  pagination,
  groups = [],
  grouping,
  expandedGroups = {},
  onExpandedGroupsChange = () => {},
}) => {
  const { pageIndex, pageSize } = table.getState().pagination
  const rows = table.getRowModel().rows
  const ticketRows = table.getCoreRowModel().rows
  const visibleColumns = table.getVisibleLeafColumns()
  const total = pagination?.total ?? ticketRows.length
  const firstItem = total === 0 ? 0 : pageIndex * pageSize + 1
  const lastItem = total === 0 ? 0 : firstItem + ticketRows.length - 1
  const isGrouped = grouping !== 'none' && groups.length > 0
  const rowByTicketId = {}

  ticketRows.forEach((row) => {
    rowByTicketId[row.original._id] = row
  })

  const toggleGroup = (groupKey) => {
    onExpandedGroupsChange({
      ...expandedGroups,
      [groupKey]: !expandedGroups[groupKey],
    })
  }

  const renderGroupValue = (group) => {
    if (grouping === 'status') {
      return <TicketStatusBadge status={group.value} />
    }

    return group.value ? (
      <UserHoverInfo user={group.value} />
    ) : (
      <span className="text-sm text-muted-foreground">{group.label}</span>
    )
  }

  const renderTicketRow = (row) => (
    <TableRow key={row.id} className="hover:bg-muted/50">
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  )

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-12">
                  <InitTicketsLoading />
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              isGrouped ? (
                groups.map((group) => {
                  const isExpanded = Boolean(expandedGroups[group.key])

                  return (
                    <Fragment key={group.key}>
                      <TableRow className="bg-muted/40">
                        {visibleColumns.map((column, index) => (
                          <TableCell key={`${group.key}-${column.id}`}>
                            {index === 0 ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="-ml-2 gap-2"
                                onClick={() => toggleGroup(group.key)}
                              >
                                <ChevronDown className={`transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
                                <span className="text-muted-foreground">{GROUP_LABELS[grouping]}</span>
                                {renderGroupValue(group)}
                                <span className="text-muted-foreground">({group.count})</span>
                              </Button>
                            ) : null}
                          </TableCell>
                        ))}
                      </TableRow>
                      {isExpanded
                        ? (group.tickets || [])
                            .map((ticket) => rowByTicketId[ticket._id])
                            .filter(Boolean)
                            .map(renderTicketRow)
                        : null}
                    </Fragment>
                  )
                })
              ) : (
                rows.map(renderTicketRow)
              )
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-12">
                  <EmptyTickets resetFilters={resetFilters} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <small>
          Showing {firstItem}-{lastItem} of {total} tickets
        </small>
        <div className="flex items-center gap-2">
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
            disabled={isLoading}
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((option) => (
                <SelectItem key={option} value={`${option}`}>
                  {option} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={isLoading || !table.getCanPreviousPage()}
          >
            <ChevronLeft />
            Previous
          </Button>
          <Button variant="outline" onClick={() => table.nextPage()} disabled={isLoading || !table.getCanNextPage()}>
            Next
            <ChevronRight />
          </Button>
        </div>
      </div>
    </>
  )
}

export default TicketTable
