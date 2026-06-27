import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { useAuth } from '@/providers/AuthProvider'
import { Eraser, Plus, TicketSlash } from 'lucide-react'
import { Link } from 'react-router'

const EmptyTickets = ({ resetFilters }) => {
  const { isAdmin } = useAuth()
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icons">
          <TicketSlash />
        </EmptyMedia>
        <EmptyTitle>No Tickets Yet</EmptyTitle>
        <EmptyDescription>
          {isAdmin
            ? "No tickets have been created yet. If you've enabled any filters, try disabling them."
            : "You haven't creted any tickets yet. If you've enabled any filters, try disabling them."}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row items-center justify-center gap-2">
        {!isAdmin && (
          <Button asChild>
            <Link to="/new/ticket">
              <Plus />
              <span>Create Ticket</span>
            </Link>
          </Button>
        )}
        <Button variant="outline" onClick={resetFilters}>
          <Eraser />
          <span>Reset Filters</span>
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export default EmptyTickets
