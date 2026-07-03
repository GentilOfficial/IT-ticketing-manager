import { getTicketById, updateTicketAssignedTo, updateTicketStatus } from '@/lib/api'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const useTicketDetails = (ticketId) => {
  const [ticket, setTicket] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [ticketStatus, setTicketStatus] = useState(null)
  const [assignedTo, setAssignedTo] = useState(null)
  const [isAssignedLoading, setIsAssignedLoading] = useState(false)
  const [isStatusLoading, setIsStatusLoading] = useState(false)

  useEffect(() => {
    const initTicket = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await getTicketById(ticketId)

        if (!data.success) {
          setError(data.message || 'Error during ticket loading.')
        } else {
          setTicket(data.ticket)
          setTicketStatus(data.ticket.status)
          setAssignedTo(data.ticket.assignedTo ? data.ticket.assignedTo._id : null)
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

  const handleTicketUpdated = (updatedTicket) => {
    setTicket(updatedTicket)
  }

  const changeTicketStatus = async (newStatus) => {
    if (!ticket) return

    setIsStatusLoading(true)

    try {
      const data = await updateTicketStatus(ticketId, newStatus)

      if (!data.success) {
        toast.error(data.message || 'Error during ticket status change', { position: 'top-center' })
      } else {
        handleTicketUpdated(data.ticket)
        setTicketStatus(data.ticket.status)
        toast.success(`Ticket status changed to ${data.ticket.status}`, { position: 'top-center' })
      }
    } catch (e) {
      console.error('Error during ticket status change:', e)
      toast.error('Network error. Please check your internet connection', { position: 'top-center' })
    } finally {
      setIsStatusLoading(false)
    }
  }

  const changeTicketAssignedTo = async (newAssignedTo) => {
    if (!ticket) return

    setIsAssignedLoading(true)

    try {
      const data = await updateTicketAssignedTo(ticketId, newAssignedTo)

      if (!data.success) {
        toast.error(data.message || 'Error during ticket assignment', { position: 'top-center' })
      } else {
        handleTicketUpdated(data.ticket)
        setAssignedTo(data.ticket.assignedTo._id)
        toast.success(`Ticket assigned to the selected admin: ${data.ticket.assignedTo.name}`, {
          position: 'top-center',
        })
      }
    } catch (e) {
      console.error('Error during ticket assignment:', e)
      toast.error('Network error. Please check your internet connection.', { position: 'top-center' })
    } finally {
      setIsAssignedLoading(false)
    }
  }

  return {
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
  }
}

export default useTicketDetails
