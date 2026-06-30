import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const TicketFilters = ({
  globalFilter,
  onGlobalFilterChange,
  statusFilter,
  onStatusFilterChange,
  grouping,
  onGroupingChange,
  isAdmin,
}) => (
  <div className="flex flex-col gap-2 sm:flex-row">
    <Input
      placeholder="Search by title..."
      value={globalFilter}
      onChange={(e) => onGlobalFilterChange(e.target.value)}
      className="w-full sm:max-w-sm"
    />
    <Select value={statusFilter} onValueChange={onStatusFilterChange}>
      <SelectTrigger className="w-full sm:w-44">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="open">Open</SelectItem>
        <SelectItem value="in_progress">In Progress</SelectItem>
        <SelectItem value="on_hold">On Hold</SelectItem>
        <SelectItem value="resolved">Resolved</SelectItem>
      </SelectContent>
    </Select>
    <Select value={grouping} onValueChange={onGroupingChange}>
      <SelectTrigger className="w-full sm:w-44">
        <SelectValue placeholder="Group by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">No Grouping</SelectItem>
        <SelectItem value="status">Status</SelectItem>
        <SelectItem value="assignedTo">Assigned To</SelectItem>
        {isAdmin ? <SelectItem value="createdBy">Created By</SelectItem> : null}
      </SelectContent>
    </Select>
  </div>
)

export default TicketFilters
