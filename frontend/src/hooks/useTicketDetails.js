import { getTicketById, updateTicketStatus } from '@/lib/api'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const useTicketDetails = (ticketId, token) => {
  const [ticket, setTicket] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [ticketStatus, setTicketStatus] = useState(null)

  useEffect(() => {
    const initTicket = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await getTicketById(ticketId, token)

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
  }, [ticketId, token])

  const handleTicketUpdated = (updatedTicket) => {
    setTicket({ ...updatedTicket, createdBy: ticket.createdBy })
  }

  const changeTicketStatus = async (newStatus) => {
    if (!ticket) return

    const previousStatus = ticketStatus
    setTicketStatus(newStatus)

    try {
      const data = await updateTicketStatus(ticketId, newStatus, token)

      if (!data.success) {
        setTicketStatus(previousStatus)
        toast.error(data.message || 'Error during ticket status change.', { position: 'top-center' })
      } else {
        handleTicketUpdated(data.ticket)
        setTicketStatus(data.ticket.status)
        toast.success('Ticket status changed successfully.', { position: 'top-center' })
      }
    } catch (e) {
      console.error('Error during ticket status change:', e)
      setTicketStatus(previousStatus)
      toast.error('Network error. Please check your internet connection.', { position: 'top-center' })
    }
  }

  return { ticket, isLoading, error, ticketStatus, changeTicketStatus, handleTicketUpdated }
}

export default useTicketDetails
