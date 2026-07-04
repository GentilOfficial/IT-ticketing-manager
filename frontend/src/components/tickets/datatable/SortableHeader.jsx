import { Button } from '@/components/ui/button'
import { ArrowDownNarrowWide, ArrowUpDown, ArrowUpNarrowWide } from 'lucide-react'

const SortableHeader = ({ column, label }) => (
  <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={column.getToggleSortingHandler()}>
    {label}{' '}
    {column.getIsSorted() === 'asc' ? (
      <ArrowDownNarrowWide className="ml-2 size-3.5" />
    ) : column.getIsSorted() === 'desc' ? (
      <ArrowUpNarrowWide className="ml-2 size-3.5" />
    ) : (
      <ArrowUpDown className="ml-2 size-3.5 text-muted-foreground" />
    )}
  </Button>
)

export default SortableHeader
