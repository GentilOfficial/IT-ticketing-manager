import PageHeader from '@/components/shared/PageHeader'
import TicketList from '@/components/tickets/TicketList'
import TicketStats from '@/components/tickets/TicketStats'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import AppLayout from '@/layouts/AppLayout'
import { Plus } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router'

const TicketsPage = () => {
  const { isAdmin } = useAuth()

  useEffect(() => {
    document.title = `Helpdesk ${isAdmin && '| Administration'} - All Tickets`
  }, [isAdmin])

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
      <div className="flex flex-col gap-6">
        <TicketStats />
        <TicketList />
      </div>
    </AppLayout>
  )
}

export default TicketsPage
