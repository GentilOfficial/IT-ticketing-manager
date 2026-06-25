import TicketList from '@/components/tickets/TicketList'
import { Button } from '@/components/ui/button'
import AppLayout from '@/layouts/AppLayout'
import { Plus } from 'lucide-react'

const AdminTicketPage = () => {
  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row align-center justify-between gap-2 mb-6">
        <div>
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">All Tickets</h2>
          <p className="leading-7 text-muted-foreground">Check out and manage all the issues</p>
        </div>
        <Button>
          <Plus />
          New Ticket
        </Button>
      </div>
      <TicketList />
    </AppLayout>
  )
}

export default AdminTicketPage
