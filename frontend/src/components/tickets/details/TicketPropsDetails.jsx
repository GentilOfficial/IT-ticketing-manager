import UserHoverInfo from '@/components/shared/UserHoverInfo'
import TicketDetailInfoItem from '@/components/tickets/details/TicketDetailInfoItem'
import TicketStatusBadge from '@/components/tickets/TicketStatusBadge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/context/AuthContext'
import useAdmins from '@/hooks/useAdmins'
import moment from 'moment'

const TICKET_STATUS_TRANSITIONS = {
  open: ['in_progress', 'on_hold'],
  in_progress: ['resolved', 'on_hold', 'open'],
  on_hold: ['in_progress', 'open'],
  resolved: ['open'],
}

const TicketPropsDetails = ({
  ticket,
  ticketStatus,
  setTicketStatus,
  isStatusLoading,
  assignedTo,
  setAssignedTo,
  isAssignedLoading,
}) => {
  const { isAdmin } = useAuth()
  const { admins, isLoading, error } = useAdmins(isAdmin)
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
              <Select value={ticketStatus} onValueChange={setTicketStatus} disabled={isStatusLoading}>
                <SelectTrigger>
                  <SelectValue>
                    {isStatusLoading ? <Spinner /> : <TicketStatusBadge status={ticketStatus} />}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {availableStatuses.map((status) => (
                      <SelectItem key={status} value={status} className="pe-12">
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
          children={
            isAdmin ? (
              <Select
                value={assignedTo || ''}
                onValueChange={setAssignedTo}
                disabled={isAssignedLoading || isLoading || error}
              >
                <SelectTrigger>
                  <SelectValue placeholder={ticket.assignedTo ? ticket.assignedTo.name : 'N/A'}>
                    {isAssignedLoading ? <Spinner /> : ticket.assignedTo ? ticket.assignedTo.name : 'N/A'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {!isLoading &&
                      !error &&
                      admins &&
                      admins.map((admin) => (
                        <SelectItem key={admin._id} value={admin._id} className="pe-12">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium truncate">{admin.name}</span>
                            <span className="text-xs text-muted-foreground truncate">{admin.email}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : ticket.assignedTo ? (
              <UserHoverInfo user={ticket.assignedTo} />
            ) : (
              <span className="text-muted-foreground text-sm">N/A</span>
            )
          }
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
