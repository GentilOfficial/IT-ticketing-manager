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
        description={
          isAdmin ? 'Review and manage every open issue in the system.' : 'Review and manage the issues you submitted.'
        }
        actions={
          !isAdmin && (
            <Button asChild>
              <Link to="/new/ticket" className="flex items-center gap-2">
                <Plus className="size-4" />
                <span>New Ticket</span>
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
