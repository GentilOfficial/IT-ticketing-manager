import InitTicketLoading from '@/components/loading/InitTicketLoading'
import MainTicketDetails from '@/components/tickets/details/MainTicketDetails'
import TicketPropsDetails from '@/components/tickets/details/TicketPropsDetails'
import { Button } from '@/components/ui/button'
import AppLayout from '@/layouts/AppLayout'
import ForbiddenPage from '@/pages/ForbiddenPage'
import { useAuth } from '@/providers/AuthProvider'
import { ChevronLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { toast } from 'sonner'

const TicketDetailsPage = () => {
  const { ticketId } = useParams()
  const { token, isAdmin } = useAuth()
  const [ticket, setTicket] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [ticketStatus, setTicketStatus] = useState(null)

  useEffect(() => {
    const initTicket = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`${import.meta.env.VITE_API_SERVER}/api/tickets/${ticketId}`, {
          method: 'GET',
          headers: {
            Authorization: token,
          },
        })
        const data = await response.json()

        if (!data.success) {
          setError(data.message || 'Error during ticket loading.')
        } else {
          setTicket(data.ticket)
          setTicketStatus(data.ticket.status)
        }
      } catch (e) {
        console.error('Error during ticket loading:', e)
        setError('Network error. Please check your internet connection.')
      } finally {
        setIsLoading(false)
      }
    }

    initTicket()
  }, [ticketId])

  const changeTicketStatus = async (newStatus) => {
    const preStatus = ticketStatus
    setTicketStatus(newStatus)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_SERVER}/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (!data.success) {
        setTicketStatus(preStatus)
        toast.error(data.message || 'Error during ticket status change.', { position: 'top-center' })
      } else {
        setTicket({ ...data.ticket, createdBy: ticket.createdBy })
        setTicketStatus(data.ticket.status)
        toast.success('Ticket status changed successfully.', { position: 'top-center' })
      }
    } catch (e) {
      console.error('Error during ticket status change:', e)
      setTicketStatus(preStatus)
      toast.error('Network error. Please check your internet connection.', { position: 'top-center' })
    }
  }

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
          <MainTicketDetails ticket={ticket} ticketStatus={ticketStatus} />
        </div>
        <TicketPropsDetails ticket={ticket} ticketStatus={ticketStatus} setTicketStatus={changeTicketStatus} />
      </div>
    </AppLayout>
  )
}

export default TicketDetailsPage
