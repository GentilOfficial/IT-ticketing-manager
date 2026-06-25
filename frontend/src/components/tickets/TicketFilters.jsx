import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const TicketFilters = ({ globalFilter, onGlobalFilterChange, statusFilter, onStatusFilterChange }) => (
  <div className="flex gap-2">
    <Input
      placeholder="Cerca per titolo..."
      value={globalFilter}
      onChange={(e) => onGlobalFilterChange(e.target.value)}
      className="max-w-sm"
    />
    <Select value={statusFilter} onValueChange={onStatusFilterChange}>
      <SelectTrigger className="w-44">
        <SelectValue placeholder="Stato" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Status</SelectItem>
        <SelectItem value="open">Open</SelectItem>
        <SelectItem value="in_progress">In Progress</SelectItem>
        <SelectItem value="on_hold">On Hold</SelectItem>
        <SelectItem value="resolved">Resolved</SelectItem>
      </SelectContent>
    </Select>
  </div>
)

export default TicketFilters
