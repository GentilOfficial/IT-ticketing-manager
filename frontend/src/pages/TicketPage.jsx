import TicketList from '@/components/tickets/TicketList'
import { Button } from '@/components/ui/button'
import AppLayout from '@/layouts/AppLayout'
import { Plus } from 'lucide-react'
import { Link } from 'react-router'

const TicketPage = () => {
  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row align-center justify-between gap-2 mb-6">
        <div>
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">My Tickets</h2>
          <p className="leading-7 text-muted-foreground">Check out and manage all your issues</p>
        </div>
        <Button asChild>
          <Link to="/tickets/new">
            <Plus />
            New Ticket
          </Link>
        </Button>
      </div>
      <TicketList />
    </AppLayout>
  )
}

export default TicketPage
