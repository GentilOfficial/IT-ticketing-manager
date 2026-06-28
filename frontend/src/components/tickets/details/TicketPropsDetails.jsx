import UserHoverInfo from '@/components/shared/UserHoverInfo'
import TicketDetailInfoItem from '@/components/tickets/details/TicketDetailInfoItem'
import TicketStatusBadge from '@/components/tickets/TicketStatusBadge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/providers/AuthProvider'
import moment from 'moment'

const TICKET_STATUS_TRANSITIONS = {
  open: ['in_progress', 'on_hold'],
  in_progress: ['resolved', 'on_hold', 'open'],
  on_hold: ['in_progress', 'open'],
  resolved: ['open'],
}

const TicketPropsDetails = ({ ticket, ticketStatus, setTicketStatus }) => {
  const { isAdmin } = useAuth()
  const createdAt = moment(ticket.createdAt).format('DD/MM/YYYY hh:mm')
  const updatedAt = moment(ticket.updatedAt).fromNow()
  const resolvedAt = ticket.resolvedAt ? moment(ticket.resolvedAt).fromNow() : 'N/A'

  const availableStatuses = [ticket.status, ...TICKET_STATUS_TRANSITIONS[ticket.status]]

  return (
    <Card className="gap-3">
      <CardHeader>
        <h2 className="leading-7 text-muted-foreground text-md font-semibold">Details</h2>
      </CardHeader>
      <Separator />
      <CardContent>
        <TicketDetailInfoItem
          label="Status"
          children={
            isAdmin ? (
              <Select value={ticketStatus} onValueChange={setTicketStatus}>
                <SelectTrigger>
                  <SelectValue>
                    <TicketStatusBadge status={ticketStatus} />
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {availableStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        <TicketStatusBadge status={status} />
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : (
              <TicketStatusBadge status={ticketStatus} />
            )
          }
        />
      </CardContent>
      {isAdmin && (
        <>
          <Separator />
          <CardContent>
            <TicketDetailInfoItem label="Created By" children={<UserHoverInfo user={ticket.createdBy} />} />
          </CardContent>
        </>
      )}
      <Separator />
      <CardContent>
        <TicketDetailInfoItem
          label="Assigned To"
          children={ticket.assignedTo ? <UserHoverInfo user={ticket.assignedTo} /> : <div>N/A</div>}
        />
      </CardContent>
      <Separator />
      <CardContent>
        <TicketDetailInfoItem label="Resolved At" value={resolvedAt} />
      </CardContent>
      <Separator />
      <CardContent>
        <TicketDetailInfoItem label="Created At" value={createdAt} />
      </CardContent>
      <Separator />
      <CardContent>
        <TicketDetailInfoItem label="Updated At" value={updatedAt} />
      </CardContent>
    </Card>
  )
}

export default TicketPropsDetails
