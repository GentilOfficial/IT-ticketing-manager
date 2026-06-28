import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import moment from 'moment'

const UserHoverInfo = ({ user }) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="p-0">
          {user.name}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent side="left" sideOffset={12} className="max-w-52">
        <div className="flex gap-2 text-left text-sm">
          <Avatar>
            <AvatarFallback className="font-semibold text-xs shrink-0">
              {user.name.slice(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
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
