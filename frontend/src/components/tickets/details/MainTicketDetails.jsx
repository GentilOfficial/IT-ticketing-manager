import TicketStatusBadge from '@/components/tickets/TicketStatusBadge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/providers/AuthProvider'
import moment from 'moment'

const MainTicketDetails = ({ ticket, ticketStatus }) => {
  const { user } = useAuth()
  const creator = ticket.createdBy._id === user._id ? 'you' : ticket.createdBy.name
  const diffDate = moment(ticket.createdAt).fromNow()

  return (
    <Card>
      <CardHeader>
        <code className="leading-7 text-muted-foreground/75">#{ticket._id}</code>
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">{ticket.title}</h2>
        <div className="flex items-center gap-2 text-muted-foreground/75 text-nowrap overflow-x-auto py-1">
          <TicketStatusBadge status={ticketStatus} />
          <Separator orientation="vertical" />
          <small>created by {creator}</small>
          <Separator orientation="vertical" />
          <small>{diffDate}</small>
        </div>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        <Separator className="mb-4" />
        <p className="leading-7 text-muted-foreground">{ticket.description}</p>
      </CardContent>
    </Card>
  )
}

export default MainTicketDetails
