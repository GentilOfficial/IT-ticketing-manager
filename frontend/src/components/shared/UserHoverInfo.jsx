import UserAvatar from '@/components/shared/UserAvatar'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import moment from 'moment'

const UserHoverInfo = ({ user }) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="p-0" asChild>
          <div>{user.name}</div>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent side="left" sideOffset={12} className="max-w-52">
        <div className="flex gap-2 text-left text-sm">
          <UserAvatar user={user} />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
        </div>
        <div className="flex justify-end mt-1">
          <small className="text-muted-foreground">Joined {moment(user.createdAt).format('MMMM YYYY')}</small>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default UserHoverInfo
