import InitTicketLoading from '@/components/loading/InitTicketLoading'
import TicketComments from '@/components/tickets/details/comments/TicketComments'
import MainTicketDetails from '@/components/tickets/details/MainTicketDetails'
import TicketPropsDetails from '@/components/tickets/details/TicketPropsDetails'
import { Button } from '@/components/ui/button'
import useTicketDetails from '@/hooks/useTicketDetails'
import AppLayout from '@/layouts/AppLayout'
import ForbiddenPage from '@/pages/ForbiddenPage'
import { useAuth } from '@/providers/AuthProvider'
import { ChevronLeft } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router'

const TicketDetailsPage = () => {
  const { ticketId } = useParams()
  const { token, isAdmin } = useAuth()
  const {
    ticket,
    isLoading,
    error,
    ticketStatus,
    changeTicketStatus,
    isStatusLoading,
    assignedTo,
    changeTicketAssignedTo,
    isAssignedLoading,
    handleTicketUpdated,
  } = useTicketDetails(ticketId, token)

  useEffect(() => {
    if (!error && !isLoading && ticket)
      document.title = `Helpdesk ${isAdmin && '| Administration'} - Ticket: ${ticketId}`
  }, [ticket])

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="order-1 lg:col-span-2">
          <MainTicketDetails ticket={ticket} ticketStatus={ticketStatus} onTicketUpdated={handleTicketUpdated} />
        </div>
        <div className="order-2 lg:col-span-1 lg:row-span-2">
          <TicketPropsDetails
            ticket={ticket}
            ticketStatus={ticketStatus}
            setTicketStatus={changeTicketStatus}
            isStatusLoading={isStatusLoading}
            assignedTo={assignedTo}
            setAssignedTo={changeTicketAssignedTo}
            isAssignedLoading={isAssignedLoading}
          />
        </div>
        <div className="order-3 lg:col-span-2">
          <TicketComments ticketId={ticketId} />
        </div>
      </div>
    </AppLayout>
  )
}

export default TicketDetailsPage
