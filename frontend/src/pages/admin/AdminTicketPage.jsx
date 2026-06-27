import TicketList from '@/components/tickets/TicketList'
import AppLayout from '@/layouts/AppLayout'

const AdminTicketPage = () => {
  return (
    <AppLayout>
      <div className="mb-6">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">All Tickets</h2>
        <p className="leading-7 text-muted-foreground">Check out and manage all the issues</p>
      </div>
      <TicketList />
    </AppLayout>
  )
}

export default AdminTicketPage
