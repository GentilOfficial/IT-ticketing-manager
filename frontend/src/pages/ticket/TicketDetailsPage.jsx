import InitTicketLoading from '@/components/loading/InitTicketLoading'
import AppLayout from '@/layouts/AppLayout'
import ForbiddenPage from '@/pages/ForbiddenPage'
import { useAuth } from '@/providers/AuthProvider'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

const TicketDetailsPage = () => {
  const { ticketId } = useParams()
  const { token } = useAuth()
  const [ticket, setTicket] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

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

  if (error) return <ForbiddenPage />
  if (isLoading || !ticket) return <InitTicketLoading />

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row align-center justify-between gap-2 mb-6">
        <div>
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">{ticket.title}</h2>
          <p className="leading-7 text-muted-foreground">{ticket.description}</p>
        </div>
      </div>
    </AppLayout>
  )
}

export default TicketDetailsPage
