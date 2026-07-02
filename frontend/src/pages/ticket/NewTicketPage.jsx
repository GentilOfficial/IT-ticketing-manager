import PageHeader from '@/components/shared/PageHeader'
import CreateTicketForm from '@/components/tickets/CreateTicketForm'
import AppLayout from '@/layouts/AppLayout'

const NewTicketPage = () => {
  useEffect(() => {
    document.title = 'Helpdesk - Create Ticket'
  }, [])

  return (
    <AppLayout>
      <PageHeader title="New Ticket" description="Describe the issue in as much detail as possible" />
      <CreateTicketForm />
    </AppLayout>
  )
}

export default NewTicketPage
