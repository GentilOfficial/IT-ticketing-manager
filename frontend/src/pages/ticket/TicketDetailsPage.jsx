import InitTicketLoading from '@/components/loading/InitTicketLoading'
import MainTicketDetails from '@/components/tickets/details/MainTicketDetails'
import TicketPropsDetails from '@/components/tickets/details/TicketPropsDetails'
import { Button } from '@/components/ui/button'
import useTicketDetails from '@/hooks/useTicketDetails'
import AppLayout from '@/layouts/AppLayout'
import ForbiddenPage from '@/pages/ForbiddenPage'
import { useAuth } from '@/providers/AuthProvider'
import { ChevronLeft } from 'lucide-react'
import { Link, useParams } from 'react-router'

const TicketDetailsPage = () => {
  const { ticketId } = useParams()
  const { token, isAdmin } = useAuth()
  const { ticket, isLoading, error, ticketStatus, changeTicketStatus, handleTicketUpdated } = useTicketDetails(
    ticketId,
    token,
  )

  if (error) return <ForbiddenPage />
  if (isLoading || !ticket) return <InitTicketLoading />

  return (
    <AppLayout>
      <Button asChild variant="link" className="px-0 mb-2">
        <Link to={isAdmin ? '/admin/tickets' : '/tickets'}>
          <ChevronLeft />
          <span>All Tickets</span>
        </Link>
      </Button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <MainTicketDetails ticket={ticket} ticketStatus={ticketStatus} onTicketUpdated={handleTicketUpdated} />
        </div>
        <TicketPropsDetails ticket={ticket} ticketStatus={ticketStatus} setTicketStatus={changeTicketStatus} />
      </div>
    </AppLayout>
  )
}

export default TicketDetailsPage
