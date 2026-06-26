import CreateTicketForm from '@/components/tickets/CreateTicketForm'
import AppLayout from '@/layouts/AppLayout'

const NewTicketPage = () => {
  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row align-center justify-between gap-2 mb-6">
        <div>
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">New Ticket</h2>
          <p className="leading-7 text-muted-foreground">Describe the issue in as much detail as possible</p>
        </div>
      </div>
      <CreateTicketForm />
    </AppLayout>
  )
}

export default NewTicketPage
