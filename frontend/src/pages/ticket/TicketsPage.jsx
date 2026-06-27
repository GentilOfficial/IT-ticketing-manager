import PageHeader from '@/components/shared/PageHeader'
import TicketList from '@/components/tickets/TicketList'
import { Button } from '@/components/ui/button'
import AppLayout from '@/layouts/AppLayout'
import { useAuth } from '@/providers/AuthProvider'
import { Plus } from 'lucide-react'
import { Link } from 'react-router'

const TicketsPage = () => {
  const { isAdmin } = useAuth()

  return (
    <AppLayout>
      <PageHeader
        title={isAdmin ? 'All Tickets' : 'My Tickets'}
        description={isAdmin ? 'Check out and manage all the issues' : 'Check out and manage all your issues'}
        actions={
          !isAdmin && (
            <Button asChild>
              <Link to="/new/ticket">
                <Plus />
                New Ticket
              </Link>
            </Button>
          )
        }
      />
      <TicketList />
    </AppLayout>
  )
}

export default TicketsPage
